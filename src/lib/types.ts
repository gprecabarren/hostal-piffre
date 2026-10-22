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
  photos: [RoomPhoto, RoomPhoto, RoomPhoto];
  bookingUrl: string;
  airbnbUrl: string;
  published: boolean;
  whatsappUrl: string;
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
