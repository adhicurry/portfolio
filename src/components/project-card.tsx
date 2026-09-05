/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { projectContext } from "@/lib/portfolio";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  description: string;
  dates: string;
  tags: readonly string[];
  category?: string;
  tagLabel?: string;
  image?: string;
  video?: string;
  links?: readonly { icon: React.ReactNode; type: string; href: string }[];
  className?: string;
}

export function ProjectCard({ title, slug, description, dates, tags, category, image, links, className }: Props) {
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40", className)}>
      {image && (
        <Link href={`/projects/${slug}`} tabIndex={-1} aria-hidden="true" className="block border-b border-border bg-white">
          <img src={image} alt="" loading="lazy" className="h-52 w-full object-contain" />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{projectContext({ category })}</span>
          {dates && <span>{dates}</span>}
        </div>
        <h3 className="text-xl font-semibold leading-snug">
          <Link href={`/projects/${slug}`} className="hover:text-primary">{title}</Link>
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2 text-xs leading-5 text-muted-foreground" aria-label="Topics and tools">
          {tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
        <Link href={`/projects/${slug}`} className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-primary" aria-label={`Read about ${title}`}>
          Read project <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        {links && links.length > 0 && <div className="flex flex-wrap gap-4">
          {links.filter(link => link.href.startsWith("https://")).map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline underline-offset-4">{link.type}</a>)}
        </div>}
      </div>
    </article>
  );
}
