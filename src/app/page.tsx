import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
  description: DATA.description,
};

const BLUR_FADE_DELAY = 0.04;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <BlurFade><h2 className="text-xl font-bold">{children}</h2></BlurFade>;
}

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col gap-14">
      <section aria-labelledby="hero-heading">
        <div className="w-full space-y-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="order-2 flex flex-col gap-2 md:order-1">
              <BlurFadeText delay={BLUR_FADE_DELAY} className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl" yOffset={8} text={`Hi, I'm ${DATA.name.split(" ")[0]}`} />
              <h1 id="hero-heading" className="sr-only">{DATA.name}</h1>
              <BlurFadeText className="max-w-[600px] text-muted-foreground md:text-lg lg:text-xl" delay={BLUR_FADE_DELAY} text={DATA.description} />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 rounded-full border shadow-lg ring-4 ring-muted md:size-32"><AvatarImage alt={DATA.name} src={DATA.avatarUrl} /><AvatarFallback>{DATA.initials}</AvatarFallback></Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-heading"><div className="flex min-h-0 flex-col gap-y-4"><SectionHeading><span id="about-heading">About</span></SectionHeading><BlurFade delay={BLUR_FADE_DELAY * 2}><div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert"><Markdown>{DATA.summary}</Markdown></div></BlurFade></div></section>

      <section aria-labelledby="work-heading"><div className="flex min-h-0 flex-col gap-y-6"><SectionHeading><span id="work-heading">Work & Education</span></SectionHeading><BlurFade delay={BLUR_FADE_DELAY * 3}><WorkSection /></BlurFade>
        <div className="flex flex-col gap-6 pt-3">{DATA.education.map((education, index) => <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 4 + index * 0.05}><Link href={education.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-x-3"><div className="flex min-w-0 flex-1 items-center gap-x-3"><div className="size-8 flex-none rounded-full border bg-muted p-1 shadow ring-2 ring-border md:size-10" /><div className="flex min-w-0 flex-1 flex-col gap-0.5"><div className="flex items-center gap-2 font-semibold leading-none">{education.school}<ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden /></div><div className="font-sans text-sm text-muted-foreground">{education.degree}</div></div></div><div className="flex flex-none items-center gap-1 text-right text-xs tabular-nums text-muted-foreground"><span>{education.start} - {education.end}</span></div></Link></BlurFade>)}</div>
      </div></section>

      <section aria-labelledby="skills-heading"><div className="flex min-h-0 flex-col gap-y-4"><SectionHeading><span id="skills-heading">Skills</span></SectionHeading><div className="flex flex-wrap gap-2">{DATA.skills.map((skill, id) => <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 5 + id * 0.05}><div className="skill-badge flex h-8 w-fit items-center gap-2 rounded-xl border border-border bg-background px-4 ring-1 ring-border/20">{skill.icon && <skill.icon className="size-4 rounded object-contain" />}<span className="font-mono text-sm font-medium text-foreground">{skill.name}</span></div></BlurFade>)}</div></div></section>
    </main>
  );
}
