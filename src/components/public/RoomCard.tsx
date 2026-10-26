"use client";

import Image from "next/image";
import { useState } from "react";
import { formatCopy } from "@/lib/copy";
import type { Room, SiteContent } from "@/lib/types";
import { RoomPlaceholder } from "./artwork";
import { Icon } from "./icons";
import PhotoLightbox from "./PhotoLightbox";
import { getRoomLocation, whatsappUrl } from "./content-helpers";

export default function RoomCard({ room, index, content }: { room: Room; index: number; content: SiteContent }) {
  const [active, setActive] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const c = content.copy;
  const allPhotos = room.photos.filter((photo) => photo.url);
  const preview = allPhotos.slice(0, 3);
  const photo = preview[active] || preview[0];
  const place = getRoomLocation(content, room);
  const variables = { habitacion: room.name, sitio: content.site.name, ubicacion: place?.name || "", foto: active + 1, total: preview.length };
  const change = (offset: number) => { if (preview.length > 1) setActive((current) => (current + offset + preview.length) % preview.length); };
  const platforms = [{ icon: "booking" as const, label: c.roomBookingLabel, href: room.bookingUrl }, { icon: "airbnb" as const, label: c.roomAirbnbLabel, href: room.airbnbUrl }, { icon: "vrbo" as const, label: c.roomVrboLabel, href: room.vrboUrl }];
  return <article className="room-card reveal" data-room-id={room.id} data-room-name={room.name} data-location-id={room.locationId}>
    <div className="room-gallery" role="region" aria-roledescription={c.carouselAria} aria-label={formatCopy(c.galleryAria, variables)} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); } if (event.key === "ArrowRight") { event.preventDefault(); change(1); } }}>
      <div className="room-photo" aria-live="polite" aria-atomic="true">{photo ? <Image key={photo.url} src={photo.url} alt={photo.alt || formatCopy(c.photoAlt, variables)} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" unoptimized /> : <RoomPlaceholder index={index} label={c.roomPlaceholder} />}<span className="sr-only">{preview.length ? formatCopy(c.photoCount, variables) : c.galleryEmpty}</span></div>
      <span className="room-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="room-kind">{room.kind === "apartment" ? c.roomKindApartment : c.roomKindRoom}</span>
      {preview.length ? <div className="gallery-controls"><span aria-hidden="true">{String(active + 1).padStart(2, "0")} <span>/ {String(preview.length).padStart(2, "0")}</span></span>{preview.length > 1 ? <div><button type="button" onClick={() => change(-1)} aria-label={formatCopy(c.photoPrevious, variables)}><Icon name="chevron" className="reverse" /></button><button type="button" onClick={() => change(1)} aria-label={formatCopy(c.photoNext, variables)}><Icon name="chevron" /></button></div> : null}</div> : null}
    </div>
    <div className="gallery-dots" aria-label={formatCopy(c.photoSelect, variables)}>{preview.map((_, photoIndex) => <button type="button" key={photoIndex} className={active === photoIndex ? "is-active" : ""} aria-label={formatCopy(c.photoView, { ...variables, foto: photoIndex + 1 })} aria-pressed={active === photoIndex} onClick={() => setActive(photoIndex)} />)}</div>
    <div className="room-content"><p className="room-tag">{room.tag}</p><h3>{room.name}</h3><p className="room-description">{room.description}</p><ul className="room-features">{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
      <button type="button" className="view-photos" disabled={!allPhotos.length} onClick={() => setGalleryOpen(true)}><Icon name="images" />{formatCopy(c.roomGalleryCta, { total: allPhotos.length, habitacion: room.name })}<Icon name="arrowUp" /></button>
      <div className="room-platforms room-platforms--all">{platforms.map((platform) => platform.href ? <a key={platform.icon} href={platform.href} target="_blank" rel="noopener noreferrer"><Icon name={platform.icon} />{platform.label}</a> : <button key={platform.icon} type="button" disabled><Icon name={platform.icon} />{platform.label}</button>)}</div>
      <a className="room-contact" href={whatsappUrl(content, room)} target="_blank" rel="noopener noreferrer"><span className="room-contact-label"><Icon name="whatsapp" />{c.roomAvailabilityCta}</span><Icon name="arrowUp" /></a>
    </div>
    {galleryOpen ? <PhotoLightbox photos={allPhotos} title={room.name} copy={c} initialIndex={active} onClose={() => setGalleryOpen(false)} /> : null}
  </article>;
}
