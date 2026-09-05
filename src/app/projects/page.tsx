import ProjectsSection from "@/components/section/projects-section";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Independent machine learning projects, software, and guitar electronics by Daksh Adhikari.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const ml = [...DATA.academicProjects.filter(p => p.category === "independent"), ...DATA.personalProjects.filter(p => p.slug === "satchat-vision-llm-for-satellite-imagery")];
  const hardwareSlugs = ["guitar-partscaster-build-and-onboard-effects", "pixel-sentinel-repurposed-android-security-camera"];
  return (
    <main className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm text-primary">Outside my PhD</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Projects</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">Independent ML experiments, apps, and things I build for my own use. Each project page explains what I worked on and how it works.</p>
      </header>
      <nav aria-label="Project sections" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-3 text-sm text-muted-foreground">
        <a className="py-2 hover:text-primary" href="#machine-learning">Machine learning</a>
        <a className="py-2 hover:text-primary" href="#software">Software</a>
        <a className="py-2 hover:text-primary" href="#hardware">Hardware & home projects</a>
      </nav>
      <ProjectsSection id="machine-learning" title="Machine learning" description="Drug-target binding prediction and satellite imagery analysis, developed through hackathons and follow-up experiments." projects={ml} />
      <ProjectsSection id="software" title="Software" projects={DATA.personalProjects.filter(p => !hardwareSlugs.includes(p.slug) && p.slug !== "satchat-vision-llm-for-satellite-imagery")} />
      <ProjectsSection id="hardware" title="Hardware & home projects" projects={DATA.personalProjects.filter(p => hardwareSlugs.includes(p.slug))} />
    </main>
  );
}
