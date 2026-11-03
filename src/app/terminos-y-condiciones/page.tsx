import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/page-seo";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(await getContent(), "terms", { preview: process.env.VERCEL_ENV === "preview" });
}

export default async function Page() {
  const content = await getContent();
  const creditedPlaces = [...new Map(content.locations.filter(location => location.published && location.explore.enabled)
    .flatMap(location => location.explore.places)
    .filter(place => place.published && place.photo.url && (place.credit.author || place.credit.sourceUrl))
    .map(place => [place.photo.url, place])).values()];
  return <LegalPage title={content.policies.termsTitle} text={content.policies.terms} updatedAt={content.policies.updatedAt}
    copy={content.copy} siteName={content.site.name} city={content.contact.city}>
    {creditedPlaces.length ? <section id="creditos-fotograficos" className="legal-photo-credits">
      <h2>Créditos de las fotografías</h2>
      <p>Fotografías utilizadas para presentar los lugares de Santiago. Cada imagen conserva la licencia indicada por su autor.</p>
      <ul>{creditedPlaces.map(place => <li key={place.photo.url}>
        <strong>{place.title}</strong> · {place.credit.author}
        {place.credit.sourceUrl ? <> · <a href={place.credit.sourceUrl} target="_blank" rel="noopener noreferrer">Fotografía original</a></> : null}
        {place.credit.licenseUrl ? <> · <a href={place.credit.licenseUrl} target="_blank" rel="noopener noreferrer">{place.credit.license}</a></> : place.credit.license ? ` · ${place.credit.license}` : ""}
        {place.credit.changes ? <span> {place.credit.changes}</span> : null}
      </li>)}</ul>
    </section> : null}
  </LegalPage>;
}
