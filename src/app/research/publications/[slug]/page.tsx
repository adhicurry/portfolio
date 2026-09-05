import { notFound, permanentRedirect } from "next/navigation";

const publicationSlugs = new Set([
  "automated-rapid-cooling-neutron-vacuum-furnaces",
  "mitigation-flow-boiling-instabilities-active-flow-control",
  "uncertainty-aware-drug-target-affinity-prediction",
]);

export function generateStaticParams() {
  return [...publicationSlugs].map((slug) => ({ slug }));
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!publicationSlugs.has(slug)) notFound();
  permanentRedirect(`/#paper-${slug}`);
}
