/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";
import { allProjects, isResearch, projectContext } from "@/lib/portfolio";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GtGuitarViewer } from "@/components/gt-guitar-viewer";

export function generateStaticParams() {
  return allProjects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
  const { slug } = await params;
  const current = allProjects.find(p => p.slug === slug);
  if (!current) return undefined;
  return {
    title: current.title, description: current.description,
    alternates: { canonical: `/projects/${current.slug}` },
    openGraph: { title: current.title, description: current.description, type: "article", url: `${DATA.url}/projects/${current.slug}`, ...(current.image && { images: [`${DATA.url}${current.image}`] }) },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find(p => p.slug === slug);
  if (!project) notFound();
  const research = isResearch(project);
  const parent = research ? "/research" : "/projects";
  const externalHref = project.href.startsWith("https://") ? project.href : null;
  return (
    <main className="space-y-8">
      <nav aria-label="Breadcrumb"><Link href={parent} className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary">← Back to {research ? "research" : "projects"}</Link></nav>
      <header className="space-y-4">
        <p className="text-sm text-primary">{projectContext(project)}</p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{project.title}</h1>
        {project.dates && <p className="text-sm text-muted-foreground">{project.dates}</p>}
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{project.description}</p>
      </header>
      {project.image && <div className="rounded-xl border border-border bg-white p-2"><img src={project.image} alt={project.title} className="max-h-[32rem] w-full object-contain" /></div>}
      {project.slug === "guitar-partscaster-build-and-onboard-effects" && <GtGuitarViewer />}
      <article className="prose prose-invert max-w-[72ch] border-t border-border pt-6 text-base leading-8 text-muted-foreground">
        <Markdown remarkPlugins={[remarkGfm]}>{project.longDescription || project.description}</Markdown>
      </article>
      <section aria-label="Topics and tools" className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</section>
      {externalHref && <a href={externalHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Project source ↗</a>}
      {project.links.filter(link => link.href.startsWith("https://")).map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">{link.type} ↗</a>)}
      <Link href={parent} className="inline-flex min-h-11 items-center text-sm text-primary">More {research ? "research" : "projects"} →</Link>
    </main>
  );
}
