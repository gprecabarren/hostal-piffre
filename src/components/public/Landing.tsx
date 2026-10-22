"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Room, SiteContent } from "@/lib/types";
import { BotanicalArtwork, RoomPlaceholder } from "./artwork";
import { Icon } from "./icons";

function whatsappUrl(content: SiteContent, roomName?: string) {
  const phone = content.contact.whatsapp.replace(/\D/g, "") || "56954933261";
  const message = roomName ? `Hola, me gustaría consultar disponibilidad para ${roomName} en Hostal Piffre.` : content.contact.whatsappMessage;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`brand${footer ? " brand--footer" : ""}`} aria-label="Hostal Piffre, inicio">
    <span className="brand-symbol brand-symbol--official" aria-hidden="true"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span>
    <span className="brand-text"><span>HOSTAL</span>Piffre<span className="brand-period">.</span></span>
  </Link>;
}

function Header({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="site-header">
    <div className="header-inner">
      <Brand />
      <nav className="nav-links" aria-label="Navegación principal"><a href="#habitaciones">Habitaciones</a><a href="#experiencia">La experiencia</a><a href="#ubicacion">Ubicación</a></nav>
      <a className="header-contact" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">Hablemos <Icon name="arrowUp" /></a>
      <button type="button" className="mobile-toggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
    </div>
    {open ? <nav id="mobile-navigation" className="mobile-menu" aria-label="Navegación móvil" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}><a href="#habitaciones">Habitaciones <Icon name="arrowUp" /></a><a href="#experiencia">La experiencia <Icon name="arrowUp" /></a><a href="#ubicacion">Ubicación <Icon name="arrowUp" /></a><a href="#preguntas">Preguntas frecuentes <Icon name="arrowUp" /></a><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp <Icon name="whatsapp" /></a></nav> : null}
  </header>;
}

