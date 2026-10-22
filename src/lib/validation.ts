import { z } from "zod";
import type { SiteContent } from "./types";

const text = (max: number, min = 1) => z.string().trim().min(min).max(max);
const httpsUrl = z.string().max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Usa una dirección HTTPS válida.");

const optionalLink = (hosts: string[]) => z.union([z.literal(""), httpsUrl.refine((value) => {
  const host = new URL(value).hostname.toLowerCase();
  return hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}, "El enlace debe pertenecer a la plataforma indicada.")]);

const imageUrl = z.union([
  z.literal(""),
  httpsUrl,
  z.string().max(2048).regex(/^\/(?!\/)[a-zA-Z0-9/_\-.]+$/).refine((value) => !value.split("/").includes("..")),
]);
const photoSchema = z.object({ url: imageUrl, alt: text(250) }).strict();
const roomSchema = z.object({
  id: text(50).regex(/^[a-z0-9-]+$/),
  slug: text(80).regex(/^[a-z0-9-]+$/),
  name: text(100),
  description: text(1800),
  tag: text(80),
  features: z.array(text(120)).max(12),
  photos: z.tuple([photoSchema, photoSchema, photoSchema]),
  bookingUrl: optionalLink(["booking.com"]),
  airbnbUrl: optionalLink(["airbnb.com", "airbnb.cl"]),
}).strict();

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
  seo: z.object({
    title: text(160),
    description: text(500),
    keywords: z.array(text(100)).max(30),
    siteUrl: httpsUrl.refine((value) => {
      const url = new URL(value);
      return url.pathname === "/" && !url.search && !url.hash;
    }, "Ingresa solamente el dominio del sitio."),
    ogImage: imageUrl,
    robotsIndex: z.boolean(),
  }).strict(),
  rooms: z.tuple([roomSchema, roomSchema, roomSchema]).refine((rooms) =>
    new Set(rooms.map((room) => room.id)).size === 3 && new Set(rooms.map((room) => room.slug)).size === 3,
  "Cada habitación debe tener identificador y dirección únicos."),
  about: z.object({ title: text(180), text: text(4000) }).strict(),
  amenities: z.array(z.object({ title: text(100), description: text(500) }).strict()).max(12),
  location: z.object({ title: text(180), description: text(2000), highlights: z.array(text(180)).max(12) }).strict(),
  faq: z.array(z.object({ question: text(250), answer: text(1500) }).strict()).max(20),
  policies: z.object({
    privacyTitle: text(180), privacy: text(24000),
    termsTitle: text(180), terms: text(24000),
    updatedAt: z.iso.date(),
  }).strict(),
}).strict();

export const contentPayloadSchema = z.object({ content: siteContentSchema }).strict();

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
