import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/lib/defaults";
import { defaultPageCopy, formatCopy, pageCopyFields } from "../src/lib/copy";
import { isAllowedAdmin, isAllowedVercelProfile, isSameOrigin, normalizeSiteContent, siteContentSchema } from "../src/lib/validation";

test("the editable initial content is valid and has exactly three empty photo slots per room", () => {
  assert.equal(siteContentSchema.safeParse(defaultContent).success, true);
  assert.equal(defaultContent.rooms.length, 3);
  assert.ok(defaultContent.rooms.every((room) => room.photos.length === 3 && room.photos.every((photo) => photo.url === "")));
});

test("admin authorization rejects other accounts and unsafe identity claims", () => {
  const emails = "alojamientospiffre@gmail.com";
  const claims = { sub: "user_test", iss: "https://vercel.com", aud: "client_test", email: emails };
  assert.equal(isAllowedAdmin("ALOJAMIENTOSPIFFRE@gmail.com", emails), true);
  assert.equal(isAllowedAdmin("other@gmail.com", emails), false);
  assert.equal(isAllowedAdmin(null, emails), false);
  assert.equal(isAllowedVercelProfile(claims, "client_test", emails), true);
  assert.equal(isAllowedVercelProfile({ ...claims, iss: "https://attacker.example" }, "client_test", emails), false);
  assert.equal(isAllowedVercelProfile({ ...claims, aud: "another_client" }, "client_test", emails), false);
  assert.equal(isAllowedVercelProfile({ ...claims, email: "other@gmail.com" }, "client_test", emails), false);
  assert.equal(isAllowedVercelProfile({ ...claims, email_verified: false }, "client_test", emails), false);
  assert.equal(isAllowedVercelProfile(undefined, "client_test", emails), false);
});

test("mutations require a matching Origin and reject cross-site or missing origins", () => {
  const request = (origin?: string, site?: string) => new Request("https://alojamientospiffre.cl/api/content", {
    method: "PUT", headers: { ...(origin ? { Origin: origin } : {}), ...(site ? { "Sec-Fetch-Site": site } : {}) },
  });
  assert.equal(isSameOrigin(request("https://alojamientospiffre.cl", "same-origin")), true);
  assert.equal(isSameOrigin(request()), false);
  assert.equal(isSameOrigin(request("https://attacker.example")), false);
  assert.equal(isSameOrigin(request("https://alojamientospiffre.cl", "cross-site")), false);
  assert.equal(isSameOrigin(request("https://alojamientospiffre.cl/")), false);
});

test("content rejects malicious platform links and missing photo slots", () => {
  const content = structuredClone(defaultContent);
  content.rooms[0].bookingUrl = "javascript:alert(1)";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  content.rooms[0].bookingUrl = "https://booking.com.attacker.example/";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  content.rooms[0].bookingUrl = "https://www.booking.com/hotel/cl/piffre-de-vauban.es.html";
  assert.equal(siteContentSchema.safeParse(content).success, true);
  content.contact.instagram = "https://attacker.example/account";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  content.contact.instagram = "";
  content.rooms[0].photos[0].url = "//attacker.example/tracker.svg";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  content.rooms[0].photos[0].url = "";
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [{ ...content.rooms[0], photos: [] }, content.rooms[1], content.rooms[2]] }).success, false);
  content.rooms[1].id = content.rooms[0].id;
  assert.equal(siteContentSchema.safeParse(content).success, false);
});

test("properties can be added, reordered and drafted while preserving unique identities", () => {
  const properties = Array.from({ length: 30 }, (_, index) => ({ ...structuredClone(defaultContent.rooms[0]), id: `property-${index}`, slug: `property-${index}` }));
  const content = { ...structuredClone(defaultContent), rooms: properties };
  assert.equal(siteContentSchema.safeParse(content).success, true);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: properties.slice(0, 1) }).success, true);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [] }).success, false);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [...properties, { ...properties[0], id: "extra", slug: "extra" }] }).success, false);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [properties[0], { ...properties[1], slug: properties[0].slug }] }).success, false);
  const draft = { ...properties[0], published: false, description: "", tag: "" };
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [draft] }).success, true);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [{ ...draft, published: true }] }).success, false);
  const reversed = normalizeSiteContent({ ...content, rooms: properties.toReversed() });
  assert.deepEqual(reversed.rooms.map((room) => room.id), properties.map((room) => room.id).toReversed());
});

