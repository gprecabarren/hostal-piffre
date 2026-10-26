import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPage from "@/components/public/LocationPage";
import { getContent } from "@/lib/content";
import { locationSchema, publicContent } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/page-seo";

type LocationParams = { params: Promise<{ slug: string }> };

async function findLocation(params: LocationParams["params"]) {
  const [{ slug }, content] = await Promise.all([params, getContent()]);
  const location = content.locations.find((item) => item.slug === slug && item.published);
  if (!location) notFound();
  return { content, location };
}

export async function generateMetadata({ params }: LocationParams): Promise<Metadata> {
  const { content, location } = await findLocation(params);
  return buildPageMetadata(content, `location:${location.id}`, { preview: process.env.VERCEL_ENV === "preview" });
}

export default async function Page({ params }: LocationParams) {
  const { content, location } = await findLocation(params);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema(content, location)).replace(/</g, "\\u003c") }} />
    <LocationPage content={publicContent(content, location.id)} location={location} />
  </>;
}
