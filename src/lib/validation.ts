import { z } from "zod";
import { defaultPageCopy, formatCopy, pageCopyFields, type PageCopyKey } from "./copy";
import { defaultContent, defaultLocations } from "./defaults";
import { createPageSeo } from "./page-seo";
import type { PageCopy, SiteContent } from "./types";

const text = (max: number, min = 1) => z.string().trim().min(min).max(max);
function parsedUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

const httpsUrl = z.string().max(2048).refine((value) => {
  const url = parsedUrl(value);
  return url !== undefined && url.protocol === "https:" && !url.username && !url.password;
}, "Usa una dirección HTTPS válida.");

const optionalLink = (hosts: string[]) => z.union([z.literal(""), httpsUrl.refine((value) => {
  const host = parsedUrl(value)?.hostname.toLowerCase();
  return host !== undefined && hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}, "El enlace debe pertenecer a la plataforma indicada.")]);

const imageUrl = z.union([
  z.literal(""),
  httpsUrl,
  z.string().max(2048).regex(/^\/(?!\/)[a-zA-Z0-9/_\-.]+$/).refine((value) => !value.split("/").includes("..")),
]);
const photoSchema = z.object({ url: imageUrl, alt: text(250) }).strict();
export const pageSeoSchema = z.object({
  title: text(160), description: text(500), keywords: z.array(text(100)).max(30),
  canonicalUrl: z.union([z.literal(""), httpsUrl]),
  ogTitle: text(160, 0), ogDescription: text(500, 0), ogImage: imageUrl, ogImageAlt: text(250, 0),
  twitterTitle: text(160, 0), twitterDescription: text(500, 0), twitterImage: imageUrl,
  twitterCard: z.enum(["summary", "summary_large_image"]), index: z.boolean(), follow: z.boolean(),
}).strict();
const roomSchema = z.object({
  id: text(50).regex(/^[a-z0-9-]+$/),
  slug: text(80).regex(/^[a-z0-9-]+$/),
  name: text(100),
  description: text(1800, 0),
  tag: text(80, 0),
  features: z.array(text(120)).max(12),
  photos: z.array(photoSchema).max(40, "Puedes agregar hasta 40 fotografías por propiedad."),
  bookingUrl: optionalLink(["booking.com"]),
  airbnbUrl: optionalLink(["airbnb.com", "airbnb.cl"]),
  vrboUrl: optionalLink(["vrbo.com", "vrbo.cl", "homeaway.com"]),
  locationId: text(50).regex(/^[a-z0-9-]+$/),
  kind: z.enum(["room", "apartment"]),
  published: z.boolean(),
  whatsappUrl: z.union([z.literal(""), httpsUrl.refine((value) =>
    ["wa.me", "api.whatsapp.com", "whatsapp.com", "www.whatsapp.com"].includes(parsedUrl(value)?.hostname.toLowerCase() || ""),
  "El enlace debe pertenecer a WhatsApp.")]),
}).strict().superRefine((room, context) => {
  if (!room.published) return;
  if (!room.description) context.addIssue({ code: "custom", path: ["description"], message: "Agrega una descripción antes de publicar." });
  if (!room.tag) context.addIssue({ code: "custom", path: ["tag"], message: "Agrega una etiqueta breve antes de publicar." });
  if (room.photos.length < 3) context.addIssue({ code: "custom", path: ["photos"], message: "Agrega al menos tres fotografías de portada antes de publicar." });
});

const locationSchema = z.object({
  id: text(50).regex(/^[a-z0-9-]+$/), slug: text(80).regex(/^[a-z0-9-]+$/), name: text(100),
  eyebrow: text(150, 0), title: text(180, 0), titleAccent: text(180, 0), description: text(4000, 0),
  address: text(250, 0), city: text(100), region: text(150), country: text(100),
  mapUrl: z.union([z.literal(""), httpsUrl]),
  nearby: z.array(z.object({ title: text(150), description: text(1200) }).strict()).max(20),
  amenities: z.array(text(150)).max(20),
  photos: z.array(photoSchema).max(40),
  seo: pageSeoSchema,
  published: z.boolean(),
}).strict().superRefine((location, context) => {
  if (!location.published) return;
  for (const key of ["title", "description"] as const) {
    if (!location[key]) context.addIssue({ code: "custom", path: [key], message: "Completa este campo antes de publicar la ubicación." });
  }
});

const copyText = z.string().max(3000).refine((value) => !/<\/?[a-z][^>]*>/i.test(value), "Usa texto sin etiquetas HTML.");
const copyShape = Object.fromEntries(pageCopyFields.map(({ key }) => [key, copyText])) as Record<PageCopyKey, typeof copyText>;
export const pageCopySchema: z.ZodType<PageCopy> = z.object(copyShape).strict();

