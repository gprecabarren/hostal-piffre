"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCopy } from "@/lib/copy";
import type { Location, SiteContent } from "@/lib/types";
import { Icon } from "./icons";
import { RoomPlaceholder } from "./artwork";
import PhotoLightbox from "./PhotoLightbox";
import RoomCard from "./RoomCard";
import { ContactBlock, SiteFrame } from "./SiteChrome";
import { locationPhotos, publishedLocations, whatsappUrl } from "./content-helpers";

export default function LocationPage({ content, location }: { content: SiteContent; location: Location }) {
  const c = content.copy;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const openGallery = (index = 0) => { setGalleryIndex(index); setGalleryOpen(true); };
  const rooms = content.rooms.filter((room) => room.published && room.locationId === location.id);
  const commonPhotos = locationPhotos(content, location);
  const roomCovers = rooms.flatMap((room) => room.photos.filter((photo) => photo.url).slice(0, 1));
  const photos = [...roomCovers, ...commonPhotos].filter((photo, index, list) => list.findIndex((item) => item.url === photo.url) === index);
  const variables = { habitaciones: rooms.length, ubicacion: location.name, sitio: content.site.name };
  return <SiteFrame content={content} locationPage><main id="contenido" className="location-page">
    <section className="place-hero section-shell"><nav className="place-breadcrumb" aria-label={c.navLocations}><Link href="/#ubicaciones" className="place-back"><Icon name="arrow" className="reverse" />{c.locationBack}</Link><span aria-hidden="true">/</span><span aria-current="page">{location.name}</span></nav><div className="place-hero-grid"><div className="place-hero-copy"><p className="eyebrow">{location.eyebrow}</p><h1>{location.title}{" "}<span>{location.titleAccent}</span></h1><p>{location.description}</p><div className="place-address"><Icon name="pin" /><span>{location.address}<br />{location.city}, {location.country}</span></div><a href={whatsappUrl(content, undefined, location)} className="button button-dark" target="_blank" rel="noopener noreferrer">{c.locationContactCta}<Icon name="whatsapp" /></a></div><div className="place-photo-grid">{photos.slice(0, 3).map((photo, index) => <button type="button" key={photo.url} onClick={() => openGallery(index)} className={`place-photo place-photo--${index}`} aria-label={formatCopy(c.photoView, { foto: index + 1 })}><Image src={photo.url} alt={photo.alt} fill sizes="(max-width:650px) 100vw,50vw" unoptimized preload={index === 0} /></button>)}{!photos.length ? <RoomPlaceholder index={0} label={c.roomPlaceholder} /> : null}{photos.length ? <button type="button" className="place-gallery-button" onClick={() => openGallery()}><Icon name="images" />{c.roomGalleryCta}<span>({photos.length})</span></button> : null}</div></div></section>

    <section className="place-amenities section-shell" aria-label={c.locationAmenitiesTitle}><h2>{c.locationAmenitiesTitle}</h2><ul>{location.amenities.map((amenity) => <li key={amenity}><Icon name={/lavander/i.test(amenity) ? "washer" : /wifi/i.test(amenity) ? "wifi" : /terraza/i.test(amenity) ? "sun" : "heart"} />{amenity}</li>)}</ul></section>

    <section id="habitaciones" className="place-properties rooms-section section-shell section-space"><div className="section-label reveal"><span>{location.name}</span><span>{formatCopy(c.roomsNote, variables)}</span></div><div className="section-heading reveal"><h2>{formatCopy(c.locationPropertiesTitle, variables)}</h2><p>{formatCopy(c.roomsIntro, variables)}</p></div><div className={`room-grid room-grid--${Math.min(rooms.length, 3)}`}>{rooms.length ? rooms.map((room, index) => <RoomCard room={room} index={index} content={content} key={room.id} />) : <p className="rooms-empty">{c.roomsEmpty}</p>}</div></section>

    <section className="place-nearby section-shell section-space" aria-labelledby="nearby-title"><div className="section-label reveal"><span>{c.locationEyebrow}</span><span>{location.name}</span></div><div className="place-nearby-heading reveal"><h2 id="nearby-title">{c.locationNearbyTitle}</h2><a href={location.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">{c.locationDirections}<Icon name="arrowUp" /></a></div><div className="nearby-grid">{location.nearby.map((place, index) => <article className="reveal" key={place.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{place.title}</h3><p>{place.description}</p></article>)}</div><div className="place-map-link"><Icon name="pin" /><p>{location.address}, {location.city}</p><a href={location.mapUrl} target="_blank" rel="noopener noreferrer">{c.mapOpen}<Icon name="arrowUp" /></a></div></section>

    <nav className="other-locations section-shell" aria-label={c.navLocations}><Link href="/#ubicaciones">{c.locationSeeAll}<Icon name="arrow" /></Link>{publishedLocations(content).filter((place) => place.id !== location.id).map((place) => <Link href={`/ubicaciones/${place.slug}`} key={place.id}>{place.name}<Icon name="arrowUp" /></Link>)}</nav><ContactBlock content={content} />
  </main>{galleryOpen ? <PhotoLightbox photos={photos} title={location.name} copy={c} initialIndex={galleryIndex} onClose={() => setGalleryOpen(false)} /> : null}</SiteFrame>;
}
