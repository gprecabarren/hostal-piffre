import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';
import { getContent } from '@/lib/content';
import SiteAnalytics from '@/components/SiteAnalytics';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    metadataBase: new URL(c.seo.siteUrl),
    title: {default:c.seo.title, template:`%s | ${c.site.name}`},
    description:c.seo.description, keywords:c.seo.keywords,
    alternates:{canonical:'/'},
    openGraph:{type:'website',locale:'es_CL',siteName:c.site.name,title:c.seo.title,description:c.seo.description,url:c.seo.siteUrl,images:[{url:c.seo.ogImage,width:1200,height:630,alt:c.site.name}]},
    twitter:{card:'summary_large_image',title:c.seo.title,description:c.seo.description,images:[c.seo.ogImage]},
    robots:{index:c.seo.robotsIndex && process.env.VERCEL_ENV !== 'preview',follow:c.seo.robotsIndex && process.env.VERCEL_ENV !== 'preview'},
    icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.png'},
    formatDetection:{telephone:false},
    verification: c.seo.googleSiteVerification ? {google:c.seo.googleSiteVerification} : undefined,
  };
}
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const content = await getContent();
  return <html lang="es-CL"><body>{children}<SiteAnalytics gtmId={content.seo.gtmId} copy={content.copy} enabled={process.env.VERCEL_ENV === 'production'} locationSlugs={content.locations.filter(location => location.published).map(location => location.slug)} /></body></html>;
}
