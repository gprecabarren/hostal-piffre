"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { formatCopy } from "@/lib/copy";
import type { SiteContent } from "@/lib/types";
import { CountryFlag, PaymentMark } from "./brand-marks";
import { Icon } from "./icons";
import NeighborhoodMap from "./NeighborhoodMap";
import { publishedLocations, whatsappUrl } from "./content-helpers";

export function Brand({ content, footer = false }: { content: SiteContent; footer?: boolean }) {
  return <a href="/#contenido" className={`brand${footer ? " brand--footer" : ""}`} aria-label={formatCopy(content.copy.brandAria, { sitio: content.site.name })}><span className="brand-symbol brand-symbol--official" aria-hidden="true"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span><span className="brand-text"><span>{content.copy.brandPrefix}</span>{content.copy.brandName}<span className="brand-period">.</span></span></a>;
}

function Header({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const c = content.copy;
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="site-header"><div className="header-inner"><Brand content={content} /><nav className="nav-links" aria-label={c.navAria}><a href="/#habitaciones">{c.navRooms}</a><a href="/#ubicaciones">{c.navLocations}</a><a href="/#experiencia">{c.navExperience}</a></nav>{content.contact.instagram ? <a className="header-instagram" href={content.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label={c.footerInstagram}><Icon name="instagram" /></a> : null}<a className="header-contact" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navContact}<Icon name="arrowUp" /></a><button type="button" className="mobile-toggle" aria-label={open ? c.closeMenu : c.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button></div>{open ? <nav id="mobile-navigation" className="mobile-menu" aria-label={c.mobileNavAria} onClick={(event) => { if ((event.target as Element).closest("a")) setOpen(false); }}><a href="/#habitaciones">{c.navRooms}<Icon name="arrowUp" /></a><a href="/#ubicaciones">{c.navLocations}<Icon name="arrowUp" /></a>{publishedLocations(content).map((location) => <a href={`/ubicaciones/${location.slug}#contenido`} className="mobile-location-link" key={location.id}>{location.name}<Icon name="pin" /></a>)}<a href="/#preguntas">{c.navFaq}<Icon name="arrowUp" /></a><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navWhatsapp}<Icon name="whatsapp" /></a></nav> : null}</header>;
}

export function VisitorStrip({ content }: { content: SiteContent }) {
  const countries = content.visitorCountries;
  if (!countries.length) return null;
  return <section className="visitor-strip visitor-strip--flags" aria-label={content.copy.visitorCountriesLabel}><div className="visitor-window"><div className="visitor-track"><ul>{countries.map((country) => <li key={country.code}><CountryFlag code={country.code} /><span className="sr-only">{country.name}</span></li>)}</ul><ul aria-hidden="true">{countries.map((country) => <li key={country.code}><CountryFlag code={country.code} /></li>)}</ul></div></div></section>;
}

function Payments({ content }: { content: SiteContent }) {
  const methods = content.paymentMethods.filter((method) => method.enabled);
  if (!methods.length) return null;
  return <section className="payments-section" aria-label={content.copy.paymentMethodsLabel}><div className="payments-copy"><h2>{content.copy.paymentMethodsLabel}</h2><p>{content.copy.paymentMethodsDescription}</p></div><div className="payments-methods"><ul aria-label={content.copy.paymentMethodsLabel}>{methods.map((method) => <li key={method.id}><PaymentMark id={method.id} label={method.label} /><span className="sr-only">{method.label}</span></li>)}</ul></div></section>;
}

function Footer({ content }: { content: SiteContent }) {
  const c = content.copy;
  return <footer className="site-footer section-shell"><Payments content={content} /><div className="footer-top"><div><Brand content={content} footer /><p>{content.site.tagline}</p></div><div className="footer-nav"><div><span>{c.footerDiscover}</span><a href="/#habitaciones">{c.footerRooms}</a>{publishedLocations(content).map((location) => <a href={`/ubicaciones/${location.slug}#contenido`} key={location.id}>{location.name}<Icon name="arrowUp" /></a>)}<a href="/#experiencia">{c.footerExperience}</a></div><div><span>{c.footerContact}</span><div className="footer-socials"><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" aria-label={c.footerWhatsapp}><Icon name="whatsapp" /></a>{content.contact.instagram ? <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label={c.footerInstagram}><Icon name="instagram" /></a> : null}</div>{content.contact.email ? <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a> : null}<div className="footer-location-maps">{publishedLocations(content).map((location) => <NeighborhoodMap location={location} copy={c} compact key={location.id} />)}</div></div></div></div><div className="footer-bottom"><span>{formatCopy(c.footerCopyright, { anio: new Date().getFullYear(), sitio: content.site.name })}</span><nav aria-label={c.legalNavAria}><a href="/politica-de-privacidad">{c.footerPrivacy}</a><a href="/terminos-y-condiciones">{c.footerTerms}</a><a href="/admin">{c.footerAdmin}<Icon name="arrowUp" /></a></nav><span className="footer-country">{c.footerCountry}<span>↗</span></span></div></footer>;
}

export function ContactBlock({ content }: { content: SiteContent }) {
  const c = content.copy;
  return <section className="contact-section section-shell" aria-labelledby="contact-title"><span className="contact-flower" aria-hidden="true">✳</span><div className="contact-heading reveal"><p className="eyebrow">{c.contactEyebrow}</p><h2 id="contact-title">{c.contactTitle}<br /><span>{c.contactTitleAccent}</span></h2></div><div className="contact-bottom reveal"><p>{c.contactDescription}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="button button-dark">{c.contactCta}<Icon name="whatsapp" /></a></div></section>;
}

export function SiteFrame({ content, children, locationPage = false }: { content: SiteContent; children: ReactNode; locationPage?: boolean }) {
  const siteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = siteRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!elements || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 });
    elements.forEach((element) => { if (element.getBoundingClientRect().top > innerHeight) element.classList.add("will-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <div className="site-shell" ref={siteRef}><a href="#contenido" className="skip-link">{content.copy.skipLink}</a><Header content={content} />{!locationPage ? <VisitorStrip content={content} /> : null}{children}<Footer content={content} /><a className="whatsapp-float" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" aria-label={formatCopy(content.copy.whatsappAria, { sitio: content.site.name })}><Icon name="whatsapp" /><span>{content.copy.floatingWhatsapp}</span></a></div>;
}
