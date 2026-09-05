import PublicationsSection from "@/components/section/publications-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Journal papers, conference contributions, submitted manuscripts, and patent applications by Daksh Adhikari.",
  alternates: { canonical: "/publications" },
};

export default function PublicationsPage() {
  return (
    <main className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Publications</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">Journal papers and conference contributions, grouped by topic. Submitted manuscripts and patent applications are marked separately.</p>
        <a href={DATA.contact.social.Scholar.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Google Scholar ↗</a>
      </header>
      <PublicationsSection />
      <section id="patents" aria-labelledby="patents-heading" className="space-y-5 border-t border-border pt-8">
        <h2 id="patents-heading" className="text-2xl font-semibold">Patent applications</h2>
        <p className="text-sm text-muted-foreground">Application numbers and filing dates; these are not listed as granted patents.</p>
        <ul className="space-y-4">{DATA.patents.map(patent => <li key={patent} className="border-b border-border pb-4 text-sm leading-7 text-muted-foreground">{patent}</li>)}</ul>
      </section>
    </main>
  );
}
