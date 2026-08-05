"use client";

import { DATA } from "@/data/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function groupByTopic<T extends { topic: string }>(items: readonly T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    (groups[item.topic] ??= []).push(item);
    return groups;
  }, {});
}

export default function PublicationsSection() {
  return (
    <div className="flex min-h-0 flex-col gap-y-8">
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-3 text-primary text-sm font-medium uppercase tracking-[0.2em]"><span className="h-px w-8 bg-primary" /> Selected publications</div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Publications</h2>
        <p className="text-muted-foreground md:text-lg">Peer-reviewed work on thermal systems, biomedical ML, and high-temperature experimentation.</p>
      </div>
      <div className="grid gap-8">
        {Object.entries(groupByTopic(DATA.publications)).map(([topic, publications]) => (
          <section key={topic} className="grid gap-4">
            <h3 className="text-lg font-semibold tracking-tight">{topic}</h3>
            <div className="grid gap-5">
              {publications.map((publication, index) => (
                <div key={publication.citation} className="flex gap-4 border-l-2 border-primary/40 pl-4">
                  <span className="font-mono text-xs text-primary pt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {publication.slug ? (
                      <Link href={`/research/publications/${publication.slug}`} className="group inline-flex items-start gap-1 hover:text-foreground transition-colors">
                        <span>{publication.citation}</span>
                        <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-primary opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    ) : publication.citation}
                    {publication.note && <span className="ml-1 text-foreground font-medium">({publication.note})</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Accordion type="single" collapsible className="border-t border-border">
        <AccordionItem value="additional-publications" className="border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline group [&>svg]:hidden">
            <span className="flex items-center gap-2 text-sm font-medium">Additional publications <ChevronRight className="h-4 w-4 text-muted-foreground group-data-[state=open]:hidden" /><ChevronDown className={cn("h-4 w-4 text-muted-foreground hidden group-data-[state=open]:block")} /></span>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="grid gap-6">
              {Object.entries(groupByTopic(DATA.additionalPublications)).map(([topic, publications]) => (
                <section key={topic} className="grid gap-3">
                  <h3 className="text-sm font-semibold text-foreground">{topic}</h3>
                  <ol className="grid gap-4 list-decimal pl-5 text-sm leading-relaxed text-muted-foreground">
                    {publications.map((publication) => <li key={publication.citation} className="pl-2">{publication.citation}</li>)}
                  </ol>
                </section>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
