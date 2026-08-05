import BlurFade from "@/components/magicui/blur-fade";
import AwardsSection from "@/components/section/awards-section";
import ProjectsSection from "@/components/section/projects-section";
import PublicationsSection from "@/components/section/publications-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Publications, awards, patents, and academic projects by Daksh Adhikari.",
};

export default function ResearchPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-14">
      <header className="border-l-2 border-primary pl-5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Academic work</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">Research</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Published thermal systems research, patents, and ML experiments connected to the problems I study.</p>
      </header>
      <BlurFade>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          My PhD work centers on flow boiling instabilities and how to control them. Two-phase cooling systems move heat efficiently, but the boiling process itself is unstable — flow reversal, dryout, and pressure oscillations can wreck cooling performance right when a system needs it most (electronics, EV batteries, high-energy lasers, nuclear). I work on understanding why these instabilities happen and building active flow control and ML-based approaches to keep them in check.
        </p>
      </BlurFade>
      <BlurFade><PublicationsSection /></BlurFade>
      <BlurFade><AwardsSection /></BlurFade>
      <BlurFade><ProjectsSection id="academic-projects-list" eyebrow="Academic research" title="Research projects" description="ML systems and computational experiments tied to the questions I study." projects={DATA.academicProjects} /></BlurFade>
    </main>
  );
}
