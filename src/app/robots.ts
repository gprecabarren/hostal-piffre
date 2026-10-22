import type { MetadataRoute } from 'next';
import {getContent} from '@/lib/content';
export default async function robots():Promise<MetadataRoute.Robots> {
  const {seo}=await getContent();
  const index = seo.robotsIndex && process.env.VERCEL_ENV !== 'preview';
  return {rules:{userAgent:'*',allow:index?'/':undefined,disallow:index?['/admin','/api/']:'/'},sitemap:`${seo.siteUrl}/sitemap.xml`,host:seo.siteUrl};
}
