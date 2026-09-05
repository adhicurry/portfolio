import { DATA } from "@/data/resume";

export default function WorkSection() {
  return (
    <div className="space-y-8">
      {DATA.work.map(work => (
        <article key={work.company} className="grid gap-3 sm:grid-cols-[10rem_1fr]">
          <p className="text-sm tabular-nums text-muted-foreground">{work.start} – {work.end ?? "Present"}</p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold"><a href={work.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{work.company}</a></h3>
            <p className="text-sm text-primary">{work.title}</p>
            <p className="text-sm leading-7 text-muted-foreground">{work.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
