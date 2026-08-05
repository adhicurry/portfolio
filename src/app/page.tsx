/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import PublicationsSection from "@/components/section/publications-section";
import AwardsSection from "@/components/section/awards-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <BlurFade><h2 className="text-xl font-bold">{children}</h2></BlurFade>;
}

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText delay={BLUR_FADE_DELAY} className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl" yOffset={8} text={`Hi, I'm ${DATA.name.split(" ")[0]}`} />
              <BlurFadeText className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl" delay={BLUR_FADE_DELAY} text={DATA.description} />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted"><AvatarImage alt={DATA.name} src={DATA.avatarUrl} /><AvatarFallback>{DATA.initials}</AvatarFallback></Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about"><div className="flex min-h-0 flex-col gap-y-4"><SectionHeading>About</SectionHeading><BlurFade delay={BLUR_FADE_DELAY * 2}><div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert"><Markdown>{DATA.summary}</Markdown></div></BlurFade></div></section>

      <section id="work"><div className="flex min-h-0 flex-col gap-y-6"><SectionHeading>Work & Education</SectionHeading><BlurFade delay={BLUR_FADE_DELAY * 3}><WorkSection /></BlurFade>
        <div className="flex flex-col gap-6 pt-3">{DATA.education.map((education, index) => <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 4 + index * 0.05}><Link href={education.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-3 justify-between group"><div className="flex items-center gap-x-3 flex-1 min-w-0"><div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" /><div className="flex-1 min-w-0 flex flex-col gap-0.5"><div className="font-semibold leading-none flex items-center gap-2">{education.school}<ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden /></div><div className="font-sans text-sm text-muted-foreground">{education.degree}</div></div></div><div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none"><span>{education.start} - {education.end}</span></div></Link></BlurFade>)}</div>
      </div></section>

      <section id="skills"><div className="flex min-h-0 flex-col gap-y-4"><SectionHeading>Skills</SectionHeading><div className="flex flex-wrap gap-2">{DATA.skills.map((skill, id) => <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 5 + id * 0.05}><div className="skill-badge border bg-background border-border ring-1 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">{skill.icon && <skill.icon className="size-4 rounded overflow-hidden object-contain" />}<span className="text-foreground text-sm font-medium font-mono">{skill.name}</span></div></BlurFade>)}</div></div></section>

      <section id="research"><BlurFade delay={BLUR_FADE_DELAY * 6}><div className="mb-8 border-l-2 border-primary pl-4"><p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Academic / Career</p><p className="mt-2 text-muted-foreground">The work behind the research identity.</p></div><PublicationsSection /></BlurFade><div className="mt-12"><BlurFade delay={BLUR_FADE_DELAY * 7}><AwardsSection /></BlurFade></div></section>

      <section id="academic-projects"><BlurFade delay={BLUR_FADE_DELAY * 8}><ProjectsSection id="academic-projects-list" eyebrow="Academic research" title="Research, built end-to-end" description="ML systems and computational experiments that connect directly to the questions I study." projects={DATA.academicProjects} /></BlurFade></section>
      <section id="personal-projects"><BlurFade delay={BLUR_FADE_DELAY * 9}><ProjectsSection id="personal-projects-list" eyebrow="Side projects" title="Things I build for fun" description="AI-native apps and curious experiments, built because the idea was too interesting not to ship." projects={DATA.personalProjects} /></BlurFade></section>
      <section id="hackathons"><BlurFade delay={BLUR_FADE_DELAY * 10}><HackathonsSection /></BlurFade></section>
      <section id="contact"><BlurFade delay={BLUR_FADE_DELAY * 11}><ContactSection /></BlurFade></section>
    </main>
  );
}
