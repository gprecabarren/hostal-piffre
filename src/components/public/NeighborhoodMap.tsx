import Image from "next/image";
import type { Location, PageCopy } from "@/lib/types";
import { Icon } from "./icons";
import { mapHref } from "./content-helpers";

export default function NeighborhoodMap({ location, copy, compact = false }: {
  location: Location;
  copy: PageCopy;
  compact?: boolean;
}) {
  const mapKey = location.id === "providencia" || location.id === "santiago-centro" ? location.id : null;
  return <div className={`neighborhood-map-wrap${compact ? " neighborhood-map-wrap--compact" : ""}`}>
    <a className={`neighborhood-map${compact ? " neighborhood-map--compact" : " neighborhood-map--location"}`}
      href={mapHref(location)} target="_blank" rel="noopener noreferrer"
      aria-label={`${copy.mapOpen}: ${location.name}, ${location.address}`}>
      {mapKey ? <picture className="map-artwork">
        {!compact ? <source media="(max-width:850px)" srcSet={`/maps/${mapKey}-square.svg`} /> : null}
        <Image className="map-street-image" src={`/maps/${mapKey}-${compact ? "mini" : "wide"}.svg`} alt="" width={compact ? 160 : 1000} height={compact ? 160 : 334} unoptimized />
      </picture> : <span className="map-artwork"><svg viewBox="0 0 700 580" fill="none" aria-hidden="true"><rect width="700" height="580" fill="#e2e7d5" /><path d="M350 300s-24-21-24-38a24 24 0 1 1 48 0c0 17-24 38-24 38Z" fill="#233e2d" /></svg></span>}
      {!compact ? <span className="map-pin-label">{copy.mapPin}</span> : null}
      <span className="map-identity"><strong>{location.name}</strong><span>{location.address}</span></span>
      <span className="map-action">{!compact ? copy.mapOpen : <span className="sr-only">{copy.mapOpen}</span>}<Icon name="arrowUp" /></span>
      {!compact ? <span className="map-caption">{copy.mapCaption}</span> : null}
    </a>
    {mapKey ? <a className="map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" aria-label="Cartografía: colaboradores de OpenStreetMap, licencia ODbL">© OpenStreetMap</a> : null}
  </div>;
}
