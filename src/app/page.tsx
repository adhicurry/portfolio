import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import WorkSection from "@/components/section/work-section";
import AwardsSection from "@/components/section/awards-section";
import { allProjects } from "@/lib/portfolio";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: `${DATA.name} | Mechanical engineering & machine learning` },
  description: DATA.description,
  alternates: { canonical: "/" },
};

export default function Page() {
  const selected = ["two-phase-flow-boiling", "high-heat-flux-cooling-extreme-sample-environment", "recipe-generator-ai-native-ios-app", "guitar-partscaster-build-and-onboard-effects"]
    .map(slug => allProjects.find(project => project.slug === slug)!) ;
  return (
    <main className="space-y-14 sm:space-y-16">
      <header className="space-y-6">
        <p className="text-sm font-medium text-primary">Mechanical engineering · Georgia Tech</p>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{DATA.name}</h1>
        <p className="max-w-2xl text-xl leading-8 text-foreground/90">{DATA.description}</p>
        <div className="prose prose-invert max-w-2xl text-base leading-8 text-muted-foreground"><Markdown>{DATA.summary}</Markdown></div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/research" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Research <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <Link href="/projects" className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 py-2 text-sm hover:border-primary/50">Projects</Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center px-3 py-2 text-sm text-muted-foreground hover:text-primary">Contact →</Link>
        </div>
      </header>
      <section aria-labelledby="selected-heading" className="space-y-4">
        <h2 id="selected-heading" className="text-2xl font-semibold">Selected work</h2>
        <div className="grid gap-x-8 sm:grid-cols-2">
          {selected.map(project => <article key={project.slug} className="border-t border-border py-5">
            <h3 className="mb-2 text-lg font-semibold leading-snug"><Link href={`/projects/${project.slug}`} className="hover:text-primary">{project.title} <span className="text-primary" aria-hidden="true">↗</span></Link></h3>
            <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>
          </article>)}
        </div>
      </section>
      <section aria-labelledby="experience-heading" className="space-y-6 border-t border-border pt-8">
        <h2 id="experience-heading" className="text-2xl font-semibold">Experience</h2>
        <WorkSection />
      </section>
      <section aria-labelledby="education-heading" className="space-y-6 border-t border-border pt-8">
        <h2 id="education-heading" className="text-2xl font-semibold">Education</h2>
        {DATA.education.map(education => <article key={education.school} className="grid gap-2 sm:grid-cols-[10rem_1fr]">
          <p className="text-sm tabular-nums text-muted-foreground">{education.start} – {education.end}</p>
          <div><h3 className="text-lg font-semibold"><a href={education.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{education.school}</a></h3><p className="mt-1 text-sm text-muted-foreground">{education.degree}</p></div>
        </article>)}
      </section>
      <AwardsSection />
      <section aria-labelledby="tools-heading" className="space-y-4 border-t border-border pt-8">
        <h2 id="tools-heading" className="text-2xl font-semibold">Tools & methods</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">{DATA.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul>
      </section>
    </main>
  );
}
