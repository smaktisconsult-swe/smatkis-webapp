import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "SmaKTis Consultancy | Academic and Life Science Research Support in Sweden",
    template: "%s | SmaKTis Consultancy"
  },
  description:
    "SmaKTis Consultancy provides ethical academic support, science tutoring, scientific writing guidance, data interpretation, literature review, and biotech R&D consultancy in Sweden.",
  keywords: [
    "academic research support Sweden",
    "scientific writing support Sweden",
    "life science research consultancy",
    "biotech R&D support Sweden",
    "science tutoring Stockholm"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
