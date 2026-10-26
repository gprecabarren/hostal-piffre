import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/lib/defaults";
import { homeSchema, locationSchema, publicContent, sitemapPaths } from "../src/lib/seo";

test("each published location has its own lodging entity and apartments are not counted as rooms", () => {
  const graph = homeSchema(defaultContent)["@graph"] as Record<string, unknown>[];
  const businesses = graph.filter((entity) => entity["@type"] === "LodgingBusiness");
  assert.equal(businesses.length, 2);
  const providencia = businesses.find((entity) => String(entity["@id"]).includes("/providencia#"))!;
  const centro = businesses.find((entity) => String(entity["@id"]).includes("/santiago-centro#"))!;
  assert.equal(providencia.numberOfRooms, undefined);
  assert.equal(centro.numberOfRooms, undefined);
  assert.equal((centro.containsPlace as { "@type": string }[]).filter((item) => item["@type"] === "Apartment").length, 3);
  for (const entity of businesses) {
    assert.equal(entity.geo, undefined);
    assert.equal(entity.aggregateRating, undefined);
    assert.equal(entity.review, undefined);
    assert.equal(entity.priceRange, undefined);
    assert.equal(entity.offers, undefined);
  }
});

test("unpublished locations and properties stay out of public content, schemas and sitemap", () => {
  const content = structuredClone(defaultContent);
  content.locations[1].published = false;
  assert.deepEqual(publicContent(content).rooms.map((room) => room.id), ["habitacion-2"]);
  assert.equal(publicContent(content).locations.length, 1);
  assert.equal(sitemapPaths(content).includes("/ubicaciones/santiago-centro"), false);
  assert.equal(JSON.stringify(homeSchema(content)).includes("departamento-1"), false);
  const schema = locationSchema(content, content.locations[0]);
  assert.equal(JSON.stringify(schema).includes("habitacion-1"), false);
  assert.equal(JSON.stringify(schema).includes("habitacion-2"), true);
  content.seo.robotsIndex = false;
  assert.deepEqual(sitemapPaths(content), []);
});
