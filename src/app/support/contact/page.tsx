import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sunidhi Securities — office address, phone numbers, email addresses, and an online contact form.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
