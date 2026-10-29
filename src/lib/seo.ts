import type { Location, Room, SiteContent } from "./types";
import { hasOwnCanonical, listSeoPages } from "./page-seo";

export function publishedLocations(content: SiteContent): Location[] {
  return content.locations.filter((location) => location.published);
}

export function publishedRooms(content: SiteContent, locationId?: string): Room[] {
  const available = new Set(publishedLocations(content).map((location) => location.id));
  return content.rooms.filter((room) => room.published && available.has(room.locationId) && (!locationId || room.locationId === locationId));
}

export function publicContent(content: SiteContent, locationId?: string): SiteContent {
  return { ...content, rooms: publishedRooms(content, locationId), locations: publishedLocations(content) };
}

export function locationUrl(content: SiteContent, location: Location): string {
  return `${content.seo.siteUrl.replace(/\/$/, "")}/ubicaciones/${location.slug}`;
}

function absoluteImages(content: SiteContent, images: string[]): string[] {
  return [...new Set(images.filter(Boolean).map((image) => new URL(image, content.seo.siteUrl).toString()))];
}

/** Keep every public page's identity graph complete when crawled on its own. */
function siteIdentitySchema(content: SiteContent): Record<string, unknown>[] {
  const base = content.seo.siteUrl.replace(/\/$/, "");
  return [
    { "@type": "Organization", "@id": `${base}/#organization`, name: content.site.name, url: `${base}/`,
      logo: `${base}/brand/logo.webp`, telephone: `+${content.contact.whatsapp}`, email: content.contact.email,
      ...(content.contact.instagram ? { sameAs: [content.contact.instagram] } : {}) },
    { "@type": "WebSite", "@id": `${base}/#website`, url: `${base}/`, name: content.site.name,
      publisher: { "@id": `${base}/#organization` }, inLanguage: "es-CL" },
  ];
}

export function lodgingSchema(content: SiteContent, location: Location): Record<string, unknown> {
  const base = content.seo.siteUrl.replace(/\/$/, "");
  const url = locationUrl(content, location);
  const properties = publishedRooms(content, location.id);
  const images = absoluteImages(content, [...location.photos.slice(0, 3).map((photo) => photo.url), ...properties.flatMap((room) => room.photos.slice(0, 3).map((photo) => photo.url))]);
  return {
    "@type": "LodgingBusiness", "@id": `${url}#alojamiento`,
    name: `${content.site.name} · ${location.name}`, url, description: location.seo.description,
    telephone: `+${content.contact.whatsapp}`, email: content.contact.email,
    logo: `${base}/brand/logo.webp`, parentOrganization: { "@id": `${base}/#organization` },
    address: {
      "@type": "PostalAddress",
      ...(location.address ? { streetAddress: location.address } : {}),
      addressLocality: location.city, addressRegion: location.region, addressCountry: location.country === "Chile" ? "CL" : location.country,
    },
    ...(location.mapUrl ? { hasMap: location.mapUrl } : {}),
    ...(images.length ? { image: images } : {}),
    ...(content.contact.instagram ? { sameAs: [content.contact.instagram] } : {}),
    ...(location.amenities.length ? { amenityFeature: location.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) } : {}),
    ...(properties.length ? { containsPlace: properties.map((room) => ({
      "@type": room.kind === "apartment" ? "Apartment" : "Room",
      "@id": `${url}#${room.slug}`, name: room.name, description: room.description,
      identifier: room.id,
      amenityFeature: room.features.filter((feature) => feature.toLowerCase() !== location.name.toLowerCase()).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      ...(room.photos.some((photo) => photo.url) ? { image: absoluteImages(content, room.photos.slice(0, 3).map((photo) => photo.url)) } : {}),
    })) } : {}),
  };
}

export function homeSchema(content: SiteContent) {
  const base = content.seo.siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteIdentitySchema(content),
      ...publishedLocations(content).map((location) => lodgingSchema(content, location)),
      { "@type": "WebPage", "@id": `${base}/#webpage`, url: `${base}/`, name: content.seo.title, description: content.seo.description,
        isPartOf: { "@id": `${base}/#website` }, publisher: { "@id": `${base}/#organization` }, inLanguage: "es-CL",
        about: publishedLocations(content).map((location) => ({ "@id": `${locationUrl(content, location)}#alojamiento` })) },
      ...(content.faq.length ? [{ "@type": "FAQPage", "@id": `${base}/#preguntas-frecuentes`,
        isPartOf: { "@id": `${base}/#webpage` }, mainEntity: content.faq.map((faq) => ({
        "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })) }] : []),
    ],
  };
}

export function locationSchema(content: SiteContent, location: Location) {
  const base = content.seo.siteUrl.replace(/\/$/, "");
  const url = locationUrl(content, location);
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteIdentitySchema(content),
      lodgingSchema(content, location),
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: location.seo.title, description: location.seo.description,
        isPartOf: { "@id": `${base}/#website` }, mainEntity: { "@id": `${url}#alojamiento` },
        breadcrumb: { "@id": `${url}#breadcrumb` }, inLanguage: "es-CL" },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: content.site.name, item: base },
        { "@type": "ListItem", position: 2, name: location.name, item: url },
      ] },
    ],
  };
}

export function sitemapPaths(content: SiteContent, options: { preview?: boolean } = {}): string[] {
  if (!content.seo.robotsIndex || options.preview) return [];
  const locations = new Set(publishedLocations(content).map((location) => `location:${location.id}`));
  return listSeoPages(content).filter((page) => page.seo.index && hasOwnCanonical(content, page)
    && (!page.key.startsWith("location:") || locations.has(page.key))).map((page) => page.path);
}
