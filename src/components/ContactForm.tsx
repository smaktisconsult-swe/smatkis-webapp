import { Send } from "lucide-react";

import { createLead } from "@/app/actions";
import { BookingSlotPicker } from "@/components/BookingSlotPicker";
import { services } from "@/lib/content";

type ContactFormProps = {
  serviceInterest?: string;
  compact?: boolean;
};

export function ContactForm({ serviceInterest = "", compact = false }: ContactFormProps) {
  return (
    <form className={compact ? "contact-form compact" : "contact-form"} action={createLead}>
      <BookingSlotPicker />

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>

      <div className="form-grid">
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          <span>Client type</span>
          <select name="clientType" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>School or institution</option>
            <option>Student</option>
            <option>Researcher or academic</option>
            <option>Biotech or startup</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label>
        <span>Service interest</span>
        <select name="serviceInterest" required defaultValue={serviceInterest}>
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          <option>Not sure yet</option>
        </select>
      </label>

      <div className="form-grid">
        <label>
          <span>Timeline</span>
          <input name="timeline" placeholder="Example: within 2 weeks" />
        </label>
        <label>
          <span>Budget range</span>
          <input name="budgetRange" placeholder="Optional" />
        </label>
      </div>

      <label>
        <span>Project details</span>
        <textarea
          name="message"
          rows={compact ? 4 : 6}
          required
          placeholder="Briefly describe the support you need, the deadline, and the expected outcome."
        />
      </label>

      <label className="checkbox-row">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that SmaKTis may use these details to respond to this
          consultation request.
        </span>
      </label>

      <button className="button" type="submit">
        <span>Request booked consultation</span>
        <Send aria-hidden="true" size={18} />
      </button>
    </form>
  );
}
