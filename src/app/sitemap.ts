import type {MetadataRoute} from 'next';
import {getContent} from '@/lib/content';
import {sitemapPaths} from '@/lib/seo';
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const c=await getContent();
  return sitemapPaths(c,{preview:process.env.VERCEL_ENV === 'preview'}).map((path)=>({url:`${c.seo.siteUrl.replace(/\/$/,'')}${path}`,changeFrequency:'monthly',priority:path==='/'?1:path.startsWith('/ubicaciones/')?0.8:0.3}));
}
