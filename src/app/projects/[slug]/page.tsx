import { notFound, permanentRedirect } from "next/navigation";

const projectSlugs = new Set([
  "two-phase-flow-boiling",
  "high-heat-flux-cooling-extreme-sample-environment",
  "combustion",
  "ml-for-thermal-sciences",
  "ml-for-biomedical-materials-systems",
  "miscellaneous",
  "recipe-generator-ai-native-ios-app",
  "agent-cad-local-modeling-workflow",
  "guitar-partscaster-build-and-onboard-effects",
  "pixel-sentinel-repurposed-android-security-camera",
  "ai-website-builder-local-business-demo-pipeline",
]);

export function generateStaticParams() {
  return [...projectSlugs].map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!projectSlugs.has(slug)) notFound();
  permanentRedirect(`/#project-${slug}`);
}
