"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PageCopy, Room, SiteContent } from "@/lib/types";
import { formatCopy } from "@/lib/copy";
import { BotanicalArtwork, RoomPlaceholder } from "./artwork";
import { Icon } from "./icons";

function whatsappUrl(content: SiteContent, room?: Room) {
  if (room?.whatsappUrl) return room.whatsappUrl;
  const phone = content.contact.whatsapp.replace(/\D/g, "");
  const message = room
    ? formatCopy(content.copy.roomWhatsappMessage, { habitacion: room.name, sitio: content.site.name })
    : content.contact.whatsappMessage;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function Brand({ content, footer = false }: { content: SiteContent; footer?: boolean }) {
  const c = content.copy;
  return <Link href="/#contenido" className={`brand${footer ? " brand--footer" : ""}`} aria-label={formatCopy(c.brandAria, { sitio: content.site.name })}>
    <span className="brand-symbol brand-symbol--official" aria-hidden="true"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span>
    <span className="brand-text"><span>{c.brandPrefix}</span>{c.brandName}<span className="brand-period">.</span></span>
  </Link>;
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
  return <header className="site-header">
    <div className="header-inner">
      <Brand content={content} />
      <nav className="nav-links" aria-label={c.navAria}><a href="#habitaciones">{c.navRooms}</a><a href="#experiencia">{c.navExperience}</a><a href="#ubicacion">{c.navLocation}</a></nav>
      <a className="header-contact" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navContact} <Icon name="arrowUp" /></a>
      <button type="button" className="mobile-toggle" aria-label={open ? c.closeMenu : c.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
    </div>
    {open ? <nav id="mobile-navigation" className="mobile-menu" aria-label={c.mobileNavAria} onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}><a href="#habitaciones">{c.navRooms} <Icon name="arrowUp" /></a><a href="#experiencia">{c.navExperience} <Icon name="arrowUp" /></a><a href="#ubicacion">{c.navLocation} <Icon name="arrowUp" /></a><a href="#preguntas">{c.navFaq} <Icon name="arrowUp" /></a><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.navWhatsapp} <Icon name="whatsapp" /></a></nav> : null}
  </header>;
}

