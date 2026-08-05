import BlurFade from "@/components/magicui/blur-fade";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Personal projects and hackathon builds by Daksh Adhikari.",
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-14">
      <header className="border-l-2 border-primary pl-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Selected builds</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Things I build for fun, plus the fast-moving experiments that came out of hackathons.</p>
      </header>
      <BlurFade><ProjectsSection id="personal-projects-list" eyebrow="Side projects" title="Things I build for fun" description="AI-native apps and curious experiments, built because the idea was too interesting not to ship." projects={DATA.personalProjects} /></BlurFade>
      <BlurFade><HackathonsSection /></BlurFade>
    </main>
  );
}
