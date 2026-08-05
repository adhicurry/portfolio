import BlurFade from "@/components/magicui/blur-fade";
import ContactSection from "@/components/section/contact-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${DATA.name}.`,
};

export default function ContactPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-10">
      <header className="border-l-2 border-primary pl-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Open to conversations</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">Contact</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Research collaborations, interesting builds, and thoughtful questions are always welcome.</p>
      </header>
      <BlurFade><ContactSection /></BlurFade>
    </main>
  );
}