function RoomCard({ room, index, content }: { room: Room; index: number; content: SiteContent }) {
  const [active, setActive] = useState(0);
  const c = content.copy;
  const total = room.photos.length;
  const photo = room.photos[active];
  const variables = { habitacion: room.name, sitio: content.site.name, foto: active + 1, total };
  const change = (offset: number) => setActive((current) => (current + offset + total) % total);
  return <article className="room-card reveal" data-room-id={room.id} data-room-name={room.name}>
    <div className="room-gallery" role="region" aria-roledescription={c.carouselAria} aria-label={formatCopy(c.galleryAria, variables)} tabIndex={0} onKeyDown={(event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
    }}>
      <div className="room-photo" aria-live="polite" aria-atomic="true">
        {photo?.url ? <Image key={photo.url} src={photo.url} alt={photo.alt || formatCopy(c.photoAlt, variables)} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" unoptimized /> : <RoomPlaceholder index={index + active} label={c.roomPlaceholder} />}
        <span className="sr-only">{formatCopy(c.photoCount, variables)}</span>
      </div>
      <span className="room-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="gallery-controls"><span aria-hidden="true">{String(active + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span></span><div><button type="button" onClick={() => change(-1)} aria-label={formatCopy(c.photoPrevious, variables)}><Icon name="chevron" className="reverse" /></button><button type="button" onClick={() => change(1)} aria-label={formatCopy(c.photoNext, variables)}><Icon name="chevron" /></button></div></div>
    </div>
    <div className="gallery-dots" aria-label={formatCopy(c.photoSelect, variables)}>{room.photos.map((_, photoIndex) => <button type="button" key={photoIndex} className={active === photoIndex ? "is-active" : ""} aria-label={formatCopy(c.photoView, { ...variables, foto: photoIndex + 1 })} aria-pressed={active === photoIndex} onClick={() => setActive(photoIndex)} />)}</div>
    <div className="room-content">
      <p className="room-tag">{room.tag}</p><h3>{room.name}</h3><p className="room-description">{room.description}</p><ul className="room-features">{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
      {room.bookingUrl || room.airbnbUrl ? <div className="room-platforms">
        {room.bookingUrl ? <a href={room.bookingUrl} target="_blank" rel="noopener noreferrer"><Icon name="booking" />{c.roomBookingLabel}</a> : null}
        {room.airbnbUrl ? <a href={room.airbnbUrl} target="_blank" rel="noopener noreferrer"><Icon name="airbnb" />{c.roomAirbnbLabel}</a> : null}
      </div> : null}
      <a className="room-contact" href={whatsappUrl(content, room)} target="_blank" rel="noopener noreferrer"><span className="room-contact-label"><Icon name="whatsapp" />{c.roomAvailabilityCta}</span><Icon name="arrowUp" /></a>
    </div>
  </article>;
}

function NeighborhoodMap({ content }: { content: SiteContent }) {
  const c = content.copy;
  return <a className="neighborhood-map" href={content.contact.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={formatCopy(c.mapAria, { sitio: content.site.name })}>
    <svg viewBox="0 0 700 580" fill="none" aria-hidden="true">
      <rect width="700" height="580" fill="#e9ebdc" />
      <g fill="#d4dcc3"><path d="M40 35h127v105H40zM202 35h162v105H202zM402 35h142v105H402zM582 35h117v105H582zM40 179h127v139H40zM202 179h162v139H202zM402 179h142v139H402zM582 179h117v139H582zM40 358h127v104H40zM202 358h162v104H202zM402 358h142v104H402zM582 358h117v104H582zM40 500h127v80H40zM202 500h162v80H202zM402 500h142v80H402zM582 500h117v80H582z" /></g>
      <g stroke="#f9f8ed" strokeWidth="28"><path d="M184 0v580M383 0v580M563 0v580M0 160h700M0 338h700M0 480h700" /><path d="M0 535 700 42" strokeWidth="37" /></g>
      <path d="M31 550 684 90" stroke="#bac99f" strokeWidth="13" strokeDasharray="3 10" />
      <g fill="#879675" fontFamily="inherit" fontSize="11" letterSpacing="1"><text x="39" y="151">{c.mapDistrict}</text><text x="425" y="329">{c.mapStreet}</text><text x="216" y="471">{c.mapNeighborhood}</text><text x="578" y="568" transform="rotate(-90 578 568)">{c.mapAvenue}</text></g>
      <g fill="#aebf94"><circle cx="80" cy="390" r="21" /><circle cx="111" cy="416" r="25" /><circle cx="67" cy="430" r="18" /><circle cx="458" cy="90" r="18" /><circle cx="490" cy="99" r="23" /></g>
      <circle cx="384" cy="287" r="73" fill="#233e2d" fillOpacity=".08" /><circle cx="384" cy="287" r="50" fill="#233e2d" fillOpacity=".1" />
      <path d="M408 275c0 17-24 38-24 38s-24-21-24-38a24 24 0 1 1 48 0Z" fill="#233e2d" /><circle cx="384" cy="274" r="8" fill="#f7f5e8" />
      <g><rect x="288" y="207" width="193" height="37" rx="18.5" fill="#233e2d" /><text x="384.5" y="231" fill="#f7f5e8" textAnchor="middle" fontFamily="inherit" fontSize="12" letterSpacing="2">{c.mapPin}</text></g>
    </svg>
    <span className="map-open">{c.mapOpen} <Icon name="arrowUp" /></span><span className="map-caption">{c.mapCaption}</span>
  </a>;
}

function amenityIcon(title: string): "wifi" | "sun" | "leaf" | "heart" {
  const label = title.toLowerCase();
  return label.includes("wifi") ? "wifi" : label.includes("terraza") ? "sun" : label.includes("barrio") ? "leaf" : "heart";
}

export default function Landing({ content }: { content: SiteContent }) {
  const siteRef = useRef<HTMLDivElement>(null);
  const c: PageCopy = content.copy;
  const rooms = content.rooms.filter((room) => room.published);
  const variables = { habitaciones: rooms.length, sitio: content.site.name, anio: new Date().getFullYear() };
  useEffect(() => {
    const elements = siteRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!elements || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    elements.forEach((element) => { if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add("will-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <div className="site-shell" ref={siteRef}>
    <a href="#contenido" className="skip-link">{c.skipLink}</a><Header content={content} />
    <main id="contenido">
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-eyebrow"><span className="status-dot" />{content.hero.eyebrow}<span className="hero-coordinate">{c.heroCoordinates}</span></div>
        <div className="hero-grid"><div className="hero-copy"><h1 id="hero-title"><span>{content.hero.title}</span>{" "}<span className="hero-title-accent">{content.hero.titleAccent}</span></h1><p className="hero-description">{formatCopy(content.hero.description, variables)}</p><div className="hero-actions"><a href="#habitaciones" className="button button-dark">{c.heroPrimaryCta} <Icon name="arrow" /></a><a className="hero-text-link" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.heroSecondaryCta} <Icon name="whatsapp" /></a></div><div className="hero-meta"><span className="hero-meta-line" /><p>{c.heroMetaLine}<br /><strong>{c.heroMetaStrong}</strong></p></div></div>
          <div className="hero-art"><div className="hero-art-stage"><span className="art-kicker">{c.heroArtKicker}</span><BotanicalArtwork /><span className="art-caption">{c.heroArtCaption}</span></div><div className="hero-stamp" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="stamp-text" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" /></defs><text><textPath href="#stamp-text" textLength="265">{c.heroStamp}</textPath></text></svg><span className="hero-seal brand-symbol--official"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span></div><span className="art-note"><span aria-hidden="true">01 /</span>{c.heroArtNote}</span></div>
        </div>
        <div className="hero-bottom"><a href="#ubicacion"><Icon name="pin" />{content.contact.address}, {content.contact.city}</a><a href="#habitaciones" className="scroll-cue">{c.heroScroll} <span>↓</span></a></div>
      </section>

      <div className="welcome-strip" aria-label={c.bannerAria}><div><span>{c.bannerOne}</span><i aria-hidden="true">✳</i><span>{c.bannerTwo}</span><i aria-hidden="true">✳</i><span>{c.bannerThree}</span><i aria-hidden="true">✳</i><span>{c.bannerFour}</span><i aria-hidden="true">✳</i></div></div>

      <section id="habitaciones" className="rooms-section section-shell section-space" aria-labelledby="rooms-title"><div className="section-label reveal"><span>{c.roomsLabel}</span><span>{formatCopy(c.roomsNote, variables)}</span></div><div className="section-heading reveal"><h2 id="rooms-title">{c.roomsTitle}<br /><span>{c.roomsTitleAccent}</span></h2><p>{formatCopy(c.roomsIntro, variables)}</p></div><div className={`room-grid room-grid--${Math.min(rooms.length, 3)}`}>{rooms.length ? rooms.map((room, index) => <RoomCard room={room} index={index} content={content} key={room.id} />) : <p className="rooms-empty">{c.roomsEmpty}</p>}</div><div className="rooms-footnote reveal"><Icon name="heart" /><p>{c.roomsHelpText}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.roomsHelpLink} <Icon name="arrowUp" /></a></div></section>

      <section id="experiencia" className="experience-section section-shell section-space" aria-labelledby="experience-title"><div className="section-label reveal"><span>{c.experienceLabel}</span><span>{c.experienceNote}</span></div><div className="experience-heading reveal"><span className="experience-flower" aria-hidden="true">✳</span><div><h2 id="experience-title">{content.about.title}</h2><p>{formatCopy(content.about.text, variables)}</p></div></div><div className="experience-grid">{content.amenities.map((amenity, index) => <div className="experience-item reveal" key={amenity.title}><Icon name={amenityIcon(amenity.title)} /><span className="experience-number">{String(index + 1).padStart(2, "0")}</span><h3>{amenity.title}</h3><p>{amenity.description}</p></div>)}</div></section>

      <section id="ubicacion" className="location-section section-shell section-space" aria-labelledby="location-title"><div className="section-label reveal"><span>{c.locationLabel}</span><span>{c.locationNote}</span></div><div className="location-layout"><div className="location-copy reveal"><p className="eyebrow">{c.locationEyebrow}</p><h2 id="location-title">{content.location.title}</h2><p className="location-description">{content.location.description}</p><ul className="location-highlights">{content.location.highlights.map((highlight, index) => <li key={highlight}><span>{String(index + 1).padStart(2, "0")}</span>{highlight}<Icon name="arrowUp" /></li>)}</ul><div className="location-address"><Icon name="pin" /><div><strong>{content.contact.address}</strong><span>{content.contact.city}, {content.contact.region}, {content.contact.country}</span></div></div><a href={content.contact.mapUrl} className="text-link" target="_blank" rel="noopener noreferrer">{c.locationDirections} <Icon name="arrowUp" /></a></div><div className="location-visual reveal"><NeighborhoodMap content={content} /><div className="neighborhood-tag"><span>{c.locationTagline}</span><Icon name="leaf" /></div></div></div></section>

      <section id="preguntas" className="faq-section section-shell section-space" aria-labelledby="faq-title"><div className="section-label reveal"><span>{c.faqLabel}</span><span>{c.faqNote}</span></div><div className="faq-grid"><div className="faq-intro reveal"><h2 id="faq-title">{c.faqTitle}<br /><span>{c.faqTitleAccent}</span></h2><p>{c.faqIntro}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="text-link">{c.faqCta} <Icon name="arrowUp" /></a></div><div className="faq-list reveal">{content.faq.map((item, index) => <details key={item.question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><Icon name="plus" /></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></div></section>

      <section className="contact-section section-shell" aria-labelledby="contact-title"><span className="contact-flower" aria-hidden="true">✳</span><div className="contact-heading reveal"><p className="eyebrow">{c.contactEyebrow}</p><h2 id="contact-title">{c.contactTitle}<br /><span>{c.contactTitleAccent}</span></h2></div><div className="contact-bottom reveal"><p>{c.contactDescription}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="button button-dark">{c.contactCta} <Icon name="whatsapp" /></a></div></section>
    </main>
    <footer className="site-footer section-shell"><div className="footer-top"><div><Brand content={content} footer /><p>{content.site.tagline}</p></div><div className="footer-nav"><div><span>{c.footerDiscover}</span><a href="#habitaciones">{c.footerRooms}</a><a href="#experiencia">{c.footerExperience}</a><a href="#ubicacion">{c.footerLocation}</a></div><div><span>{c.footerContact}</span><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.footerWhatsapp} <Icon name="arrowUp" /></a>{content.contact.instagram ? <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer">{c.footerInstagram} <Icon name="arrowUp" /></a> : null}{content.contact.email ? <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a> : null}<p>{content.contact.address}<br />{content.contact.city}, {content.contact.country}</p></div></div></div><div className="footer-bottom"><span>{formatCopy(c.footerCopyright, variables)}</span><nav aria-label={c.legalNavAria}><Link href="/politica-de-privacidad">{c.footerPrivacy}</Link><Link href="/terminos-y-condiciones">{c.footerTerms}</Link><a href="/admin">{c.footerAdmin} <Icon name="arrowUp" /></a></nav><span className="footer-country">{c.footerCountry} <span>↗</span></span></div></footer>
    <a className="whatsapp-float" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" aria-label={formatCopy(c.whatsappAria, variables)}><Icon name="whatsapp" /><span>{c.floatingWhatsapp}</span></a>
  </div>;
}
