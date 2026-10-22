import assert from "node:assert/strict";
import test from "node:test";
import { contactChannel, isPublicAnalyticsPath } from "../src/lib/analytics";

test("reservation events identify official destination hosts without including contact details", () => {
  const examples = [
    ["https://wa.me/56954933261?text=Mensaje%20privado", "whatsapp"],
    ["https://api.whatsapp.com/send?phone=56954933261", "whatsapp"],
    ["https://www.whatsapp.com/", "whatsapp"],
    ["https://www.booking.com/hotel/cl/example.html?checkin=2026-11-01", "booking"],
    ["https://booking.com/", "booking"],
    ["https://www.airbnb.cl/rooms/123", "airbnb"],
    ["https://www.airbnb.com/rooms/123", "airbnb"],
  ] as const;
  for (const [url, channel] of examples) assert.equal(contactChannel(url), channel);
});

test("lookalike hosts, embedded URLs and non-HTTPS links are never reservation destinations", () => {
  for (const url of [
    "https://booking.com.attacker.example/",
    "https://notbooking.com/",
    "https://booking.com@attacker.example/",
    "https://wa.me.attacker.example/",
    "https://subdomain.wa.me/",
    "https://airbnb.cl.attacker.example/",
    "https://attacker.example/?next=https://www.booking.com/",
    "https://attacker.example/#https://wa.me/56954933261",
    "http://www.booking.com/",
    "javascript:alert(1)",
    "mailto:alojamientospiffre@gmail.com",
    "/admin",
  ]) assert.equal(contactChannel(url), null, url);
});

test("analytics allowlist includes public pages and excludes administration and authentication", () => {
  for (const path of ["/", "/politica-de-privacidad", "/terminos-y-condiciones"]) assert.equal(isPublicAnalyticsPath(path), true, path);
  for (const path of ["/admin", "/admin/rooms", "/api/content", "/api/auth/callback/vercel", "/unknown", "/?next=/admin", "https://alojamientospiffre.cl/"]) assert.equal(isPublicAnalyticsPath(path), false, path);
});