function RoomCard({ room, index, content }: { room: Room; index: number; content: SiteContent }) {
  const [active, setActive] = useState(0);
  const photo = room.photos[active];
  const change = (offset: number) => setActive((current) => (current + offset + 3) % 3);
  return <article className="room-card reveal">
    <div className="room-gallery" role="region" aria-roledescription="carrusel" aria-label={`Fotografías de ${room.name}`} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); } if (event.key === "ArrowRight") { event.preventDefault(); change(1); } }}>
      <div className="room-photo" aria-live="polite" aria-atomic="true">
        {photo?.url ? <Image key={photo.url} src={photo.url} alt={photo.alt || `${room.name}, fotografía ${active + 1}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" unoptimized /> : <RoomPlaceholder index={index + active} />}
        <span className="sr-only">Imagen {active + 1} de 3</span>
      </div>
      <span className="room-number" aria-hidden="true">0{index + 1}</span>
      <div className="gallery-controls"><span aria-hidden="true">0{active + 1} <span>/ 03</span></span><div><button type="button" onClick={() => change(-1)} aria-label={`Fotografía anterior de ${room.name}`}><Icon name="chevron" className="reverse" /></button><button type="button" onClick={() => change(1)} aria-label={`Fotografía siguiente de ${room.name}`}><Icon name="chevron" /></button></div></div>
    </div>
    <div className="gallery-dots" aria-label={`Seleccionar fotografía de ${room.name}`}>{room.photos.map((_, photoIndex) => <button type="button" key={photoIndex} className={active === photoIndex ? "is-active" : ""} aria-label={`Ver fotografía ${photoIndex + 1}`} aria-pressed={active === photoIndex} onClick={() => setActive(photoIndex)} />)}</div>
    <div className="room-content"><p className="room-tag">{room.tag}</p><h3>{room.name}</h3><p className="room-description">{room.description}</p><ul className="room-features">{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
      {room.bookingUrl || room.airbnbUrl ? <div className="room-platforms">{room.bookingUrl ? <a href={room.bookingUrl} target="_blank" rel="noopener noreferrer">Booking.com <Icon name="arrowUp" /></a> : null}{room.airbnbUrl ? <a href={room.airbnbUrl} target="_blank" rel="noopener noreferrer">Airbnb <Icon name="arrowUp" /></a> : null}</div> : null}
      <a className="room-contact" href={whatsappUrl(content, room.name)} target="_blank" rel="noopener noreferrer">Consultar disponibilidad <Icon name="arrowUp" /></a>
    </div>
  </article>;
}

function NeighborhoodMap({ mapUrl }: { mapUrl: string }) {
  return <a className="neighborhood-map" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver Hostal Piffre en Google Maps">
    <svg viewBox="0 0 700 580" fill="none" aria-hidden="true">
      <rect width="700" height="580" fill="#e9ebdc" />
      <g fill="#d4dcc3"><path d="M40 35h127v105H40zM202 35h162v105H202zM402 35h142v105H402zM582 35h117v105H582zM40 179h127v139H40zM202 179h162v139H202zM402 179h142v139H402zM582 179h117v139H582zM40 358h127v104H40zM202 358h162v104H202zM402 358h142v104H402zM582 358h117v104H582zM40 500h127v80H40zM202 500h162v80H202zM402 500h142v80H402zM582 500h117v80H582z" /></g>
      <g stroke="#f9f8ed" strokeWidth="28"><path d="M184 0v580M383 0v580M563 0v580M0 160h700M0 338h700M0 480h700" /><path d="M0 535 700 42" strokeWidth="37" /></g>
      <path d="M31 550 684 90" stroke="#bac99f" strokeWidth="13" strokeDasharray="3 10" />
      <g fill="#879675" fontFamily="inherit" fontSize="11" letterSpacing="1"><text x="39" y="151">PROVIDENCIA</text><text x="425" y="329">LOS CAPITANES</text><text x="216" y="471">BARRIO ITALIA</text><text x="578" y="568" transform="rotate(-90 578 568)">AV. PEDRO DE VALDIVIA</text></g>
      <g fill="#aebf94"><circle cx="80" cy="390" r="21" /><circle cx="111" cy="416" r="25" /><circle cx="67" cy="430" r="18" /><circle cx="458" cy="90" r="18" /><circle cx="490" cy="99" r="23" /></g>
      <circle cx="384" cy="287" r="73" fill="#233e2d" fillOpacity=".08" /><circle cx="384" cy="287" r="50" fill="#233e2d" fillOpacity=".1" />
      <path d="M408 275c0 17-24 38-24 38s-24-21-24-38a24 24 0 1 1 48 0Z" fill="#233e2d" /><circle cx="384" cy="274" r="8" fill="#f7f5e8" />
      <g><rect x="288" y="207" width="193" height="37" rx="18.5" fill="#233e2d" /><text x="384.5" y="231" fill="#f7f5e8" textAnchor="middle" fontFamily="inherit" fontSize="12" letterSpacing="2">ESTÁS EN PIFFRE</text></g>
    </svg>
    <span className="map-open">Abrir en Google Maps <Icon name="arrowUp" /></span><span className="map-caption">Mapa ilustrativo del barrio</span>
  </a>;
}

export default function Landing({ content }: { content: SiteContent }) {
  const siteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = siteRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!elements || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    elements.forEach((element) => { if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add("will-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  const amenityIcon = (title: string): "wifi" | "sun" | "leaf" | "heart" => {
    const label = title.toLowerCase();
    return label.includes("wifi") ? "wifi" : label.includes("terraza") ? "sun" : label.includes("barrio") ? "leaf" : "heart";
  };
  return <div className="site-shell" ref={siteRef}>
    <a href="#contenido" className="skip-link">Ir al contenido principal</a>
    <Header content={content} />
    <main id="contenido">
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-eyebrow"><span className="status-dot" />{content.hero.eyebrow}<span className="hero-coordinate">33°26′ S · 70°36′ O</span></div>
        <div className="hero-grid"><div className="hero-copy"><h1 id="hero-title"><span>{content.hero.title}</span>{" "}<span className="hero-title-accent">{content.hero.titleAccent}</span></h1><p className="hero-description">{content.hero.description}</p><div className="hero-actions"><a href="#habitaciones" className="button button-dark">Encuentra tu habitación <Icon name="arrow" /></a><a className="hero-text-link" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">Conversemos <Icon name="whatsapp" /></a></div><div className="hero-meta"><span className="hero-meta-line" /><p>Un lugar sencillo.<br /><strong>Una bienvenida de verdad.</strong></p></div></div>
          <div className="hero-art"><div className="hero-art-stage"><span className="art-kicker">BIENVENIDO A PROVIDENCIA</span><BotanicalArtwork /><span className="art-caption">Una casa. Muchas historias.</span></div><div className="hero-stamp" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="stamp-text" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" /></defs><text><textPath href="#stamp-text" textLength="265">TU HOGAR LEJOS DE CASA · PIFFRE · </textPath></text></svg><span className="hero-seal brand-symbol--official"><Image src="/brand/logo.webp" width={720} height={906} alt="" /></span></div><span className="art-note"><span>01 /</span> Una ilustración para recibirte.<br />Las fotografías reales llegarán pronto.</span></div>
        </div>
        <div className="hero-bottom"><a href="#ubicacion"><Icon name="pin" />{content.contact.address}, {content.contact.city}</a><a href="#habitaciones" className="scroll-cue">Haz espacio para una pausa <span>↓</span></a></div>
      </section>

      <div className="welcome-strip" aria-label="Descansa, explora y siéntete en casa"><div><span>Descansa.</span><i>✳</i><span>Explora.</span><i>✳</i><span>Siéntete en casa.</span><i>✳</i><span>Esto es Piffre.</span><i>✳</i></div></div>

      <section id="habitaciones" className="rooms-section section-shell section-space" aria-labelledby="rooms-title"><div className="section-label reveal"><span>01 / TU PRÓXIMA ESTADÍA</span><span>TRES HABITACIONES, UNA BIENVENIDA</span></div><div className="section-heading reveal"><h2 id="rooms-title">Un lugar para<br /><span>bajar el ritmo.</span></h2><p>Tres espacios con el espíritu de Piffre. Elige el tuyo y conversemos sobre tus fechas.</p></div><div className="room-grid">{content.rooms.map((room, index) => <RoomCard room={room} index={index} content={content} key={room.id} />)}</div><div className="rooms-footnote reveal"><Icon name="heart" /><p>¿No sabes cuál elegir? Cuéntanos cómo será tu viaje y te ayudamos a encontrar tu espacio.</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">Te ayudamos por WhatsApp <Icon name="arrowUp" /></a></div></section>

      <section id="experiencia" className="experience-section section-shell section-space" aria-labelledby="experience-title"><div className="section-label reveal"><span>02 / LA EXPERIENCIA PIFFRE</span><span>LO SIMPLE, BIEN HECHO</span></div><div className="experience-heading reveal"><span className="experience-flower" aria-hidden="true">✳</span><div><h2 id="experience-title">{content.about.title}</h2><p>{content.about.text}</p></div></div><div className="experience-grid">{content.amenities.map((amenity, index) => <div className="experience-item reveal" key={amenity.title}><Icon name={amenityIcon(amenity.title)} /><span className="experience-number">0{index + 1}</span><h3>{amenity.title}</h3><p>{amenity.description}</p></div>)}</div></section>

      <section id="ubicacion" className="location-section section-shell section-space" aria-labelledby="location-title"><div className="section-label reveal"><span>03 / EL BARRIO TAMBIÉN ES PARTE</span><span>PROVIDENCIA, SANTIAGO DE CHILE</span></div><div className="location-layout"><div className="location-copy reveal"><p className="eyebrow">TU PUNTO DE PARTIDA</p><h2 id="location-title">{content.location.title}</h2><p className="location-description">{content.location.description}</p><ul className="location-highlights">{content.location.highlights.map((highlight, index) => <li key={highlight}><span>0{index + 1}</span>{highlight}<Icon name="arrowUp" /></li>)}</ul><div className="location-address"><Icon name="pin" /><div><strong>{content.contact.address}</strong><span>{content.contact.city}, {content.contact.region}, {content.contact.country}</span></div></div><a href={content.contact.mapUrl} className="text-link" target="_blank" rel="noopener noreferrer">Cómo llegar <Icon name="arrowUp" /></a></div><div className="location-visual reveal"><NeighborhoodMap mapUrl={content.contact.mapUrl} /><div className="neighborhood-tag"><span>Un barrio para caminar.<br />Una casa para volver.</span><Icon name="leaf" /></div></div></div></section>

      <section id="preguntas" className="faq-section section-shell section-space" aria-labelledby="faq-title"><div className="section-label reveal"><span>04 / ANTES DE HACER LAS MALETAS</span><span>HABLEMOS CON CONFIANZA</span></div><div className="faq-grid"><div className="faq-intro reveal"><h2 id="faq-title">Las pequeñas<br /><span>grandes dudas.</span></h2><p>Lo que necesitas saber antes de llegar. Si te queda alguna pregunta, estamos al otro lado del WhatsApp.</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="text-link">Pregúntanos directamente <Icon name="arrowUp" /></a></div><div className="faq-list reveal">{content.faq.map((item, index) => <details key={item.question}><summary><span className="faq-number">0{index + 1}</span><span>{item.question}</span><Icon name="plus" /></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></div></section>

      <section className="contact-section section-shell" aria-labelledby="contact-title"><span className="contact-flower" aria-hidden="true">✳</span><div className="contact-heading reveal"><p className="eyebrow">TU PRÓXIMA HISTORIA EMPIEZA AQUÍ</p><h2 id="contact-title">Santiago te espera.<br /><span>Nosotros también.</span></h2></div><div className="contact-bottom reveal"><p>Cuéntanos tus fechas.<br />La bienvenida la ponemos nosotros.</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="button button-dark">Hablemos por WhatsApp <Icon name="whatsapp" /></a></div></section>
    </main>
    <footer className="site-footer section-shell"><div className="footer-top"><div><Brand footer /><p>{content.site.tagline}</p></div><div className="footer-nav"><div><span>DESCUBRE PIFFRE</span><a href="#habitaciones">Nuestras habitaciones</a><a href="#experiencia">La experiencia</a><a href="#ubicacion">El barrio</a></div><div><span>ESTEMOS EN CONTACTO</span><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">WhatsApp <Icon name="arrowUp" /></a>{content.contact.instagram ? <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram <Icon name="arrowUp" /></a> : null}{content.contact.email ? <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a> : null}<p>{content.contact.address}<br />{content.contact.city}, {content.contact.country}</p></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {content.site.name}. Hecho para recibirte.</span><nav aria-label="Información legal"><Link href="/politica-de-privacidad">Privacidad</Link><Link href="/terminos-y-condiciones">Términos y condiciones</Link><Link href="/admin">Administración <Icon name="arrowUp" /></Link></nav><span className="footer-country">CHILE <span>↗</span></span></div></footer>
    <a className="whatsapp-float" href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" aria-label="Hablar con Hostal Piffre por WhatsApp"><Icon name="whatsapp" /><span>¿Hablamos?</span></a>
  </div>;
}
