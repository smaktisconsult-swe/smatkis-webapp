"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

import {
  BOOKING_TIME_ZONE,
  CONSULTATION_DURATION_MINUTES,
  buildBookableDays,
  getBookableTimesForDate,
  type UnavailableConsultationSlot
} from "@/lib/booking";

type BookingSlotPickerProps = {
  unavailableSlots?: UnavailableConsultationSlot[];
};

export function BookingSlotPicker({
  unavailableSlots = []
}: BookingSlotPickerProps) {
  const days = useMemo(() => buildBookableDays(), []);
  const [selectedDate, setSelectedDate] = useState(days[0]?.iso ?? "");
  const [selectedTime, setSelectedTime] = useState("");
  const unavailableSlotLabels = useMemo(
    () =>
      new Map(
        unavailableSlots.map((slot) => [
          `${slot.date}|${slot.time}`,
          slot.label ?? "Unavailable"
        ])
      ),
    [unavailableSlots]
  );
  const slots = useMemo(
    () => getBookableTimesForDate(selectedDate),
    [selectedDate]
  );
  const availableSlotCount = slots.filter(
    (slot) => !unavailableSlotLabels.has(`${selectedDate}|${slot}`)
  ).length;

  useEffect(() => {
    if (
      selectedTime &&
      (!slots.includes(selectedTime) ||
        unavailableSlotLabels.has(`${selectedDate}|${selectedTime}`))
    ) {
      setSelectedTime("");
    }
  }, [selectedDate, selectedTime, slots, unavailableSlotLabels]);

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
      <input name="consultationTimeZone" type="hidden" value={BOOKING_TIME_ZONE} />
      <input
        name="consultationDurationMinutes"
        type="hidden"
        value={CONSULTATION_DURATION_MINUTES}
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
          {slots.map((slot) => {
            const unavailableLabel = unavailableSlotLabels.get(`${selectedDate}|${slot}`);
            const isUnavailable = Boolean(unavailableLabel);
            const className = [
              "time-slot",
              selectedTime === slot ? "active" : "",
              isUnavailable ? "disabled" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <label aria-disabled={isUnavailable} className={className} key={slot}>
                <input
                  checked={selectedTime === slot}
                  disabled={isUnavailable}
                  name="consultationTime"
                  onChange={() => setSelectedTime(slot)}
                  required
                  type="radio"
                  value={slot}
                />
                <span>{slot}</span>
                {unavailableLabel ? <small>{unavailableLabel}</small> : null}
              </label>
            );
          })}
        </div>
      ) : (
        <p className="no-slots">
          No remaining slots are available for this date. Please choose another
          weekday.
        </p>
      )}

      {slots.length > 0 && availableSlotCount === 0 ? (
        <p className="no-slots">
          All remaining slots are booked for this date. Please choose another
          weekday.
        </p>
      ) : null}
    </fieldset>
  );
}
