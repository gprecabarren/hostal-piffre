import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/page-seo";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await getContent(), "terms", { preview: process.env.VERCEL_ENV === "preview" });
}

export default async function Page() {
  const content = await getContent();
  return <LegalPage title={content.policies.termsTitle} text={content.policies.terms} updatedAt={content.policies.updatedAt}
    copy={content.copy} siteName={content.site.name} city={content.contact.city} />;
}
