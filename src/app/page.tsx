import type { Metadata } from "next";
import Landing from "@/components/public/Landing";
import { getContent } from "@/lib/content";
import { homeSchema, publicContent } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await getContent(), "home", { preview: process.env.VERCEL_ENV === "preview" });
}

export default async function HomePage() {
  const content = await getContent();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(homeSchema(content)).replace(/</g,'\\u003c')}}/><Landing content={publicContent(content)} /></>;
}
