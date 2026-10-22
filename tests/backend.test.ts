import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/lib/defaults";
import { isAllowedAdmin, isAllowedVercelProfile, isSameOrigin, siteContentSchema } from "../src/lib/validation";

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

test("content rejects malicious links, excess rooms and missing photo slots", () => {
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
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [...content.rooms, content.rooms[0]] }).success, false);
  assert.equal(siteContentSchema.safeParse({ ...content, rooms: [{ ...content.rooms[0], photos: [] }, content.rooms[1], content.rooms[2]] }).success, false);
  content.rooms[1].id = content.rooms[0].id;
  assert.equal(siteContentSchema.safeParse(content).success, false);
});
