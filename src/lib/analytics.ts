export type ContactChannel = "whatsapp" | "booking" | "airbnb";

/** Classify destinations without sending their URL, query, phone or message. */
export function contactChannel(href: string): ContactChannel | null {
  try {
    const url = new URL(href);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (host === "wa.me" || host === "api.whatsapp.com" || host === "whatsapp.com" || host === "www.whatsapp.com") return "whatsapp";
    if (host === "booking.com" || host.endsWith(".booking.com")) return "booking";
    if (["airbnb.com", "airbnb.cl"].some((platform) => host === platform || host.endsWith(`.${platform}`))) return "airbnb";
  } catch { /* Relative and non-web links are not reservation destinations. */ }
  return null;
}

export function isPublicAnalyticsPath(path: string): boolean {
  return path === "/" || path === "/politica-de-privacidad" || path === "/terminos-y-condiciones";
}
