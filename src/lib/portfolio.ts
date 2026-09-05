import { DATA } from "@/data/resume";

export const projectContexts: Record<string, string> = {
  phd: "Georgia Tech · PhD research",
  industry: "Advanced Cooling Technologies · R&D",
  undergraduate: "Penn State · Undergraduate research",
  independent: "Independent research",
};

export function projectContext(project: { category?: string }) {
  return projectContexts[project.category ?? ""] ?? "Personal project";
}

export function isResearch(project: { category?: string }) {
  return ["phd", "industry", "undergraduate"].includes(project.category ?? "");
}

export type PortfolioProject = {
  title: string; slug: string; description: string; longDescription?: string;
  href: string; dates: string; category?: string; organization?: string;
  technologies: readonly string[]; image: string; video: string;
  links: readonly { icon: React.ReactNode; type: string; href: string }[];
};

export const allProjects: PortfolioProject[] = [...DATA.academicProjects, ...DATA.personalProjects];

export function publicationTitle(citation: string) {
  return citation.match(/"([^"]+)"/)?.[1] ?? citation;
}
