import type { Metadata } from "next";
import {
  Ban,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Filter,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  UserRound
} from "lucide-react";

import {
  blockConsultationSlot,
  signInAdmin,
  signOutAdmin,
  unblockConsultationSlot,
  updateLeadStatus
} from "@/app/admin/actions";
import {
  BOOKING_TIME_ZONE,
  buildBookableDays,
  getBookableTimesForDate,
  getBookingDateTime,
  getConsultationTimes,
  type BookableDay
} from "@/lib/booking";
import {
  getAdminSession,
  getConfiguredAdminEmail,
  isAdminAuthConfigured
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    follow: false,
    index: false
  }
};

export const dynamic = "force-dynamic";

type AdminSearchParams = {
  auth?: string | string[];
  date?: string | string[];
  slot?: string | string[];
  lead?: string | string[];
};

type AdminPageProps = {
  searchParams?: Promise<AdminSearchParams>;
};

const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];
const calendarFilterDayCount = 12;

const adminMessages = {
  "auth:config": "Admin sign-in is not configured yet.",
  "auth:failed": "The email or password did not match.",
  "auth:required": "Please sign in to manage the consultation calendar.",
  "auth:signed-out": "You have been signed out.",
  "slot:already-blocked": "That slot is already blocked.",
  "slot:blocked": "The slot has been blocked.",
  "slot:booked": "That slot already has a booked consultation.",
  "slot:error": "The slot change could not be saved.",
  "slot:invalid": "Choose a valid future weekday slot.",
  "slot:unblocked": "The slot has been reopened.",
  "lead:error": "The booking status could not be updated.",
  "lead:invalid": "Choose a valid booking status.",
  "lead:updated": "The booking status has been updated."
};

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getAdminMessage(searchParams: AdminSearchParams) {
  const auth = getFirstParam(searchParams.auth);
  const slot = getFirstParam(searchParams.slot);
  const lead = getFirstParam(searchParams.lead);
  const messageKey = auth
    ? (`auth:${auth}` as keyof typeof adminMessages)
    : slot
      ? (`slot:${slot}` as keyof typeof adminMessages)
      : lead
        ? (`lead:${lead}` as keyof typeof adminMessages)
        : null;

  return messageKey ? adminMessages[messageKey] : null;
}

function slotKey(date: string, time: string) {
  return `${date}|${time}`;
}

function getSelectedCalendarDate(
  searchParams: AdminSearchParams,
  days: BookableDay[]
) {
  const requestedDate = getFirstParam(searchParams.date);

  if (requestedDate && days.some((day) => day.iso === requestedDate)) {
    return requestedDate;
  }

  return days[0]?.iso ?? getBookingDateTime().date;
}

function getDateHref(date: string) {
  return `/admin?date=${encodeURIComponent(date)}`;
}

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: BOOKING_TIME_ZONE
  }).format(value);
}

async function getDashboardData(days: BookableDay[], selectedDate: string) {
  const today = getBookingDateTime().date;
  const [bookings, calendarBookings, blockedSlots, blockedSlotCount] =
    await Promise.all([
      prisma.leadInquiry.findMany({
        where: {
          consultationDate: {
            gte: today
          },
          consultationTimeZone: BOOKING_TIME_ZONE
        },
        orderBy: [
          {
            consultationDate: "asc"
          },
          {
            consultationTime: "asc"
          }
        ],
        select: {
          id: true,
          createdAt: true,
          name: true,
          email: true,
          phone: true,
          clientType: true,
          serviceInterest: true,
          consultationDate: true,
          consultationTime: true,
          timeline: true,
          budgetRange: true,
          message: true,
          status: true
        }
      }),
      prisma.leadInquiry.findMany({
        where: {
          consultationDate: selectedDate,
          consultationTimeZone: BOOKING_TIME_ZONE
        },
        orderBy: {
          consultationTime: "asc"
        },
        select: {
          id: true,
          createdAt: true,
          name: true,
          email: true,
          phone: true,
          clientType: true,
          serviceInterest: true,
          consultationDate: true,
          consultationTime: true,
          timeline: true,
          budgetRange: true,
          message: true,
          status: true
        }
      }),
      prisma.blockedConsultationSlot.findMany({
        where: {
          date: selectedDate,
          timeZone: BOOKING_TIME_ZONE
        },
        orderBy: [
          {
            date: "asc"
          },
          {
            time: "asc"
          }
        ],
        select: {
          id: true,
          createdAt: true,
          date: true,
          time: true,
          reason: true,
          blockedByEmail: true
        }
      }),
      prisma.blockedConsultationSlot.count({
        where: {
          date: {
            gte: today
          },
          timeZone: BOOKING_TIME_ZONE
        },
      })
    ]);

  return {
    blockedSlotCount,
    blockedSlots,
    bookings,
    calendarBookings,
    days,
    selectedDate
  };
}

