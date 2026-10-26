"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { formatCopy } from "@/lib/copy";
import type { PageCopy, RoomPhoto } from "@/lib/types";
import { Icon } from "./icons";

export default function PhotoLightbox({ photos, title, copy, initialIndex = 0, onClose }: { photos: RoomPhoto[]; title: string; copy: PageCopy; initialIndex?: number; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const [active, setActive] = useState(Math.min(initialIndex, Math.max(photos.length - 1, 0)));
  const change = (offset: number) => setActive((current) => (current + offset + photos.length) % photos.length);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialogRef} className="photo-lightbox" aria-labelledby={headingId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => {
    if (photos.length < 2) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
  }}>
    <div className="lightbox-shell">
      <header className="lightbox-header"><div><p>{copy.locationGalleryTitle}</p><h2 id={headingId}>{title}</h2></div><button type="button" className="lightbox-close" onClick={onClose} aria-label={copy.galleryClose} autoFocus><Icon name="close" /></button></header>
      <div className="lightbox-image">
        {photos[active] ? <Image src={photos[active].url} alt={photos[active].alt || formatCopy(copy.photoAlt, { habitacion: title, foto: active + 1 })} fill sizes="90vw" unoptimized /> : <p>{copy.galleryEmpty}</p>}
        {photos.length > 1 ? <><button type="button" className="lightbox-arrow lightbox-arrow--previous" onClick={() => change(-1)} aria-label={copy.galleryPrevious}><Icon name="chevron" className="reverse" /></button><button type="button" className="lightbox-arrow lightbox-arrow--next" onClick={() => change(1)} aria-label={copy.galleryNext}><Icon name="chevron" /></button></> : null}
      </div>
      <div className="lightbox-status" aria-live="polite" aria-atomic="true">{formatCopy(copy.galleryPhotoCount, { foto: active + 1, total: photos.length })}</div>
      {photos.length > 1 ? <div className="lightbox-thumbnails" aria-label={copy.galleryThumbnails}>{photos.map((photo, index) => <button type="button" key={`${photo.url}-${index}`} onClick={() => setActive(index)} aria-label={formatCopy(copy.photoView, { foto: index + 1 })} aria-current={active === index ? "true" : undefined}><Image src={photo.url} alt="" width={100} height={72} unoptimized /></button>)}</div> : null}
    </div>
  </dialog>;
}
