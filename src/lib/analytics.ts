export type ContactChannel = "whatsapp" | "booking" | "airbnb" | "vrbo";

/** Classify destinations without sending their URL, query, phone or message. */
export function contactChannel(href: string): ContactChannel | null {
  try {
    const url = new URL(href);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (host === "wa.me" || host === "api.whatsapp.com" || host === "whatsapp.com" || host === "www.whatsapp.com") return "whatsapp";
    if (host === "booking.com" || host.endsWith(".booking.com")) return "booking";
    if (["airbnb.com", "airbnb.cl"].some((platform) => host === platform || host.endsWith(`.${platform}`))) return "airbnb";
    if (["vrbo.com", "vrbo.cl", "homeaway.com"].some((platform) => host === platform || host.endsWith(`.${platform}`))) return "vrbo";
  } catch { /* Relative and non-web links are not reservation destinations. */ }
  return null;
}

const defaultLocationSlugs = ["providencia", "santiago-centro"] as const;

export function isPublicAnalyticsPath(path: string, locationSlugs: readonly string[] = defaultLocationSlugs): boolean {
  if (path === "/" || path === "/politica-de-privacidad" || path === "/terminos-y-condiciones") return true;
  const location = /^\/ubicaciones\/([a-z0-9-]{1,80})$/.exec(path);
  return location !== null && locationSlugs.some((slug) => /^[a-z0-9-]{1,80}$/.test(slug) && slug === location[1]);
}
