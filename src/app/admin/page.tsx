import type { Metadata } from "next";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  Clock3,
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
  getConsultationTimes
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
  slot?: string | string[];
  lead?: string | string[];
};

type AdminPageProps = {
  searchParams?: Promise<AdminSearchParams>;
};

const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

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

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: BOOKING_TIME_ZONE
  }).format(value);
}

async function getDashboardData() {
  const days = buildBookableDays(12);
  const dates = days.map((day) => day.iso);
  const today = getBookingDateTime().date;
  const [bookings, blockedSlots] = await Promise.all([
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
    prisma.blockedConsultationSlot.findMany({
      where: {
        date: {
          in: dates
        },
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
    })
  ]);

  return {
    blockedSlots,
    bookings,
    days
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
  date,
  time,
  compact = false
}: {
  date?: string;
  time?: string;
  compact?: boolean;
}) {
  const days = buildBookableDays(12);
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
          <select name="date" required>
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

function BookingSlot({ booking }: { booking: Booking }) {
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
        <select aria-label="Booking status" name="status" defaultValue={booking.status}>
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

function BlockedSlotCard({ blockedSlot }: { blockedSlot: BlockedSlot }) {
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
    data.bookings.map((booking) => [
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
          <strong>{data.blockedSlots.length}</strong>
        </article>
      </div>

      <div className="admin-management-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <Ban aria-hidden="true" size={18} />
            <h2>Block a slot</h2>
          </div>
          <BlockSlotForm />
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

      <div className="admin-calendar">
        {data.days.map((day) => (
          <section className="admin-day" key={day.iso}>
            <header>
              <span>{day.weekday}</span>
              <strong>{day.day}</strong>
              <small>{day.month}</small>
            </header>
            <div className="admin-day-slots">
              {getBookableTimesForDate(day.iso).map((time) => {
                const key = slotKey(day.iso, time);
                const booking = bookingsBySlot.get(key);
                const blockedSlot = blockedBySlot.get(key);

                if (booking) {
                  return <BookingSlot booking={booking} key={key} />;
                }

                if (blockedSlot) {
                  return <BlockedSlotCard blockedSlot={blockedSlot} key={key} />;
                }

                return <FreeSlot date={day.iso} key={key} time={time} />;
              })}
            </div>
          </section>
        ))}
      </div>
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

  const data = await getDashboardData();

  return (
    <AdminDashboard
      data={data}
      message={message}
      sessionEmail={session.email}
    />
  );
}
