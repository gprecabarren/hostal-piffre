import assert from "node:assert/strict";
import test from "node:test";
import { defaultContent } from "../src/lib/defaults";
import { homeSchema, locationSchema, publicContent, sitemapPaths } from "../src/lib/seo";
import { buildPageMetadata, buildRobotsMetadata, listSeoPages } from "../src/lib/page-seo";
import { normalizeSiteContent } from "../src/lib/validation";

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

test("five public pages produce independent absolute metadata with social fallbacks", () => {
  const content = structuredClone(defaultContent);
  const pages = listSeoPages(content);
  assert.equal(pages.length, 5);
  assert.strictEqual(pages.find((page) => page.key === "home")?.seo, content.seo);
  assert.strictEqual(pages.find((page) => page.key === "privacy")?.seo, content.legalSeo.privacy);
  const canonicals = new Set<string>();
  for (const page of pages) {
    const metadata = buildPageMetadata(content, page.key);
    const canonical = new URL(page.path, content.seo.siteUrl).toString();
    assert.deepEqual(metadata.title, { absolute: page.seo.title });
    assert.equal(metadata.description, page.seo.description);
    assert.equal(metadata.alternates?.canonical, canonical);
    assert.equal(metadata.openGraph?.url, canonical);
    assert.deepEqual(metadata.robots, { index: true, follow: true });
    assert.equal(metadata.openGraph?.title, page.seo.ogTitle || page.seo.title);
    assert.equal(metadata.twitter?.title, page.seo.twitterTitle || page.seo.ogTitle || page.seo.title);
    const ogImages = metadata.openGraph?.images as { url: string; alt: string }[];
    const twitterImages = metadata.twitter?.images as { url: string; alt: string }[];
    assert.ok(ogImages[0].url.startsWith("https://"));
    assert.ok(twitterImages[0].url.startsWith("https://"));
    assert.ok(ogImages[0].alt);
    canonicals.add(canonical);
  }
  assert.equal(canonicals.size, 5);
  content.locations[1].seo.ogTitle = "Compartir departamento";
  content.locations[1].seo.ogDescription = "Descripción social del departamento";
  content.locations[1].seo.ogImage = "/media/depto-1/01.webp";
  content.locations[1].seo.ogImageAlt = "Sala de estar del departamento";
  content.locations[1].seo.twitterTitle = "Título exclusivo en X";
  content.locations[1].seo.twitterImage = "/media/depto-1/02.webp";
  content.locations[1].seo.twitterCard = "summary";
  const metadata = buildPageMetadata(content, `location:${content.locations[1].id}`);
  assert.equal(metadata.openGraph?.title, "Compartir departamento");
  assert.equal(metadata.twitter?.title, "Título exclusivo en X");
  assert.equal(metadata.twitter?.description, "Descripción social del departamento");
  assert.equal((metadata.twitter as { card: string }).card, "summary");
  assert.equal((metadata.openGraph?.images as { url: string }[])[0].url, "https://alojamientospiffre.cl/media/depto-1/01.webp");
  assert.equal((metadata.twitter?.images as { url: string }[])[0].url, "https://alojamientospiffre.cl/media/depto-1/02.webp");
});

test("page index, follow, global noindex and preview remain independent and consistent with robots.txt", () => {
  const content = structuredClone(defaultContent);
  content.legalSeo.privacy.index = false;
  assert.deepEqual(buildPageMetadata(content, "privacy").robots, { index: false, follow: true });
  assert.equal(sitemapPaths(content).includes("/politica-de-privacidad"), false);
  assert.equal(sitemapPaths(content).includes("/terminos-y-condiciones"), true);
  content.legalSeo.terms.follow = false;
  assert.deepEqual(buildPageMetadata(content, "terms").robots, { index: true, follow: false });
  content.seo.robotsIndex = false;
  assert.deepEqual(buildPageMetadata(content, "home").robots, { index: false, follow: true });
  assert.deepEqual(sitemapPaths(content), []);
  content.seo.siteUrl = "https://alojamientospiffre.cl/";
  const robots = buildRobotsMetadata(content);
  assert.deepEqual(robots.rules, { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] });
  assert.equal(robots.sitemap, "https://alojamientospiffre.cl/sitemap.xml");
  assert.deepEqual(buildRobotsMetadata(content, { preview: true }), { rules: { userAgent: "*", disallow: "/" } });
  assert.deepEqual(buildPageMetadata(content, "home", { preview: true }).robots, { index: false, follow: false });
  content.seo.robotsIndex = true;
  assert.deepEqual(sitemapPaths(content, { preview: true }), []);
});

