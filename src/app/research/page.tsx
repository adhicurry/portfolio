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
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Academic / Career</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">Research</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">The work behind the research identity, from published thermal systems research to end-to-end ML experiments.</p>
      </header>
      <BlurFade><PublicationsSection /></BlurFade>
      <BlurFade><AwardsSection /></BlurFade>
      <BlurFade><ProjectsSection id="academic-projects-list" eyebrow="Academic research" title="Research, built end-to-end" description="ML systems and computational experiments that connect directly to the questions I study." projects={DATA.academicProjects} /></BlurFade>
    </main>
  );
}
