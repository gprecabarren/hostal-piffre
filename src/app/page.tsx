import Landing from "@/components/public/Landing";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();
  const base = content.seo.siteUrl.replace(/\/$/, '');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness', '@id': `${base}/#hostal`, name: content.site.name,
        url: base, description: content.seo.description, telephone: `+${content.contact.whatsapp}`,
        email: content.contact.email, logo: `${base}/brand/logo.webp`, numberOfRooms: content.rooms.filter(room => room.published).length,
        address: { '@type': 'PostalAddress', streetAddress: content.contact.address,
          addressLocality: content.contact.city, addressRegion: content.contact.region, addressCountry: 'CL' },
        ...(content.contact.mapUrl ? { hasMap: content.contact.mapUrl } : {}),
        ...(content.contact.instagram ? { sameAs: [content.contact.instagram] } : {}),
        image: content.rooms.filter(room => room.published).flatMap(room => room.photos.filter(photo => photo.url).map(photo => photo.url)),
      },
      { '@type': 'WebSite', '@id': `${base}/#website`, url: base, name: content.site.name, inLanguage: 'es-CL' },
      ...(content.faq.length ? [{ '@type': 'FAQPage', mainEntity: content.faq.map(faq => ({
        '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      })) }] : []),
    ]
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Landing content={{...content, rooms:content.rooms.filter(room => room.published)}} /></>;
}
