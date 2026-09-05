import ContactSection from "@/components/section/contact-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email and professional profiles for Daksh Adhikari.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Contact</h1>
        <p className="text-lg leading-8 text-muted-foreground">For questions about my research, project discussions, or collaboration, email me directly.</p>
      </header>
      <ContactSection />
    </main>
  );
}
