import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPage from "@/components/public/LocationPage";
import { getContent } from "@/lib/content";
import { locationSchema, locationUrl, publicContent } from "@/lib/seo";

type LocationParams = { params: Promise<{ slug: string }> };

async function findLocation(params: LocationParams["params"]) {
  const [{ slug }, content] = await Promise.all([params, getContent()]);
  const location = content.locations.find((item) => item.slug === slug && item.published);
  if (!location) notFound();
  return { content, location };
}

export async function generateMetadata({ params }: LocationParams): Promise<Metadata> {
  const { content, location } = await findLocation(params);
  const url = locationUrl(content, location);
  const images = location.photos.filter((photo) => photo.url).slice(0, 3).map((photo) => ({ url: photo.url, alt: photo.alt }));
  const shareImages = images.length ? images : [{ url: content.seo.ogImage, alt: `${content.site.name} · ${location.name}` }];
  return {
    title: { absolute: location.seo.title }, description: location.seo.description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "es_CL", siteName: content.site.name, title: location.seo.title, description: location.seo.description, url, images: shareImages },
    twitter: { card: "summary_large_image", title: location.seo.title, description: location.seo.description, images: shareImages.map((image) => image.url) },
    robots: { index: content.seo.robotsIndex && process.env.VERCEL_ENV !== "preview", follow: content.seo.robotsIndex && process.env.VERCEL_ENV !== "preview" },
  };
}

export default async function Page({ params }: LocationParams) {
  const { content, location } = await findLocation(params);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema(content, location)).replace(/</g, "\\u003c") }} />
    <LocationPage content={publicContent(content, location.id)} location={location} />
  </>;
}
