"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

const timeZone = "Europe/Stockholm";
const durationMinutes = 30;

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function nextWeekday(date: Date) {
  let cursor = new Date(date);

  while (!isWeekday(cursor)) {
    cursor = addDays(cursor, 1);
  }

  return cursor;
}

function buildDays() {
  const today = new Date();
  const days: Array<{ iso: string; weekday: string; day: string; month: string }> = [];
  let cursor = nextWeekday(today);

  while (days.length < 10) {
    if (isWeekday(cursor)) {
      days.push({
        iso: toISODate(cursor),
        weekday: cursor.toLocaleDateString("en-GB", { weekday: "short" }),
        day: cursor.toLocaleDateString("en-GB", { day: "2-digit" }),
        month: cursor.toLocaleDateString("en-GB", { month: "short" })
      });
    }

    cursor = addDays(cursor, 1);
  }

  return days;
}

function buildSlots(selectedDate: string) {
  const now = new Date();
  const today = toISODate(now);
  const slots: string[] = [];

  for (let hour = 9; hour < 17; hour += 1) {
    for (const minute of [0, 30]) {
      const slot = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      if (selectedDate === today) {
        const [slotHour, slotMinute] = slot.split(":").map(Number);
        const slotDate = new Date(now);
        slotDate.setHours(slotHour, slotMinute, 0, 0);

        if (slotDate <= now) {
          continue;
        }
      }

      slots.push(slot);
    }
  }

  return slots;
}

export function BookingSlotPicker() {
  const days = useMemo(() => buildDays(), []);
  const [selectedDate, setSelectedDate] = useState(days[0]?.iso ?? "");
  const [selectedTime, setSelectedTime] = useState("");
  const slots = useMemo(() => buildSlots(selectedDate), [selectedDate]);

  return (
    <fieldset className="booking-picker">
      <legend>
        <CalendarDays aria-hidden="true" size={18} />
        Choose a consultation slot
      </legend>
      <p>
        Consultation requests use 30-minute slots. Times are shown in Stockholm
        time.
      </p>

      <input name="consultationDate" type="hidden" value={selectedDate} />
      <input name="consultationTimeZone" type="hidden" value={timeZone} />
      <input
        name="consultationDurationMinutes"
        type="hidden"
        value={durationMinutes}
      />

      <div className="date-slot-grid" aria-label="Available consultation dates">
        {days.map((day) => (
          <button
            aria-pressed={selectedDate === day.iso}
            className={selectedDate === day.iso ? "date-slot active" : "date-slot"}
            key={day.iso}
            onClick={() => {
              setSelectedDate(day.iso);
              setSelectedTime("");
            }}
            type="button"
          >
            <span>{day.weekday}</span>
            <strong>{day.day}</strong>
            <small>{day.month}</small>
          </button>
        ))}
      </div>

      <div className="time-slot-heading">
        <Clock3 aria-hidden="true" size={18} />
        <span>Available 30-minute times</span>
      </div>

      {slots.length > 0 ? (
        <div className="time-slot-grid" aria-label="Available consultation times">
          {slots.map((slot) => (
            <label
              className={selectedTime === slot ? "time-slot active" : "time-slot"}
              key={slot}
            >
              <input
                checked={selectedTime === slot}
                name="consultationTime"
                onChange={() => setSelectedTime(slot)}
                required
                type="radio"
                value={slot}
              />
              <span>{slot}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="no-slots">
          No remaining slots are available for this date. Please choose another
          weekday.
        </p>
      )}
    </fieldset>
  );
}
