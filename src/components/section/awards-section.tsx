import { DATA } from "@/data/resume";
import { Award, FlaskConical } from "lucide-react";

export default function AwardsSection() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="flex min-h-0 flex-col gap-y-5">
        <div className="flex items-center gap-3 text-primary text-sm font-medium uppercase tracking-[0.2em]"><Award className="h-4 w-4" /> Awards & honors</div>
        <ul className="grid gap-3">
          {DATA.awards.map((award) => <li key={award} className="border-b border-border/60 pb-3 text-sm leading-relaxed text-muted-foreground">{award}</li>)}
        </ul>
      </div>
      <div className="flex min-h-0 flex-col gap-y-5">
        <div className="flex items-center gap-3 text-primary text-sm font-medium uppercase tracking-[0.2em]"><FlaskConical className="h-4 w-4" /> Patents</div>
        <ul className="grid gap-3">
          {DATA.patents.map((patent) => <li key={patent} className="border-b border-border/60 pb-3 text-sm leading-relaxed text-muted-foreground">{patent}</li>)}
        </ul>
      </div>
    </div>
  );
}
