import type { PageCopy } from "./copy";
export type { PageCopy, PageCopyKey } from "./copy";

export interface RoomPhoto {
  /** Empty until an actual photograph is uploaded. */
  url: string;
  alt: string;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  tag: string;
  features: string[];
  /** The first three entries are covers; later entries form the extended gallery. */
  photos: RoomPhoto[];
  bookingUrl: string;
  airbnbUrl: string;
  published: boolean;
  whatsappUrl: string;
  vrboUrl: string;
  locationId: string;
  kind: "room" | "apartment";
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  address: string;
  city: string;
  region: string;
  country: string;
  mapUrl: string;
  nearby: { title: string; description: string }[];
  amenities: string[];
  photos: RoomPhoto[];
  seo: { title: string; description: string };
  published: boolean;
}

export interface VisitorCountry {
  code: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  enabled: boolean;
}

export interface SiteContent {
  site: { name: string; tagline: string; description: string };
  hero: { eyebrow: string; title: string; titleAccent: string; description: string };
  contact: {
    whatsapp: string;
    whatsappMessage: string;
    email: string;
    address: string;
    city: string;
    region: string;
    country: string;
    instagram: string;
    mapUrl: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    siteUrl: string;
    ogImage: string;
    robotsIndex: boolean;
    googleSiteVerification: string;
    gtmId: string;
  };
  rooms: Room[];
  locations: Location[];
  visitorCountries: VisitorCountry[];
  paymentMethods: PaymentMethod[];
  copy: PageCopy;
  about: { title: string; text: string };
  amenities: { title: string; description: string }[];
  location: { title: string; description: string; highlights: string[] };
  faq: { question: string; answer: string }[];
  policies: {
    privacyTitle: string;
    privacy: string;
    termsTitle: string;
    terms: string;
    updatedAt: string;
  };
}

export interface ContentStatus {
  configured: boolean;
  persisted: boolean;
  updatedAt?: string;
  error?: string;
}