test("all default social cards use the official branded image while per-page overrides still win", () => {
  const content = structuredClone(defaultContent);
  for (const page of listSeoPages(content)) {
    const image = (buildPageMetadata(content, page.key).openGraph?.images as { url: string; width: number; height: number }[])[0];
    assert.equal(image.url, "https://alojamientospiffre.cl/imagen-social/v2");
    assert.equal(image.width, 1200);
    assert.equal(image.height, 630);
  }
  content.locations[0].seo.ogImage = "/media/hostal-2/01.webp";
  assert.equal((buildPageMetadata(content, "location:providencia").openGraph?.images as {url: string}[])[0].url, "https://alojamientospiffre.cl/media/hostal-2/01.webp");
});

test("sitemap excludes drafts, noindex pages and sources canonicalized to another internal or external URL", () => {
  const content = structuredClone(defaultContent);
  content.locations[0].published = false;
  content.locations[1].seo.canonicalUrl = "https://external.example/apartment";
  content.legalSeo.privacy.canonicalUrl = "https://alojamientospiffre.cl/terminos-y-condiciones";
  content.seo.canonicalUrl = "https://alojamientospiffre.cl";
  assert.equal(listSeoPages(content).length, 5, "draft locations remain editable");
  assert.deepEqual(sitemapPaths(content), ["/", "/terminos-y-condiciones"]);
  assert.equal(buildPageMetadata(content, `location:${content.locations[1].id}`).alternates?.canonical, "https://external.example/apartment");
});

test("legacy SEO expands without replacing edits and legal metadata migrates from its existing copy once", () => {
  const current = structuredClone(defaultContent);
  const { legalSeo: _legalSeo, ...legacy } = current;
  const oldSeo = {
    title: "Mi inicio editado", description: "Descripción del cliente para el inicio", keywords: ["palabra editada"],
    siteUrl: current.seo.siteUrl, robotsIndex: false, googleSiteVerification: current.seo.googleSiteVerification,
    gtmId: current.seo.gtmId, ogImage: "/custom-social.webp",
  };
  const raw = {
    ...legacy, site: { ...current.site, name: "Alojamiento del cliente" }, seo: oldSeo,
    policies: { ...current.policies, privacyTitle: "Privacidad personalizada" },
    copy: { ...current.copy, privacyDescription: "Privacidad de {sitio} en {ciudad}." },
    locations: current.locations.map((location) => ({ ...location, seo: { title: `SEO editado ${location.id}`, description: "Descripción editada de la ubicación" } })),
  };
  const before = structuredClone(raw);
  const normalized = normalizeSiteContent(raw);
  assert.deepEqual(raw, before);
  assert.equal(normalized.seo.title, oldSeo.title);
  assert.equal(normalized.seo.ogImage, oldSeo.ogImage);
  assert.deepEqual(normalized.seo.keywords, oldSeo.keywords);
  assert.equal(normalized.seo.robotsIndex, false);
  assert.equal(normalized.seo.follow, true);
  assert.equal(normalized.locations[0].seo.title, "SEO editado providencia");
  assert.equal(normalized.locations[0].seo.twitterCard, "summary_large_image");
  assert.equal(normalized.legalSeo.privacy.title, "Privacidad personalizada | Alojamiento del cliente");
  assert.equal(normalized.legalSeo.privacy.description, "Privacidad de Alojamiento del cliente en Santiago.");
  assert.equal(normalized.copy.privacyDescription, raw.copy.privacyDescription);
  normalized.legalSeo.privacy.title = "Nuevo título SEO independiente";
  normalized.legalSeo.privacy.index = false;
  normalized.copy.privacyDescription = "Texto legado que ya no manda";
  const saved = normalizeSiteContent(normalized);
  assert.equal(saved.legalSeo.privacy.title, "Nuevo título SEO independiente");
  assert.equal(saved.legalSeo.privacy.description, "Privacidad de Alojamiento del cliente en Santiago.");
  assert.equal(saved.legalSeo.privacy.index, false);
  assert.deepEqual(saved, normalizeSiteContent(saved));
});
