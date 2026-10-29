import type { Location, PageCopy } from "@/lib/types";
import { Icon } from "./icons";
import { mapHref } from "./content-helpers";

// Restored from the original landing map. This is an illustration, not navigation geometry.
export default function NeighborhoodMap({ location, copy, compact = false }: {
  location: Location;
  copy: PageCopy;
  compact?: boolean;
}) {
  return <a className={`neighborhood-map${compact ? " neighborhood-map--compact" : " neighborhood-map--location"}`}
    href={mapHref(location)} target="_blank" rel="noopener noreferrer"
    aria-label={`${copy.mapOpen}: ${location.name}, ${location.address}`}>
    <span className="map-artwork">
      <svg viewBox="0 0 700 580" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="700" height="580" fill="#e9ebdc" />
        <g fill="#d4dcc3"><path d="M40 35h127v105H40zM202 35h162v105H202zM402 35h142v105H402zM582 35h117v105H582zM40 179h127v139H40zM202 179h162v139H202zM402 179h142v139H402zM582 179h117v139H582zM40 358h127v104H40zM202 358h162v104H202zM402 358h142v104H402zM582 358h117v104H582zM40 500h127v80H40zM202 500h162v80H202zM402 500h142v80H402zM582 500h117v80H582z" /></g>
        <g stroke="#f9f8ed" strokeWidth="28"><path d="M184 0v580M383 0v580M563 0v580M0 160h700M0 338h700M0 480h700" /><path d="M0 535 700 42" strokeWidth="37" /></g>
        <path d="M31 550 684 90" stroke="#bac99f" strokeWidth="13" strokeDasharray="3 10" />
        {!compact ? <g className="map-street-labels" fill="#6c7f58" fontFamily="inherit" fontSize="11" letterSpacing="1"><text x="39" y="151">{location.name.toLocaleUpperCase("es-CL")}</text><text x="235" y="471">{location.address.toLocaleUpperCase("es-CL")}</text></g> : null}
        <g fill="#aebf94"><circle cx="80" cy="390" r="21" /><circle cx="111" cy="416" r="25" /><circle cx="67" cy="430" r="18" /><circle cx="458" cy="90" r="18" /><circle cx="490" cy="99" r="23" /></g>
        <circle cx="384" cy="287" r="73" fill="#233e2d" fillOpacity=".08" /><circle cx="384" cy="287" r="50" fill="#233e2d" fillOpacity=".1" />
        <path d="M408 275c0 17-24 38-24 38s-24-21-24-38a24 24 0 1 1 48 0Z" fill="#233e2d" /><circle cx="384" cy="274" r="8" fill="#f7f5e8" />
        {!compact ? <g><rect x="263" y="207" width="243" height="37" rx="18.5" fill="#233e2d" /><text x="384.5" y="231" fill="#f7f5e8" textAnchor="middle" fontFamily="inherit" fontSize="12" letterSpacing="1.5">{copy.mapPin}</text></g> : null}
      </svg>
    </span>
    <span className="map-identity"><strong>{location.name}</strong><span>{location.address}</span></span>
    <span className="map-action">{!compact ? copy.mapOpen : <span className="sr-only">{copy.mapOpen}</span>}<Icon name="arrowUp" /></span>
    {!compact ? <span className="map-caption">{copy.mapCaption}</span> : null}
  </a>;
}
