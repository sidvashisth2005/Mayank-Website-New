import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAsset } from "@/lib/assets";
import { getDossier } from "@/lib/dossiers";
import { studio } from "@/lib/catalogue/studio";
import { Scene } from "./scenes";

// Image studio: renders each sample product's own interface so it can be
// captured as screenshots (scripts/capture-specimens.mjs). It only exists
// when MAYANK_STUDIO=1 is set, never on the live site.

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ view?: string }> };

export default async function StudioPage({ params, searchParams }: Props) {
  if (process.env.MAYANK_STUDIO !== "1") notFound();
  const { slug } = await params;
  const asset = getAsset(slug);
  const entry = studio[slug];
  if (!asset || !entry) notFound();
  const view = Math.min(2, Math.max(0, Number((await searchParams).view ?? 0) || 0));
  return <Scene asset={asset} dossier={getDossier(slug)} entry={entry} view={view} />;
}
