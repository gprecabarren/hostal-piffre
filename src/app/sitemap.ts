import type {MetadataRoute} from 'next';
import {getContent} from '@/lib/content';
import {sitemapPaths} from '@/lib/seo';
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const c=await getContent();
  if(process.env.VERCEL_ENV === 'preview') return [];
  return sitemapPaths(c).map((path)=>({url:`${c.seo.siteUrl.replace(/\/$/,'')}${path}`,changeFrequency:'monthly',priority:path.startsWith('/ubicaciones/')?0.8:path?0.3:1}));
}
