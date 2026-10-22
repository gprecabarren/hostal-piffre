import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { formatCopy } from "@/lib/copy";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.policies.privacyTitle,
    description: formatCopy(content.copy.privacyDescription, { sitio: content.site.name, ciudad: content.contact.city }),
    alternates: { canonical: "/politica-de-privacidad" },
  };
}

export default async function Page() {
  const content = await getContent();
  return <LegalPage title={content.policies.privacyTitle} text={content.policies.privacy} updatedAt={content.policies.updatedAt}
    copy={content.copy} siteName={content.site.name} city={content.contact.city} />;
}
