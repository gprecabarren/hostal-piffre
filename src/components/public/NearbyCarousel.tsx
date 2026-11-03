"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { Location } from "@/lib/types";
import { Icon } from "./icons";
import "./nearby-carousel.css";

export default function NearbyCarousel({ location }: { location: Location }) {
  const { explore } = location;
  const places = explore.places.filter(place => place.published && place.photo.url);
  const track = useRef<HTMLUListElement>(null);
  const id = useId();
  const [position, setPosition] = useState({ first: true, last: false, index: 0 });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const step = (element.children[0] as HTMLElement | undefined)?.offsetWidth || 1;
      const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
      const next = { first: element.scrollLeft <= 2, last: element.scrollWidth - element.clientWidth - element.scrollLeft <= 2, index: Math.round(element.scrollLeft / (step + gap)) };
      setPosition(previous => previous.first === next.first && previous.last === next.last && previous.index === next.index ? previous : next);
    };
    measure();
    element.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => { observer.disconnect(); element.removeEventListener("scroll", measure); };
  }, [places.length, explore.enabled]);
  if (!explore.enabled || !places.length) return null;
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const step = (element.children[0] as HTMLElement).offsetWidth + (Number.parseFloat(getComputedStyle(element).columnGap) || 0);
    element.scrollBy({ left: direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section id="descubre-santiago" className="explore-section" aria-labelledby={`${id}-title`}>
    <div className="section-shell">
      <div className="explore-kicker"><span>{explore.eyebrow}</span><span><Icon name="pin" />{location.name}</span></div>
      <div className="explore-heading"><h2 id={`${id}-title`}>{explore.title}</h2><p>{explore.description}</p></div>
      <div className="explore-toolbar"><span>Un lugar, un nuevo recuerdo.</span><div className="explore-controls"><span className="explore-count" aria-live="polite" aria-atomic="true">{String(position.index + 1).padStart(2, "0")} <span>/ {String(places.length).padStart(2, "0")}</span></span><button type="button" aria-label="Ver lugares anteriores" aria-controls={`${id}-track`} disabled={position.first} onClick={() => move(-1)}><Icon name="chevron" className="reverse" /></button><button type="button" aria-label="Ver lugares siguientes" aria-controls={`${id}-track`} disabled={position.last} onClick={() => move(1)}><Icon name="chevron" /></button></div></div>
      <ul id={`${id}-track`} className="explore-track" ref={track} tabIndex={0} aria-label={`Lugares para descubrir desde ${location.name}`} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "Home" || event.key === "End") { event.preventDefault(); track.current?.scrollTo({ left: event.key === "Home" ? 0 : track.current.scrollWidth, behavior: "instant" }); } if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        {places.map((place, index) => <li key={place.id} className="explore-card"><article>
          <div className="explore-photo"><Image src={place.photo.url} alt={place.photo.alt} fill sizes="(max-width: 650px) 85vw, (max-width: 1050px) 46vw, 420px" unoptimized /><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
          <div className="explore-copy"><p className="explore-category">{place.category}</p><h3>{place.title}</h3><p className="explore-description">{place.description}</p>{place.mapUrl ? <a href={place.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${explore.directionsLabel}: ${place.title} desde ${location.name}`}><span>{explore.directionsLabel}</span><Icon name="arrowUp" /></a> : null}</div>
        </article></li>)}
      </ul>
      <details className="explore-credits"><summary>Créditos de las fotografías</summary><ul>{places.filter(place => place.credit.author || place.credit.sourceUrl).map(place => <li key={place.id}><strong>{place.title}</strong> · {place.credit.author}{place.credit.sourceUrl ? <> · <a href={place.credit.sourceUrl} target="_blank" rel="noopener noreferrer">Fotografía original</a></> : null}{place.credit.licenseUrl ? <> · <a href={place.credit.licenseUrl} target="_blank" rel="noopener noreferrer">{place.credit.license}</a></> : place.credit.license ? ` · ${place.credit.license}` : ""}{place.credit.changes ? <span> {place.credit.changes}</span> : null}</li>)}</ul></details>
    </div>
  </section>;
}
