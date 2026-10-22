import type {MetadataRoute} from 'next';
import {getContent} from '@/lib/content';
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const c=await getContent();
  if(!c.seo.robotsIndex) return [];
  return ['', '/politica-de-privacidad', '/terminos-y-condiciones'].map((path)=>({url:`${c.seo.siteUrl}${path}`,changeFrequency:'monthly',priority:path?0.3:1}));
}
