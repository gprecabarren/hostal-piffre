"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { formatCopy } from "@/lib/copy";
import type { SiteContent } from "@/lib/types";
import { CountryFlag, PaymentMark } from "./brand-marks";
import { Icon } from "./icons";
import { publishedLocations, whatsappUrl } from "./content-helpers";

export function Brand({ content, footer = false }: { content: SiteContent; footer?: boolean }) {
  return <Link href="/#contenido" className={`brand${footer ? " brand--footer" : ""}`} aria-label={formatCopy(content.copy.brandAria, { sitio: content.site.name })}><span className="brand-symbol brand-symbol--official" aria-hidden="true"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span><span className="brand-text"><span>{content.copy.brandPrefix}</span>{content.copy.brandName}<span className="brand-period">.</span></span></Link>;
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
  return <header className="site-header"><div className="header-inner"><Brand content={content} /><nav className="nav-links" aria-label={c.navAria}><Link href="/#habitaciones">{c.navRooms}</Link><Link href="/#ubicaciones">{c.navLocations}</Link><Link href="/#experiencia">{c.navExperience}</Link></nav><a className="header-contact" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navContact}<Icon name="arrowUp" /></a><button type="button" className="mobile-toggle" aria-label={open ? c.closeMenu : c.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button></div>{open ? <nav id="mobile-navigation" className="mobile-menu" aria-label={c.mobileNavAria} onClick={(event) => { if ((event.target as Element).closest("a")) setOpen(false); }}><Link href="/#habitaciones">{c.navRooms}<Icon name="arrowUp" /></Link><Link href="/#ubicaciones">{c.navLocations}<Icon name="arrowUp" /></Link>{publishedLocations(content).map((location) => <Link href={`/ubicaciones/${location.slug}`} className="mobile-location-link" key={location.id}>{location.name}<Icon name="pin" /></Link>)}<Link href="/#preguntas">{c.navFaq}<Icon name="arrowUp" /></Link><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navWhatsapp}<Icon name="whatsapp" /></a></nav> : null}</header>;
}

export function VisitorStrip({ content }: { content: SiteContent }) {
  const [paused, setPaused] = useState(false);
  const countries = content.visitorCountries;
  if (!countries.length) return null;
  return <section className={`visitor-strip${paused ? " is-paused" : ""}`} aria-label={content.copy.visitorCountriesLabel}><p><Icon name="globe" />{content.copy.visitorCountriesLabel}</p><div className="visitor-window"><div className="visitor-track"><ul>{countries.map((country) => <li key={country.code}><CountryFlag code={country.code} /><span>{country.name}</span></li>)}</ul><ul aria-hidden="true">{countries.map((country) => <li key={country.code}><CountryFlag code={country.code} /><span>{country.name}</span></li>)}</ul></div></div><button type="button" className="visitor-pause" aria-pressed={paused} aria-label={paused ? content.copy.visitorPlay : content.copy.visitorPause} onClick={() => setPaused(!paused)}><Icon name={paused ? "play" : "pause"} /></button></section>;
}

function Payments({ content }: { content: SiteContent }) {
  const rail = useRef<HTMLUListElement>(null);
  const methods = content.paymentMethods.filter((method) => method.enabled);
  if (!methods.length) return null;
  const scroll = (direction: number) => rail.current?.scrollBy({ left: direction * 240, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  return <section className="payments-section" aria-label={content.copy.paymentMethodsLabel}><div className="payments-copy"><h2>{content.copy.paymentMethodsLabel}</h2><p>{content.copy.paymentMethodsDescription}</p></div><div className="payments-carousel"><button type="button" onClick={() => scroll(-1)} aria-label={content.copy.paymentPrevious}><Icon name="chevron" className="reverse" /></button><ul ref={rail}>{methods.map((method) => <li key={method.id}><PaymentMark id={method.id} label={method.label} /><span>{method.label}</span></li>)}</ul><button type="button" onClick={() => scroll(1)} aria-label={content.copy.paymentNext}><Icon name="chevron" /></button></div></section>;
}

function Footer({ content }: { content: SiteContent }) {
  const c = content.copy;
  return <footer className="site-footer section-shell"><Payments content={content} /><div className="footer-top"><div><Brand content={content} footer /><p>{content.site.tagline}</p></div><div className="footer-nav"><div><span>{c.footerDiscover}</span><Link href="/#habitaciones">{c.footerRooms}</Link>{publishedLocations(content).map((location) => <Link href={`/ubicaciones/${location.slug}`} key={location.id}>{location.name}<Icon name="arrowUp" /></Link>)}<Link href="/#experiencia">{c.footerExperience}</Link></div><div><span>{c.footerContact}</span><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.footerWhatsapp}<Icon name="arrowUp" /></a>{content.contact.instagram ? <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer">{c.footerInstagram}<Icon name="arrowUp" /></a> : null}{content.contact.email ? <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a> : null}{publishedLocations(content).map((location) => <p className="footer-location" key={location.id}><strong>{location.name}</strong><br />{location.address}</p>)}</div></div></div><div className="footer-bottom"><span>{formatCopy(c.footerCopyright, { anio: new Date().getFullYear(), sitio: content.site.name })}</span><nav aria-label={c.legalNavAria}><Link href="/politica-de-privacidad">{c.footerPrivacy}</Link><Link href="/terminos-y-condiciones">{c.footerTerms}</Link><a href="/admin">{c.footerAdmin}<Icon name="arrowUp" /></a></nav><span className="footer-country">{c.footerCountry}<span>↗</span></span></div></footer>;
}

export function ContactBlock({ content }: { content: SiteContent }) {
  const c = content.copy;
  return <section className="contact-section section-shell" aria-labelledby="contact-title"><span className="contact-flower" aria-hidden="true">✳</span><div className="contact-heading reveal"><p className="eyebrow">{c.contactEyebrow}</p><h2 id="contact-title">{c.contactTitle}<br /><span>{c.contactTitleAccent}</span></h2></div><div className="contact-bottom reveal"><p>{c.contactDescription}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="button button-dark">{c.contactCta}<Icon name="whatsapp" /></a></div></section>;
}

export function SiteFrame({ content, children }: { content: SiteContent; children: ReactNode }) {
  const siteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = siteRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!elements || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .08 });
    elements.forEach((element) => { if (element.getBoundingClientRect().top > innerHeight) element.classList.add("will-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <div className="site-shell" ref={siteRef}><a href="#contenido" className="skip-link">{content.copy.skipLink}</a><Header content={content} /><VisitorStrip content={content} />{children}<Footer content={content} /><a className="whatsapp-float" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" aria-label={formatCopy(content.copy.whatsappAria, { sitio: content.site.name })}><Icon name="whatsapp" /><span>{content.copy.floatingWhatsapp}</span></a></div>;
}
