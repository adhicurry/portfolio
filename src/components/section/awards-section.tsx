import { DATA } from "@/data/resume";

export default function AwardsSection() {
  return (
    <section aria-labelledby="awards-heading" className="space-y-6">
      <h2 id="awards-heading" className="text-2xl font-semibold">Awards & fellowships</h2>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {DATA.awards.map(award => <li key={award} className="border-b border-border py-4 text-sm leading-6 text-muted-foreground">{award}</li>)}
      </ul>
    </section>
  );
}
