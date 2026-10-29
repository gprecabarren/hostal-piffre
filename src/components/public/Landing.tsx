"use client";

import Image from "next/image";
import { formatCopy } from "@/lib/copy";
import type { Location, SiteContent } from "@/lib/types";
import { RoomPlaceholder } from "./artwork";
import { Icon } from "./icons";
import RoomCard from "./RoomCard";
import { ContactBlock, SiteFrame } from "./SiteChrome";
import { locationPhotos, publishedLocations, whatsappUrl } from "./content-helpers";

function HeroCollage({ content, locations }: { content: SiteContent; locations: Location[] }) {
  const main = locations.find((location) => location.slug === "santiago-centro") || locations[0];
  const secondary = locations.find((location) => location.slug === "providencia") || locations[1];
  const apartment = content.rooms.find((room) => room.published && room.kind === "apartment");
  const mainPhoto = apartment?.photos.filter((photo) => photo.url)[1] || (main ? locationPhotos(content, main)[0] : undefined);
  const room = content.rooms.find((property) => property.published && property.kind === "room");
  const secondaryPhoto = room?.photos.find((photo) => photo.url) || (secondary ? locationPhotos(content, secondary)[0] : undefined);
  return <div className="hero-photo-collage"><figure className="hero-photo-main">{mainPhoto ? <Image src={mainPhoto.url} alt={mainPhoto.alt} fill sizes="(max-width:650px) 88vw,45vw" unoptimized preload /> : <RoomPlaceholder index={0} label="" />}</figure>{secondary ? <figure className="hero-photo-secondary">{secondaryPhoto ? <Image src={secondaryPhoto.url} alt={secondaryPhoto.alt} fill sizes="(max-width:650px) 44vw,22vw" unoptimized /> : <RoomPlaceholder index={1} label="" />}</figure> : null}</div>;
}

export default function Landing({ content }: { content: SiteContent }) {
  const c = content.copy;
  const locations = publishedLocations(content);
  const rooms = content.rooms.filter((room) => room.published && locations.some((location) => location.id === room.locationId));
  const variables = { habitaciones: rooms.length, ubicaciones: locations.length, sitio: content.site.name };
  return <SiteFrame content={content}><main id="contenido">
    <section className="hero hero--photographic section-shell" aria-labelledby="hero-title"><div className="hero-eyebrow"><span className="status-dot" />{content.hero.eyebrow}</div><div className="hero-grid"><div className="hero-copy"><h1 id="hero-title"><span>{content.hero.title}</span>{" "}<span className="hero-title-accent">{content.hero.titleAccent}</span></h1><p className="hero-description">{formatCopy(content.hero.description, variables)}</p><div className="hero-actions"><a href="#habitaciones" className="button button-dark">{c.heroPrimaryCta}<Icon name="arrow" /></a><a href="#ubicaciones" className="hero-text-link">{c.navLocations}<Icon name="pin" /></a></div><div className="hero-meta"><span className="hero-meta-line" /><p>{c.heroMetaLine}<br /><strong>{c.heroMetaStrong}</strong></p></div></div><HeroCollage content={content} locations={locations} /></div></section>

    <section id="habitaciones" className="rooms-section section-shell section-space" aria-labelledby="rooms-title"><div className="section-label reveal"><span>{c.roomsLabel}</span><span>{formatCopy(c.roomsNote, variables)}</span></div><div className="section-heading reveal"><h2 id="rooms-title">{c.roomsTitle}<br /><span>{c.roomsTitleAccent}</span></h2><p>{formatCopy(c.roomsIntro, variables)}</p></div><div id="ubicaciones" className="property-groups">{locations.map((location) => {
      const properties = rooms.filter((room) => room.locationId === location.id);
      if (!properties.length) return null;
      return <section className="property-group" key={location.id} aria-labelledby={`group-${location.id}`}><div className="property-group-heading reveal"><div><p className="eyebrow">{properties.every((room) => room.kind === "apartment") ? c.roomsGroupApartments : c.roomsGroupRooms}</p><h3 id={`group-${location.id}`}><Icon name="pin" />{location.name}</h3><p>{location.address}</p></div><a href={`/ubicaciones/${location.slug}#contenido`} className="location-details-link">{c.locationCardCta}<span className="sr-only">: {location.name}</span><Icon name="arrowDown" /></a></div><div className={`room-grid room-grid--${Math.min(properties.length, 3)}`}>{properties.map((room, index) => <RoomCard room={room} index={index} content={content} key={room.id} />)}</div></section>;
    })}{!rooms.length ? <p className="rooms-empty">{c.roomsEmpty}</p> : null}</div><div className="rooms-footnote reveal"><Icon name="heart" /><p>{c.roomsHelpText}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer">{c.roomsHelpLink}<Icon name="arrowUp" /></a></div></section>

    <section id="experiencia" className="experience-section section-shell section-space" aria-labelledby="experience-title"><div className="section-label reveal"><span>{c.experienceLabel}</span><span>{c.experienceNote}</span></div><div className="experience-heading reveal"><span className="experience-flower" aria-hidden="true">✳</span><div><h2 id="experience-title">{content.about.title}</h2><p>{formatCopy(content.about.text, variables)}</p></div></div><div className="experience-grid">{content.amenities.map((amenity, index) => <div className="experience-item reveal" key={amenity.title}><Icon name={/lavander/i.test(amenity.title) ? "washer" : /wifi/i.test(amenity.title) ? "wifi" : /terraza/i.test(amenity.title) ? "sun" : "heart"} /><span className="experience-number">{String(index + 1).padStart(2, "0")}</span><h3>{amenity.title}</h3><p>{amenity.description}</p></div>)}</div></section>

    <section id="preguntas" className="faq-section section-shell section-space" aria-labelledby="faq-title"><div className="section-label reveal"><span>{c.faqLabel}</span><span>{c.faqNote}</span></div><div className="faq-grid"><div className="faq-intro reveal"><h2 id="faq-title">{c.faqTitle}<br /><span>{c.faqTitleAccent}</span></h2><p>{c.faqIntro}</p><a href={whatsappUrl(content)} target="_blank" rel="noopener noreferrer" className="text-link">{c.faqCta}<Icon name="arrowUp" /></a></div><div className="faq-list reveal">{content.faq.map((item, index) => <details key={item.question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><Icon name="plus" /></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></div></section>
    <ContactBlock content={content} />
  </main></SiteFrame>;
}
