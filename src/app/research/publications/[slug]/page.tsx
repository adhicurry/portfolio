import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Publication = (typeof DATA.publications)[number] & {
  slug: string;
  longDescription?: string;
  technologies?: readonly string[];
};

const publications = DATA.publications.filter(
  (publication): publication is Publication => "slug" in publication,
);

function getPublication(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
  const publication = getPublication((await params).slug);
  if (!publication) return undefined;

  return {
    title: publication.citation.split(".")[0],
    description: publication.longDescription,
    openGraph: {
      title: publication.citation,
      description: publication.longDescription,
      type: "article",
      url: `${DATA.url}/research/publications/${publication.slug}`,
    },
  };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const publication = getPublication((await params).slug);
  if (!publication) notFound();

  return (
    <section id="publication-detail">
      <Link href="/research" className="mb-8 inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground group">
        <ChevronLeft className="size-3 transition-transform group-hover:-translate-x-px" />
        Back to research
      </Link>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Publication detail</p>
          <p className="text-sm text-muted-foreground">{publication.topic}</p>
          <h1 className="title text-3xl font-semibold leading-tight tracking-tighter md:text-4xl">{publication.citation}</h1>
          {publication.note && <p className="w-fit rounded-full border border-primary/40 px-2.5 py-1 text-xs font-medium text-primary">{publication.note}</p>}
        </div>

        <div className="my-2 flex w-full items-center"><div className="h-px flex-1 bg-border" /></div>

        <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{publication.longDescription}</Markdown>
        </article>

        {publication.technologies && (
          <div className="flex flex-wrap gap-1 pt-2">
            {publication.technologies.map((technology) => <Badge key={technology} className="h-6 w-fit border border-border px-2 text-[11px] font-medium" variant="outline">{technology}</Badge>)}
          </div>
        )}

        <Link href="/research" className="inline-flex w-fit items-center gap-1.5 border border-border rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50">
          See all research <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}