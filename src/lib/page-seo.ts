import type { Metadata, MetadataRoute } from "next";
import type { PageSeo, SiteContent } from "./types";

export type SeoPageKey = "home" | "privacy" | "terms" | `location:${string}`;
export interface SeoPage { key: SeoPageKey; label: string; path: string; seo: PageSeo }

/** Shared, client-safe defaults. Empty social fields inherit at metadata-render time. */
export function createPageSeo(title: string, description: string, overrides: Partial<PageSeo> = {}): PageSeo {
  return {
    title, description, keywords: [], canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", ogImageAlt: "",
    twitterTitle: "", twitterDescription: "", twitterImage: "", twitterCard: "summary_large_image", index: true, follow: true,
    ...overrides,
  };
}

/** The editor receives all locations, including drafts; each entry points at its one persisted SEO object. */
export function listSeoPages(content: SiteContent): SeoPage[] {
  return [
    { key: "home", label: "Inicio", path: "/", seo: content.seo },
    ...content.locations.map((location): SeoPage => ({ key: `location:${location.id}`, label: `Ubicación: ${location.name}`, path: `/ubicaciones/${location.slug}`, seo: location.seo })),
    { key: "privacy", label: "Política de privacidad", path: "/politica-de-privacidad", seo: content.legalSeo.privacy },
    { key: "terms", label: "Términos y condiciones", path: "/terminos-y-condiciones", seo: content.legalSeo.terms },
  ];
}

export function seoPageCanonical(content: SiteContent, page: SeoPage): string {
  return new URL(page.seo.canonicalUrl || page.path, content.seo.siteUrl).toString();
}

/** Sources with a canonical pointing elsewhere must not be advertised as independent sitemap URLs. */
export function hasOwnCanonical(content: SiteContent, page: SeoPage): boolean {
  return seoPageCanonical(content, page) === new URL(page.path, content.seo.siteUrl).toString();
}

export function buildPageMetadata(content: SiteContent, key: SeoPageKey, options: { preview?: boolean } = {}): Metadata {
  const page = listSeoPages(content).find((item) => item.key === key);
  if (!page) throw new Error("No existe la configuración SEO de esta página.");
  const seo = page.seo;
  const canonical = seoPageCanonical(content, page);
  const location = key.startsWith("location:") ? content.locations.find((item) => key === `location:${item.id}`) : undefined;
  const locationPhoto = location?.photos.find((photo) => photo.url);
  const image = seo.ogImage || locationPhoto?.url || content.seo.ogImage || "/og-image.png";
  const imageAlt = seo.ogImageAlt || (!seo.ogImage ? locationPhoto?.alt : "") || content.seo.ogImageAlt || seo.title;
  const ogTitle = seo.ogTitle || seo.title;
  const ogDescription = seo.ogDescription || seo.description;
  const absoluteImage = new URL(image, content.seo.siteUrl).toString();
  const twitterImage = new URL(seo.twitterImage || image, content.seo.siteUrl).toString();
  return {
    metadataBase: new URL(content.seo.siteUrl),
    title: { absolute: seo.title }, description: seo.description, keywords: seo.keywords,
    alternates: { canonical },
    openGraph: { type: "website", locale: "es_CL", siteName: content.site.name, url: canonical,
      title: ogTitle, description: ogDescription, images: [{ url: absoluteImage, alt: imageAlt }] },
    twitter: { card: seo.twitterCard, title: seo.twitterTitle || ogTitle, description: seo.twitterDescription || ogDescription,
      images: [{ url: twitterImage, alt: imageAlt }] },
    robots: { index: content.seo.robotsIndex && seo.index && !options.preview, follow: seo.follow && !options.preview },
  };
}

/** Crawlers must reach public pages to read their noindex directives. */
export function buildRobotsMetadata(content: SiteContent, options: { preview?: boolean } = {}): MetadataRoute.Robots {
  if (options.preview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: new URL("/sitemap.xml", content.seo.siteUrl).toString(),
    host: new URL(content.seo.siteUrl).origin,
  };
}