test("legacy content gains only the new fields and preserves edited text, links and photographs", () => {
  const { copy: _copy, ...legacy } = structuredClone(defaultContent);
  const { googleSiteVerification: _verification, gtmId: _gtm, ...legacySeo } = legacy.seo;
  const legacyRooms = legacy.rooms.map(({ published: _published, whatsappUrl: _whatsappUrl, ...room }) => room);
  legacyRooms[0].name = "Mi propiedad Ñ";
  legacyRooms[0].photos[0] = { url: "https://example.supabase.co/storage/v1/object/public/room-images/custom.webp", alt: "Foto real de mi propiedad" };
  const raw = { ...legacy, hero: { ...legacy.hero, title: "Mi título guardado" }, seo: legacySeo, rooms: legacyRooms };
  const before = structuredClone(raw);
  const normalized = normalizeSiteContent(raw);
  assert.deepEqual(raw, before);
  assert.equal(normalized.hero.title, "Mi título guardado");
  assert.deepEqual(normalized.rooms[0].photos, legacyRooms[0].photos);
  assert.equal(normalized.rooms[0].bookingUrl, legacyRooms[0].bookingUrl);
  assert.equal(normalized.rooms[0].name, "Mi propiedad Ñ");
  assert.ok(normalized.rooms.every((room) => room.published && room.whatsappUrl === ""));
  assert.deepEqual(normalized.copy, defaultPageCopy);
  assert.equal(normalized.seo.gtmId, defaultContent.seo.gtmId);
  assert.equal(normalized.seo.googleSiteVerification, defaultContent.seo.googleSiteVerification);
  const custom = normalizeSiteContent({ ...normalized, seo: { ...normalized.seo, gtmId: "" }, copy: { ...normalized.copy, navContact: "Conversa con nosotros" } });
  assert.equal(custom.seo.gtmId, "");
  assert.equal(custom.copy.navContact, "Conversa con nosotros");
});

test("WhatsApp overrides accept only official HTTPS hosts and tracking fields accept only identifiers", () => {
  const content = structuredClone(defaultContent);
  for (const url of ["https://wa.me/56954933261", "https://api.whatsapp.com/send?phone=56954933261", "https://www.whatsapp.com/"]) {
    content.rooms[0].whatsappUrl = url;
    assert.equal(siteContentSchema.safeParse(content).success, true);
  }
  for (const url of ["javascript:alert(1)", "https://wa.me.attacker.example/", "https://wa.me@attacker.example/", "http://wa.me/56954933261"]) {
    content.rooms[0].whatsappUrl = url;
    assert.equal(siteContentSchema.safeParse(content).success, false);
  }
  content.rooms[0].whatsappUrl = "";
  content.seo.gtmId = "<script>tracking()</script>";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  content.seo.gtmId = "GTM-ABC1234";
  content.seo.googleSiteVerification = '<meta name="google-site-verification">';
  assert.equal(siteContentSchema.safeParse(content).success, false);
});

test("page copy preserves multiline text, supports known variables and rejects HTML", () => {
  assert.equal(new Set(pageCopyFields.map(({ key }) => key)).size, pageCopyFields.length);
  const content = structuredClone(defaultContent);
  content.copy.contactTitle = "Una pausa.\nUn nuevo comienzo.";
  assert.equal(siteContentSchema.parse(content).copy.contactTitle, content.copy.contactTitle);
  assert.equal(formatCopy("{habitaciones} espacios de {sitio}, {desconocida}", { habitaciones: 4, sitio: "Piffre" }), "4 espacios de Piffre, {desconocida}");
  content.copy.contactTitle = '<img src="x" onerror="alert(1)">';
  assert.equal(siteContentSchema.safeParse(content).success, false);
});