function AdminMessage({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="form-alert admin-message" role="status">
      <CheckCircle2 aria-hidden="true" size={20} />
      <p>{message}</p>
    </div>
  );
}

function AdminLogin({
  message,
  isConfigured
}: {
  message: string | null;
  isConfigured: boolean;
}) {
  return (
    <section className="section admin-auth-section">
      <div className="admin-login">
        <LockKeyhole aria-hidden="true" size={34} />
        <p className="eyebrow">Admin access</p>
        <h1>Manage consultation bookings</h1>
        <p>
          Sign in with the SmaKTis admin email to view booked sessions and manage
          calendar availability.
        </p>

        <AdminMessage
          message={
            isConfigured
              ? message
              : "Admin sign-in needs ADMIN_PASSWORD in the environment."
          }
        />

        <form action={signInAdmin} className="admin-login-form">
          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              defaultValue={getConfiguredAdminEmail()}
              name="email"
              required
              type="email"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
            />
          </label>
          <button className="button" disabled={!isConfigured} type="submit">
            <span>Sign in</span>
            <LockKeyhole aria-hidden="true" size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
type Booking = DashboardData["bookings"][number];
type BlockedSlot = DashboardData["blockedSlots"][number];

function BlockSlotForm({
  days = buildBookableDays(calendarFilterDayCount),
  date,
  defaultDate,
  time,
  compact = false
}: {
  days?: BookableDay[];
  date?: string;
  defaultDate?: string;
  time?: string;
  compact?: boolean;
}) {
  const times = getConsultationTimes();

  return (
    <form
      action={blockConsultationSlot}
      className={compact ? "admin-slot-form compact" : "admin-slot-form"}
    >
      {date ? (
        <input name="date" type="hidden" value={date} />
      ) : (
        <label>
          <span>Date</span>
          <select defaultValue={defaultDate} name="date" required>
            {days.map((day) => (
              <option key={day.iso} value={day.iso}>
                {day.weekday} {day.day} {day.month}
              </option>
            ))}
          </select>
        </label>
      )}

      {time ? (
        <input name="time" type="hidden" value={time} />
      ) : (
        <label>
          <span>Time</span>
          <select name="time" required>
            {times.map((slotTime) => (
              <option key={slotTime} value={slotTime}>
                {slotTime}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        <span>Reason</span>
        <input name="reason" placeholder="Optional" />
      </label>

      <button className="button secondary button-small" type="submit">
        <span>Block</span>
        <Ban aria-hidden="true" size={16} />
      </button>
    </form>
  );
}

function BookingSlot({
  booking,
  returnDate
}: {
  booking: Booking;
  returnDate: string;
}) {
  return (
    <article className="admin-slot booked">
      <div className="admin-slot-heading">
        <strong>{booking.consultationTime}</strong>
        <span>{booking.status}</span>
      </div>
      <h3>{booking.name}</h3>
      <p>{booking.serviceInterest}</p>
      <div className="admin-contact-lines">
        <a href={`mailto:${booking.email}`}>
          <Mail aria-hidden="true" size={15} />
          {booking.email}
        </a>
        {booking.phone ? (
          <a href={`tel:${booking.phone}`}>
            <Phone aria-hidden="true" size={15} />
            {booking.phone}
          </a>
        ) : null}
      </div>
      <form action={updateLeadStatus} className="admin-status-form">
        <input name="id" type="hidden" value={booking.id} />
        <input name="returnDate" type="hidden" value={returnDate} />
        <select
          aria-label="Booking status"
          name="status"
          defaultValue={booking.status}
        >
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="button secondary button-small" type="submit">
          Save
        </button>
      </form>
    </article>
  );
}

function BlockedSlotCard({
  blockedSlot,
  returnDate
}: {
  blockedSlot: BlockedSlot;
  returnDate: string;
}) {
  return (
    <article className="admin-slot blocked">
      <div className="admin-slot-heading">
        <strong>{blockedSlot.time}</strong>
        <span>Blocked</span>
      </div>
      <p>{blockedSlot.reason || "Unavailable"}</p>
      <small>
        Blocked {formatSubmittedAt(blockedSlot.createdAt)}
        {blockedSlot.blockedByEmail ? ` by ${blockedSlot.blockedByEmail}` : ""}
      </small>
      <form action={unblockConsultationSlot}>
        <input name="id" type="hidden" value={blockedSlot.id} />
        <input name="returnDate" type="hidden" value={returnDate} />
        <button className="button secondary button-small" type="submit">
          Reopen
        </button>
      </form>
    </article>
  );
}

function FreeSlot({ date, time }: { date: string; time: string }) {
  return (
    <article className="admin-slot free">
      <div className="admin-slot-heading">
        <strong>{time}</strong>
        <span>Open</span>
      </div>
      <BlockSlotForm compact date={date} time={time} />
    </article>
  );
}

function AdminDashboard({
  data,
  message,
  sessionEmail
}: {
  data: DashboardData;
  message: string | null;
  sessionEmail: string;
}) {
  const bookingsBySlot = new Map(
    data.calendarBookings.map((booking) => [
      slotKey(booking.consultationDate, booking.consultationTime),
      booking
    ])
  );
  const blockedBySlot = new Map(
    data.blockedSlots.map((blockedSlot) => [
      slotKey(blockedSlot.date, blockedSlot.time),
      blockedSlot
    ])
  );
  const newBookingCount = data.bookings.filter(
    (booking) => booking.status === "NEW"
  ).length;
  const selectedDayIndex = data.days.findIndex(
    (day) => day.iso === data.selectedDate
  );
  const selectedDay = data.days[selectedDayIndex] ?? data.days[0];
  const previousDay =
    selectedDayIndex > 0 ? data.days[selectedDayIndex - 1] : null;
  const nextDay =
    selectedDayIndex >= 0 && selectedDayIndex < data.days.length - 1
      ? data.days[selectedDayIndex + 1]
      : null;
  const selectedTimes = getBookableTimesForDate(data.selectedDate);
  const bookedSlotCount = selectedTimes.filter((time) =>
    bookingsBySlot.has(slotKey(data.selectedDate, time))
  ).length;
  const blockedSlotCountForDate = selectedTimes.filter((time) =>
    blockedBySlot.has(slotKey(data.selectedDate, time))
  ).length;
  const openSlotCount =
    selectedTimes.length - bookedSlotCount - blockedSlotCountForDate;

  return (
    <section className="section admin-dashboard">
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Consultation calendar</h1>
          <p>
            Signed in as <strong>{sessionEmail}</strong>. Times are shown in
            Stockholm time.
          </p>
        </div>
        <form action={signOutAdmin}>
          <button className="button secondary" type="submit">
            <span>Sign out</span>
            <LogOut aria-hidden="true" size={18} />
          </button>
        </form>
      </div>

      <AdminMessage message={message} />

      <div className="admin-stats">
        <article>
          <CalendarClock aria-hidden="true" size={20} />
          <span>Upcoming bookings</span>
          <strong>{data.bookings.length}</strong>
        </article>
        <article>
          <UserRound aria-hidden="true" size={20} />
          <span>New inquiries</span>
          <strong>{newBookingCount}</strong>
        </article>
        <article>
          <Ban aria-hidden="true" size={20} />
          <span>Blocked slots</span>
          <strong>{data.blockedSlotCount}</strong>
        </article>
      </div>

      <div className="admin-management-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <Ban aria-hidden="true" size={18} />
            <h2>Block a slot</h2>
          </div>
          <BlockSlotForm
            days={data.days}
            defaultDate={data.selectedDate}
          />
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <Clock3 aria-hidden="true" size={18} />
            <h2>Upcoming booked sessions</h2>
          </div>
          {data.bookings.length > 0 ? (
            <div className="admin-booking-list">
              {data.bookings.slice(0, 5).map((booking) => (
                <article key={booking.id}>
                  <strong>
                    {booking.consultationDate} at {booking.consultationTime}
                  </strong>
                  <span>{booking.name}</span>
                  <small>{booking.serviceInterest}</small>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty">No upcoming sessions yet.</p>
          )}
        </section>
      </div>

      <section
        className="admin-calendar-section"
        aria-labelledby="admin-calendar-title"
      >
        <div className="admin-calendar-toolbar">
          <div className="admin-calendar-copy">
            <div className="admin-panel-heading">
              <CalendarClock aria-hidden="true" size={18} />
              <h2 id="admin-calendar-title">Daily calendar</h2>
            </div>
            <p>
              {selectedDay.weekday} {selectedDay.day} {selectedDay.month}:{" "}
              {openSlotCount} open, {bookedSlotCount} booked,{" "}
              {blockedSlotCountForDate} blocked.
            </p>
          </div>

          <form className="admin-date-filter" method="get">
            <label>
              <span>Date</span>
              <select defaultValue={data.selectedDate} name="date">
                {data.days.map((day) => (
                  <option key={day.iso} value={day.iso}>
                    {day.weekday} {day.day} {day.month}
                  </option>
                ))}
              </select>
            </label>
            <button className="button secondary button-small" type="submit">
              <span>Filter</span>
              <Filter aria-hidden="true" size={16} />
            </button>
          </form>

          <nav
            aria-label="Calendar date navigation"
            className="admin-calendar-nav"
          >
            {previousDay ? (
              <a
                aria-label={`Show ${previousDay.weekday} ${previousDay.day} ${previousDay.month}`}
                className="button secondary button-small"
                href={getDateHref(previousDay.iso)}
              >
                <ChevronLeft aria-hidden="true" size={16} />
                <span>Previous</span>
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="button secondary button-small disabled"
              >
                <ChevronLeft aria-hidden="true" size={16} />
                <span>Previous</span>
              </span>
            )}

            {nextDay ? (
              <a
                aria-label={`Show ${nextDay.weekday} ${nextDay.day} ${nextDay.month}`}
                className="button secondary button-small"
                href={getDateHref(nextDay.iso)}
              >
                <span>Next</span>
                <ChevronRight aria-hidden="true" size={16} />
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="button secondary button-small disabled"
              >
                <span>Next</span>
                <ChevronRight aria-hidden="true" size={16} />
              </span>
            )}
          </nav>
        </div>

        <div className="admin-calendar admin-calendar-single">
          <section className="admin-day admin-day-focused">
            <header>
              <span>{selectedDay.weekday}</span>
              <strong>{selectedDay.day}</strong>
              <small>{selectedDay.month}</small>
            </header>
            <div className="admin-day-slots">
              {selectedTimes.length > 0 ? (
                selectedTimes.map((time) => {
                  const key = slotKey(data.selectedDate, time);
                  const booking = bookingsBySlot.get(key);
                  const blockedSlot = blockedBySlot.get(key);

                  if (booking) {
                    return (
                      <BookingSlot
                        booking={booking}
                        key={key}
                        returnDate={data.selectedDate}
                      />
                    );
                  }

                  if (blockedSlot) {
                    return (
                      <BlockedSlotCard
                        blockedSlot={blockedSlot}
                        key={key}
                        returnDate={data.selectedDate}
                      />
                    );
                  }

                  return (
                    <FreeSlot
                      date={data.selectedDate}
                      key={key}
                      time={time}
                    />
                  );
                })
              ) : (
                <p className="admin-empty admin-calendar-empty">
                  No remaining slots are available for this date.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams: AdminSearchParams = searchParams
    ? await searchParams
    : {};
  const message = getAdminMessage(resolvedSearchParams);
  const session = await getAdminSession();

  if (!session) {
    return (
      <AdminLogin
        isConfigured={isAdminAuthConfigured()}
        message={message}
      />
    );
  }

  const days = buildBookableDays(calendarFilterDayCount);
  const selectedDate = getSelectedCalendarDate(resolvedSearchParams, days);
  const data = await getDashboardData(days, selectedDate);

  return (
    <AdminDashboard
      data={data}
      message={message}
      sessionEmail={session.email}
    />
  );
}
