import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <section className="page-hero thank-you">
      <CheckCircle2 aria-hidden="true" size={42} />
      <p className="eyebrow">Request received</p>
      <h1>Thank you for contacting SmaKTis Consultancy</h1>
      <p>
        Your consultation request has been saved. SmaKTis will review the
        details and respond with next steps.
      </p>
      <Link className="button" href="/">
        <span>Return home</span>
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
