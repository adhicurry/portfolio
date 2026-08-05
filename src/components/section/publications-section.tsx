"use client";

import { DATA } from "@/data/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicationsSection() {
  return (
    <div className="flex min-h-0 flex-col gap-y-8">
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-3 text-primary text-sm font-medium uppercase tracking-[0.2em]"><span className="h-px w-8 bg-primary" /> Selected publications</div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Research, in print</h2>
        <p className="text-muted-foreground md:text-lg">Peer-reviewed work spanning thermal systems, biomedical ML, and high-temperature experimentation.</p>
      </div>
      <div className="grid gap-5">
        {DATA.publications.map((publication, index) => (
          <div key={publication.citation} className="flex gap-4 border-l-2 border-primary/40 pl-4">
            <span className="font-mono text-xs text-primary pt-1">0{index + 1}</span>
            <p className="text-sm leading-relaxed text-muted-foreground">{publication.citation} {publication.note && <span className="text-foreground font-medium">({publication.note})</span>}</p>
          </div>
        ))}
      </div>
      <Accordion type="single" collapsible className="border-t border-border">
        <AccordionItem value="additional-publications" className="border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline group [&>svg]:hidden">
            <span className="flex items-center gap-2 text-sm font-medium">Additional publications <ChevronRight className="h-4 w-4 text-muted-foreground group-data-[state=open]:hidden" /><ChevronDown className={cn("h-4 w-4 text-muted-foreground hidden group-data-[state=open]:block")} /></span>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <ol className="grid gap-4 list-decimal pl-5 text-sm leading-relaxed text-muted-foreground">
              {DATA.additionalPublications.map((publication) => <li key={publication} className="pl-2">{publication}</li>)}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
