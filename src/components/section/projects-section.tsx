import { ProjectCard } from "@/components/project-card";

type ProjectsSectionProps = {
  id: string;
  title: string;
  description?: string;
  projects: ReadonlyArray<{
    title: string; slug: string; description: string; dates: string;
    technologies: readonly string[]; image: string; video: string;
    links: readonly { icon: React.ReactNode; type: string; href: string }[];
    category?: string; tagLabel?: string;
  }>;
};

export default function ProjectsSection({ id, title, description, projects }: ProjectsSectionProps) {
  if (!projects.length) return null;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-6">
      <header className="space-y-2 border-t border-border pt-6">
        <h2 id={`${id}-heading`} className="text-2xl font-semibold">{title}</h2>
        {description && <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>}
      </header>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map(project => <ProjectCard key={project.slug} {...project} tags={project.technologies} />)}
      </div>
    </section>
  );
}
