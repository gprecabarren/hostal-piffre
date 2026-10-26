import type { MetadataRoute } from 'next';
import {getContent} from '@/lib/content';
import {buildRobotsMetadata} from '@/lib/page-seo';
export default async function robots():Promise<MetadataRoute.Robots> {
  return buildRobotsMetadata(await getContent(), {preview:process.env.VERCEL_ENV === 'preview'});
}
