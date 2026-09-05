import { DATA } from "@/data/resume";
import { ArrowUpRight, Mail } from "lucide-react";

export default function ContactSection() {
  const profiles = Object.values(DATA.contact.social).filter(social => social.navbar && social.url.startsWith("https://"));
  return (
    <div className="space-y-10">
      <section aria-labelledby="email-heading" className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h2 id="email-heading" className="mb-3 text-sm text-muted-foreground">Email</h2>
        <a href={`mailto:${DATA.contact.email}`} className="inline-flex min-h-11 items-center gap-3 break-all text-xl font-medium text-primary sm:text-2xl"><Mail className="size-5 shrink-0" aria-hidden="true" />{DATA.contact.email}</a>
      </section>
      <section aria-labelledby="profiles-heading" className="space-y-3">
        <h2 id="profiles-heading" className="text-xl font-semibold">Elsewhere</h2>
        <div className="divide-y divide-border">
          {profiles.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center justify-between gap-4 py-4 text-muted-foreground hover:text-primary"><span>{social.name}</span><ArrowUpRight className="size-4" aria-hidden="true" /></a>)}
        </div>
      </section>
    </div>
  );
}
