/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Project = {
  title: string;
  slug: string;
  href: string;
  dates: string;
  description: string;
  longDescription?: string;
  technologies: readonly string[];
  image: string;
  links?: readonly { icon: React.ReactNode; type: string; href: string }[];
};

const projects: Project[] = [...DATA.academicProjects, ...DATA.personalProjects];

function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return undefined;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `${DATA.url}/projects/${project.slug}`,
      ...(project.image && { images: [`${DATA.url}${project.image}`] }),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const externalHref = project.href.startsWith("http") ? project.href : null;
  const description = project.longDescription || project.description;

  return (
    <section id="project-detail">
      <Link
        href="/#personal-projects"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-8 group"
      >
        <ChevronLeft className="size-3 group-hover:-translate-x-px transition-transform" />
        Back to projects
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Project detail
          </p>
          <h1 className="title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
            {project.title}
          </h1>
          <p className="text-sm text-muted-foreground">{project.dates}</p>
        </div>

        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="mt-4 w-full rounded-xl border border-border object-cover max-h-[28rem]"
          />
        )}

        <div className="my-2 flex w-full items-center">
          <div className="flex-1 h-px bg-border" />
        </div>

        <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </article>

        <div className="flex flex-wrap gap-1 mt-2">
          {project.technologies.map((technology) => (
            <Badge
              key={technology}
              className="text-[11px] font-medium border border-border h-6 w-fit px-2"
              variant="outline"
            >
              {technology}
            </Badge>
          ))}
        </div>

        {(externalHref || (project.links && project.links.length > 0)) && (
          <div className="flex flex-wrap gap-3 pt-4">
            {externalHref && (
              <Link
                href={externalHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
              >
                External project link <ArrowUpRight className="size-3.5" />
              </Link>
            )}
            {project.links?.map((link, index) => (
              <Link
                href={link.href}
                key={`${link.href}-${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
              >
                {link.icon}
                {link.type}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
