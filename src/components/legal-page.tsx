import Link from "next/link";
import { formatCopy, type PageCopy } from "@/lib/copy";

interface LegalPageProps {
  title: string;
  text: string;
  updatedAt: string;
  copy: PageCopy;
  siteName: string;
  city: string;
}

export function LegalPage({ title, text, updatedAt, copy, siteName, city }: LegalPageProps) {
  const variables = { sitio: siteName, ciudad: city };
  const updatedDate = new Intl.DateTimeFormat("es-CL", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${updatedAt}T12:00:00Z`));

  return <main className="legal-page">
    <Link className="legal-back" href="/">← {formatCopy(copy.legalBack, variables)}</Link>
    <p className="legal-eyebrow">{siteName} · {city}</p>
    <h1>{title}</h1>
    <p className="legal-updated">{formatCopy(copy.legalUpdated, variables)}: {updatedDate}</p>
    <div className="legal-text">{text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    <nav className="legal-links" aria-label={formatCopy(copy.legalNavAria, variables)}>
      <Link href="/politica-de-privacidad">{formatCopy(copy.footerPrivacy, variables)}</Link>
      <Link href="/terminos-y-condiciones">{formatCopy(copy.footerTerms, variables)}</Link>
    </nav>
  </main>;
}
