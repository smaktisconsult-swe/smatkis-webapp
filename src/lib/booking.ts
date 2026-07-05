export const BOOKING_TIME_ZONE = "Europe/Stockholm";
export const CONSULTATION_DURATION_MINUTES = 30;
export const BOOKABLE_DAY_COUNT = 10;

export type BookableDay = {
  iso: string;
  weekday: string;
  day: string;
  month: string;
};

export type UnavailableConsultationSlot = {
  date: string;
  time: string;
  label?: string;
};

const consultationTimes = Array.from({ length: 16 }, (_, index) => {
  const hour = 9 + Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";

  return `${String(hour).padStart(2, "0")}:${minute}`;
});

const stockholmDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: BOOKING_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  timeZone: "UTC"
});

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  timeZone: "UTC"
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: "UTC"
});

function getPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function dateFromISODate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00.000Z`);
}

function formatUTCDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getBookingDateTime(now = new Date()) {
  const parts = stockholmDateTimeFormatter.formatToParts(now);
  const year = getPart(parts, "year");
  const month = getPart(parts, "month");
  const day = getPart(parts, "day");
  const hour = getPart(parts, "hour");
  const minute = getPart(parts, "minute");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`
  };
}

export function addDaysToISODate(isoDate: string, days: number) {
  const date = dateFromISODate(isoDate);
  date.setUTCDate(date.getUTCDate() + days);

  return formatUTCDate(date);
}

export function isISODateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return formatUTCDate(dateFromISODate(value)) === value;
}

export function isWeekdayISODate(value: string) {
  if (!isISODateString(value)) {
    return false;
  }

  const day = dateFromISODate(value).getUTCDay();

  return day >= 1 && day <= 5;
}

export function buildBookableDays(count = BOOKABLE_DAY_COUNT, now = new Date()) {
  const days: BookableDay[] = [];
  let cursor = getBookingDateTime(now).date;

  while (days.length < count) {
    if (isWeekdayISODate(cursor)) {
      const date = dateFromISODate(cursor);

      days.push({
        iso: cursor,
        weekday: weekdayFormatter.format(date),
        day: dayFormatter.format(date),
        month: monthFormatter.format(date)
      });
    }

    cursor = addDaysToISODate(cursor, 1);
  }

  return days;
}

export function getConsultationTimes() {
  return consultationTimes;
}

export function isFutureConsultationSlot(date: string, time: string, now = new Date()) {
  const current = getBookingDateTime(now);

  return date > current.date || (date === current.date && time > current.time);
}

export function getBookableTimesForDate(date: string, now = new Date()) {
  if (!isWeekdayISODate(date)) {
    return [];
  }

  return consultationTimes.filter((time) =>
    isFutureConsultationSlot(date, time, now)
  );
}

export function isBookableConsultationSlot(date: string, time: string, now = new Date()) {
  return (
    isWeekdayISODate(date) &&
    consultationTimes.includes(time) &&
    isFutureConsultationSlot(date, time, now)
  );
}