export const siteContentSchema: z.ZodType<SiteContent> = z.object({
  site: z.object({ name: text(100), tagline: text(180), description: text(800) }).strict(),
  hero: z.object({ eyebrow: text(150), title: text(180), titleAccent: text(180), description: text(1000) }).strict(),
  contact: z.object({
    whatsapp: z.string().regex(/^[1-9]\d{7,14}$/, "Usa el número internacional sin + ni espacios."),
    whatsappMessage: text(600),
    email: z.email().max(254),
    address: text(250),
    city: text(100),
    region: text(150),
    country: text(100),
    instagram: optionalLink(["instagram.com"]),
    mapUrl: z.union([z.literal(""), httpsUrl]),
  }).strict(),
  seo: pageSeoSchema.extend({
    siteUrl: httpsUrl.refine((value) => {
      const url = parsedUrl(value);
      return url !== undefined && url.pathname === "/" && !url.search && !url.hash;
    }, "Ingresa solamente el dominio del sitio."),
    robotsIndex: z.boolean(),
    googleSiteVerification: z.string().max(200).regex(/^[A-Za-z0-9_-]*$/, "Pega solo el token de verificación de Google, sin etiquetas HTML."),
    gtmId: z.union([z.literal(""), z.string().regex(/^GTM-[A-Z0-9]{4,20}$/, "Usa un identificador GTM- válido.")]),
  }).strict(),
  legalSeo: z.object({ privacy: pageSeoSchema, terms: pageSeoSchema }).strict(),
  rooms: z.array(roomSchema).min(1, "Conserva al menos una propiedad, aunque esté en borrador.").max(30, "Puedes gestionar hasta 30 propiedades.").refine((rooms) =>
    new Set(rooms.map((room) => room.id)).size === rooms.length && new Set(rooms.map((room) => room.slug)).size === rooms.length,
  "Cada habitación debe tener identificador y dirección únicos."),
  locations: z.array(locationSchema).min(1).max(10).refine((locations) =>
    new Set(locations.map((location) => location.id)).size === locations.length && new Set(locations.map((location) => location.slug)).size === locations.length,
  "Cada ubicación debe tener identificador y dirección únicos."),
  visitorCountries: z.array(z.object({ code: z.string().regex(/^[A-Z]{2}$/, "Usa el código de país ISO de dos letras mayúsculas."), name: text(100) }).strict()).max(50).refine((countries) =>
    new Set(countries.map((country) => country.code)).size === countries.length, "No repitas un país en la lista."),
  paymentMethods: z.array(z.object({ id: text(50).regex(/^[a-z0-9-]+$/), label: text(100), enabled: z.boolean() }).strict()).max(20).refine((methods) =>
    new Set(methods.map((method) => method.id)).size === methods.length, "Cada medio de pago debe tener un identificador único."),
  copy: pageCopySchema,
  about: z.object({ title: text(180), text: text(4000) }).strict(),
  amenities: z.array(z.object({ title: text(100), description: text(500) }).strict()).max(12),
  location: z.object({ title: text(180), description: text(2000), highlights: z.array(text(180)).max(12) }).strict(),
  faq: z.array(z.object({ question: text(250), answer: text(1500) }).strict()).max(20),
  policies: z.object({
    privacyTitle: text(180), privacy: text(24000),
    termsTitle: text(180), terms: text(24000),
    updatedAt: z.iso.date(),
  }).strict(),
}).strict().superRefine((content, context) => {
  const locationIds = new Set(content.locations.map((location) => location.id));
  content.rooms.forEach((room, index) => {
    if (!locationIds.has(room.locationId)) context.addIssue({ code: "custom", path: ["rooms", index, "locationId"], message: "Selecciona una ubicación existente para esta propiedad." });
  });
});

export const contentPayloadSchema = z.object({ content: siteContentSchema }).strict();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expandPageSeo(value: unknown, title: string, description: string) {
  const previous = isRecord(value) ? value : {};
  return {
    ...createPageSeo(title.slice(0, 160), description.slice(0, 500)), ...previous,
    // Older location drafts allowed empty SEO text; give those drafts useful
    // initial metadata without publishing them or changing their public copy.
    title: previous.title === undefined || previous.title === "" ? title.slice(0, 160) : previous.title,
    description: previous.description === undefined || previous.description === "" ? description.slice(0, 500) : previous.description,
  };
}

