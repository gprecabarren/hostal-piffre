import Link from 'next/link';
export function LegalPage({title,text,updatedAt}:{title:string;text:string;updatedAt:string}){
  return <main className="legal-shell"><Link className="legal-back" href="/">← Volver a Hostal Piffre</Link><p className="legal-eyebrow">HOSTAL PIFFRE · PROVIDENCIA</p><h1>{title}</h1><p className="legal-date">Actualización: {new Intl.DateTimeFormat('es-CL',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${updatedAt}T12:00:00Z`))}</p><div className="legal-copy">{text.split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}</div><nav aria-label="Información legal"><Link href="/politica-de-privacidad">Privacidad</Link><Link href="/terminos-y-condiciones">Términos y condiciones</Link></nav></main>;
}
