import { DATA } from "@/data/resume";
import { publicationTitle } from "@/lib/portfolio";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";

type Publication = (typeof DATA.publications)[number] & { slug: string; longDescription?: string; technologies?: readonly string[] };
const publications = DATA.publications.filter((p): p is Publication => "slug" in p);

export function generateStaticParams() { return publications.map(p => ({slug: p.slug})); }

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata | undefined> {
  const {slug} = await params;
  const publication = publications.find(p => p.slug === slug);
  if (!publication) return undefined;
  return { title: publicationTitle(publication.citation), description: publication.longDescription?.split("\n")[0], alternates: {canonical: `/research/publications/${slug}`} };
}

export default async function PublicationPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const publication = publications.find(p => p.slug === slug);
  if (!publication) notFound();
  return (
    <main className="max-w-3xl space-y-8">
      <Link href="/publications" className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary">← Back to publications</Link>
      <header className="space-y-4">
        <p className="text-sm text-primary">{publication.topic}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{publicationTitle(publication.citation)}</h1>
        {publication.note && <p className="w-fit rounded-md border border-primary/40 px-3 py-1 text-sm text-primary">{publication.note}</p>}
        <p className="text-sm leading-7 text-muted-foreground">{publication.citation}</p>
        {publication.href && <a href={publication.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Read on the publisher’s site ↗</a>}
      </header>
      <article className="prose prose-invert max-w-full border-t border-border pt-6 text-base leading-8 text-muted-foreground"><Markdown>{publication.longDescription}</Markdown></article>
      {publication.technologies && <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">{publication.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>}
      <Link href="/publications" className="inline-flex min-h-11 items-center text-sm text-primary">All publications →</Link>
    </main>
  );
}
