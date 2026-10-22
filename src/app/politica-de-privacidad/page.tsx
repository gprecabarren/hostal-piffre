import type {Metadata} from 'next';
import {getContent} from '@/lib/content';
import {LegalPage} from '@/components/legal-page';
export async function generateMetadata():Promise<Metadata>{const c=await getContent();return {title:c.policies.privacyTitle,description:`Política de privacidad de ${c.site.name}. Información sobre datos de contacto y consultas de alojamiento.`,alternates:{canonical:'/politica-de-privacidad'}};}
export default async function Page(){const {policies:p}=await getContent();return <LegalPage title={p.privacyTitle} text={p.privacy} updatedAt={p.updatedAt}/>;}
