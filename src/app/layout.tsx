import type { Metadata } from 'next';
import '@fontsource-variable/manrope';
import './globals.css';
import { getContent } from '@/lib/content';
import SiteAnalytics from '@/components/SiteAnalytics';
import { buildPageMetadata } from '@/lib/page-seo';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    ...buildPageMetadata(c, 'home', {preview:process.env.VERCEL_ENV === 'preview'}),
    icons:{
      icon:[{url:'/favicon-192.png',sizes:'192x192',type:'image/png'}],
      shortcut:'/favicon.ico',
      apple:[{url:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}],
    },
    formatDetection:{telephone:false},
    verification: c.seo.googleSiteVerification ? {google:c.seo.googleSiteVerification} : undefined,
  };
}
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const content = await getContent();
  return <html lang="es-CL" data-scroll-behavior="smooth"><body>{children}<SiteAnalytics gtmId={content.seo.gtmId} copy={content.copy} enabled={process.env.VERCEL_ENV === 'production'} locationSlugs={content.locations.filter(location => location.published).map(location => location.slug)} /></body></html>;
}
