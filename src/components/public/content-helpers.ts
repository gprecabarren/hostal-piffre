import { formatCopy } from "@/lib/copy";
import type { Location, Room, SiteContent } from "@/lib/types";

export function getRoomLocation(content: SiteContent, room: Room) {
  return content.locations.find((location) => location.id === room.locationId);
}

export function whatsappUrl(content: SiteContent, room?: Room, location?: Location) {
  if (room?.whatsappUrl) return room.whatsappUrl;
  const place = location || (room ? getRoomLocation(content, room) : undefined);
  const variables = { habitacion: room?.name || "", sitio: content.site.name, ubicacion: place?.name || "" };
  const message = room
    ? formatCopy(content.copy.roomWhatsappMessage, variables)
    : place ? formatCopy(content.copy.locationWhatsappMessage, variables) : content.contact.whatsappMessage;
  return `https://wa.me/${content.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function locationPhotos(content: SiteContent, location: Location) {
  const photographs = location.photos.filter((photo) => photo.url);
  return photographs.length ? photographs : content.rooms.filter((room) => room.published && room.locationId === location.id).flatMap((room) => room.photos.filter((photo) => photo.url));
}

export function publishedLocations(content: SiteContent) {
  const order = (slug: string) => slug === "providencia" ? 0 : slug === "santiago-centro" ? 1 : 2;
  return content.locations.filter((location) => location.published).sort((a, b) => order(a.slug) - order(b.slug));
}
