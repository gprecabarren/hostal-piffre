import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { defaultContent } from "../src/lib/defaults";
import { normalizeSiteContent, siteContentSchema } from "../src/lib/validation";

test("legacy CMS gains location-specific carousels once, without resetting existing edits or removals", () => {
  const legacy = JSON.parse(JSON.stringify(defaultContent));
  legacy.locations.forEach((location: Record<string, unknown>) => { delete location.explore; });
  legacy.locations[0].title = "Mi presentación editada";
  const expanded = normalizeSiteContent(legacy);
  assert.equal(expanded.locations[0].title, "Mi presentación editada");
  assert.equal(expanded.locations[0].explore.places.length, 8);
  assert.equal(expanded.locations[1].explore.places.length, 9);
  expanded.locations[0].explore = { ...expanded.locations[0].explore, enabled: false, title: "Mi carrusel", places: [] };
  const roundTrip = normalizeSiteContent(JSON.parse(JSON.stringify(expanded)));
  assert.deepEqual(roundTrip, expanded);
  assert.equal(roundTrip.locations[1].explore.places.length, 9);
});

test("place photos and links validate before publishing; drafts, order and image credits survive saves", () => {
  const content = structuredClone(defaultContent);
  const explore = content.locations[0].explore;
  const first = explore.places[0];
  first.mapUrl = "javascript:alert(1)";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  first.mapUrl = "https://www.google.com/maps/";
  first.photo.url = "";
  assert.equal(siteContentSchema.safeParse(content).success, false);
  first.published = false;
  explore.places.reverse();
  const saved = siteContentSchema.parse(content);
  assert.deepEqual(saved.locations[0].explore, explore);
  first.credit.sourceUrl = "https://user:password@example.com/photo";
  assert.equal(siteContentSchema.safeParse(content).success, false);
});

test("seed photographs are local, attributed and route from the correct lodging", () => {
  const required = ["teleferico", "barrio-italia", "metro-santa-isabel", "baquedano", "estadio-nacional", "movistar-arena"];
  for (const location of defaultContent.locations) {
    const places = location.explore.places;
    required.forEach(id => assert.ok(places.some(place => place.id === id)));
    for (const place of places) {
      assert.ok(existsSync(`public${place.photo.url}`));
      assert.ok(readFileSync(`public${place.photo.url}`).length < 500_000);
      assert.ok(place.photo.alt && place.credit.author && place.credit.license && place.credit.sourceUrl && place.credit.licenseUrl);
      const route = new URL(place.mapUrl);
      assert.equal(route.hostname, "www.google.com");
      assert.match(route.searchParams.get("origin")!, location.id === "providencia" ? /Los Capitanes 1253/ : /625/);
    }
  }
});
