import { DATA } from "@/data/resume";
import { publicationTitle } from "@/lib/portfolio";
import Link from "next/link";

type Publication = {
  citation: string; topic: string; category: string;
  slug?: string; note?: string; href?: string;
};

export default function PublicationsSection() {
  const all: Publication[] = [...DATA.publications, ...DATA.additionalPublications];
  const submitted = all.filter(p => /submitted/i.test(p.note ?? ""));
  const published = all.filter(p => !/submitted/i.test(p.note ?? ""));
  const groups = Array.from(new Set(published.map(p => p.topic))).map(topic => ({topic, publications: published.filter(p => p.topic === topic)}));
  function entry(publication: Publication) {
    return <li key={publication.citation} className="space-y-2 border-b border-border pb-5">
      <h3 className="text-base font-medium leading-7">
        {publication.slug ? <Link className="hover:text-primary" href={`/research/publications/${publication.slug}`}>{publicationTitle(publication.citation)} <span className="text-primary" aria-hidden="true">↗</span></Link> : publicationTitle(publication.citation)}
      </h3>
      <p className="text-sm leading-7 text-muted-foreground">{publication.citation}</p>
      {publication.note && <p className="text-xs font-medium text-primary">{publication.note}</p>}
      {publication.href && <a href={publication.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Publisher / DOI ↗</a>}
    </li>;
  }
  return (
    <div className="space-y-12">
      {submitted.length > 0 && <section id="submitted" aria-labelledby="submitted-heading" className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
        <header className="space-y-2"><h2 id="submitted-heading" className="text-2xl font-semibold">Submitted manuscripts</h2><p className="text-sm text-muted-foreground">Listed separately from published papers and conference contributions.</p></header>
        <ul className="space-y-6">{submitted.map(entry)}</ul>
      </section>}
      {groups.map(({topic, publications}) => <section key={topic} aria-label={topic} className="space-y-5">
        <h2 className="text-xl font-semibold">{topic}</h2>
        <ul className="space-y-6">{publications.map(entry)}</ul>
      </section>)}
    </div>
  );
}