/** Adds only fields introduced after launch. Existing text, photos, links and order are preserved. */
export function normalizeSiteContent(value: unknown): SiteContent {
  if (!isRecord(value)) return siteContentSchema.parse(value);
  const legacySeo = isRecord(value.seo) ? value.seo : {};
  const legacyCopy = isRecord(value.copy) ? value.copy : {};
  const legacyContact = isRecord(value.contact) ? value.contact : {};
  const legacyLocation = isRecord(value.location) ? value.location : {};
  const legacySite = isRecord(value.site) ? value.site : {};
  const legacyPolicies = isRecord(value.policies) ? value.policies : {};
  const legacyLegalSeo = isRecord(value.legalSeo) ? value.legalSeo : {};
  const siteName = typeof legacySite.name === "string" ? legacySite.name : defaultContent.site.name;
  const city = typeof legacyContact.city === "string" ? legacyContact.city : defaultContent.contact.city;
  const description = typeof legacySeo.description === "string" ? legacySeo.description : defaultContent.seo.description;
  const locations = value.locations === undefined ? defaultLocations.map((location) => {
    if (location.id !== "providencia") return structuredClone(location);
    return {
      ...structuredClone(location),
      ...(typeof legacyLocation.title === "string" ? { title: legacyLocation.title, titleAccent: "" } : {}),
      ...(typeof legacyLocation.description === "string" ? { description: legacyLocation.description } : {}),
      ...Object.fromEntries(["address", "city", "region", "country", "mapUrl"].filter((key) => typeof legacyContact[key] === "string").map((key) => [key, legacyContact[key]])),
    };
  }) : value.locations;
  const normalized = {
    ...value,
    seo: { googleSiteVerification: defaultContent.seo.googleSiteVerification, gtmId: defaultContent.seo.gtmId,
      ...expandPageSeo(legacySeo, defaultContent.seo.title, defaultContent.seo.description) },
    legalSeo: {
      ...legacyLegalSeo,
      privacy: expandPageSeo(legacyLegalSeo.privacy,
        `${typeof legacyPolicies.privacyTitle === "string" ? legacyPolicies.privacyTitle : defaultContent.policies.privacyTitle} | ${siteName}`,
        formatCopy(typeof legacyCopy.privacyDescription === "string" && legacyCopy.privacyDescription ? legacyCopy.privacyDescription : defaultPageCopy.privacyDescription, { sitio: siteName, ciudad: city })),
      terms: expandPageSeo(legacyLegalSeo.terms,
        `${typeof legacyPolicies.termsTitle === "string" ? legacyPolicies.termsTitle : defaultContent.policies.termsTitle} | ${siteName}`,
        formatCopy(typeof legacyCopy.termsDescription === "string" && legacyCopy.termsDescription ? legacyCopy.termsDescription : defaultPageCopy.termsDescription, { sitio: siteName, ciudad: city })),
    },
    copy: { ...defaultPageCopy, ...legacyCopy },
    locations: Array.isArray(locations) ? locations.map((location) => isRecord(location) ? {
      ...location,
      seo: expandPageSeo(location.seo, `${typeof location.name === "string" ? location.name : "Alojamiento"} | ${siteName}`,
        typeof location.description === "string" && location.description ? location.description : description),
    } : location) : locations,
    visitorCountries: value.visitorCountries ?? [],
    paymentMethods: value.paymentMethods ?? [],
    rooms: Array.isArray(value.rooms) ? value.rooms.map((room) => isRecord(room) ? {
      published: false, whatsappUrl: "", vrboUrl: "", locationId: "providencia", kind: "room", ...room,
    } : room) : value.rooms,
  };
  return siteContentSchema.parse(normalized);
}

export function isAllowedAdmin(email: unknown, emails: string): boolean {
  if (typeof email !== "string") return false;
  return emails.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
}

/** Receives claims after cryptographic verification, never browser-submitted profile data. */
export function isAllowedVercelProfile(profile: Record<string, unknown> | undefined, clientId: string, emails: string): boolean {
  if (!profile || !clientId || profile.iss !== "https://vercel.com" || typeof profile.sub !== "string" || !profile.sub) return false;
  const audience = Array.isArray(profile.aud) ? profile.aud : [profile.aud];
  return audience.includes(clientId) && profile.email_verified !== false && isAllowedAdmin(profile.email, emails);
}

/** Mutations accept only same-origin browser requests; a missing Origin is rejected. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") return false;
  try {
    const received = new URL(origin);
    const target = new URL(request.url);
    return received.origin === target.origin && origin === received.origin;
  } catch {
    return false;
  }
}
