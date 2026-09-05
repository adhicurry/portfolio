import ProjectsSection from "@/components/section/projects-section";
import { DATA } from "@/data/resume";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Flow-boiling research at Georgia Tech, thermal systems R&D at Advanced Cooling Technologies, and undergraduate materials research.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <main className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm text-primary">Thermal systems & applied research</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Research</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">My PhD work at Georgia Tech focuses on flow-boiling instabilities and active control. Before that, I worked on cooling systems and combustion at Advanced Cooling Technologies.</p>
        <Link href="/publications" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">Publications & patent applications →</Link>
      </header>
      <nav aria-label="Research sections" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-3 text-sm text-muted-foreground">
        <a className="py-2 hover:text-primary" href="#phd">PhD research</a>
        <a className="py-2 hover:text-primary" href="#industry">Industry R&D</a>
        <a className="py-2 hover:text-primary" href="#undergraduate">Undergraduate research</a>
      </nav>
      <ProjectsSection id="phd" title="PhD research" description="MiNDS Lab, Georgia Institute of Technology" projects={DATA.academicProjects.filter(p => p.category === "phd")} />
      <ProjectsSection id="industry" title="Industry R&D" description="Work at Advanced Cooling Technologies. Publication dates may extend beyond my time at the company." projects={DATA.academicProjects.filter(p => p.category === "industry")} />
      <ProjectsSection id="undergraduate" title="Undergraduate research" description="Materials research at Penn State." projects={DATA.academicProjects.filter(p => p.category === "undergraduate")} />
      <section aria-labelledby="earlier-research-heading" className="space-y-6">
        <h2 id="earlier-research-heading" className="text-2xl font-semibold">Earlier research at Penn State</h2>
        {DATA.earlierResearch.map(work => <article key={work.lab} className="grid gap-3 border-t border-border pt-5 sm:grid-cols-[10rem_1fr]">
          <p className="text-sm text-muted-foreground">{work.dates}</p>
          <div><h3 className="text-lg font-medium">{work.lab}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{work.description}</p></div>
        </article>)}
      </section>
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">For drug-target prediction, see <Link href="/projects#machine-learning" className="text-primary underline underline-offset-4">independent ML projects</Link>.</p>
    </main>
  );
}
