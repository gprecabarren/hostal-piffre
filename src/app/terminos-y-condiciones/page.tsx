import type {Metadata} from 'next';
import {getContent} from '@/lib/content';
import {LegalPage} from '@/components/legal-page';
export async function generateMetadata():Promise<Metadata>{const c=await getContent();return {title:c.policies.termsTitle,description:`Condiciones de uso y consultas de reservas de ${c.site.name}, alojamiento en Providencia.`,alternates:{canonical:'/terminos-y-condiciones'}};}
export default async function Page(){const {policies:p}=await getContent();return <LegalPage title={p.termsTitle} text={p.terms} updatedAt={p.updatedAt}/>;}
