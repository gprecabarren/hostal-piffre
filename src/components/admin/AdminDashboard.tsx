"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { SiteContent, Room, RoomPhoto, PageCopyKey, Location as SiteLocation } from "@/lib/types";
import { pageCopyGroups, pageCopyFields } from "@/lib/copy";
import { AdminIcon, type AdminIconName } from "./AdminIcon";

type Section = "overview" | "rooms" | "locations" | "extras" | "content" | "copy" | "faq" | "seo" | "contact" | "legal";
type GalleryTarget = { kind: "room" | "location"; id: string };
type UploadProgress = { target: string; current: number; total: number; name: string };
type ContentStatus = { configured: boolean; persisted: boolean; error?: string };
type Notice = { type: "success" | "error"; text: string } | null;
type Confirmation = { kind: "remove"; room: Room } | { kind: "discard" };
type RemovedRoom = { room: Room; position: number };
const MAX_PROPERTIES = 30;
const MAX_FAQ = 20;
const MAX_AMENITIES = 12;
const MAX_PHOTOS = 40;

const sections: { id: Section; label: string; icon: AdminIconName; description: string }[] = [
  { id: "overview", label: "Vista general", icon: "home", description: "Un lugar para cuidar cada detalle de tu alojamiento en internet." },
  { id: "rooms", label: "Propiedades", icon: "bed", description: "Agrega tus espacios, elige su orden y prepara una buena bienvenida." },
  { id: "locations", label: "Ubicaciones", icon: "pin", description: "La dirección, los servicios y la presentación de cada uno de tus alojamientos." },
  { id: "extras", label: "Países y pagos", icon: "globe", description: "Personaliza la franja de países y los medios de pago que muestras a tus huéspedes." },
  { id: "content", label: "Contenido del sitio", icon: "edit", description: "Tu historia, tus servicios y el barrio que hace especial tu alojamiento." },
  { id: "copy", label: "Textos de la página", icon: "document", description: "Personaliza los títulos, botones y pequeños detalles de cada sección." },
  { id: "faq", label: "Preguntas frecuentes", icon: "question", description: "Resuelve las dudas de tus huéspedes antes de que hagan las maletas." },
  { id: "seo", label: "Visibilidad en Google", icon: "search", description: "Ayuda a los viajeros a encontrar tu alojamiento en Providencia." },
  { id: "contact", label: "Contacto y redes", icon: "phone", description: "Mantén siempre abierta la puerta a una nueva conversación." },
  { id: "legal", label: "Textos legales", icon: "document", description: "Información clara para que tus huéspedes reserven con confianza." },
];

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (index < 0 || destination < 0 || destination >= items.length) return items;
  const next = [...items];
  [next[index], next[destination]] = [next[destination], next[index]];
  return next;
}

function newProperty(number: number, locationId: string): Room {
  const id = crypto.randomUUID();
  const name = `Nueva propiedad ${number}`;
  return {
    id,
    slug: `propiedad-${id}`,
    name,
    description: "",
    tag: "",
    features: [],
    photos: [
      { url: "", alt: `Vista principal de ${name}` },
      { url: "", alt: `Segunda fotografía de ${name}` },
      { url: "", alt: `Detalle de ${name}` },
    ],
    bookingUrl: "",
    airbnbUrl: "",
    whatsappUrl: "",
    vrboUrl: "",
    locationId,
    kind: "room",
    published: false,
  };
}

function issueLabel(path: string): string {
  const parts = path.replace(/^content\./, "").split(".");
  const last = parts[parts.length - 1];
  if (parts[0] === "copy") return pageCopyFields.find(field => field.key === last)?.label || "texto de la página";
  const labels: Record<string, string> = {
    name: "nombre", description: "descripción", title: "título", titleAccent: "título destacado", eyebrow: "texto de portada", tagline: "frase de marca", text: "texto", whatsapp: "número de WhatsApp", whatsappUrl: "enlace de WhatsApp", whatsappMessage: "mensaje de WhatsApp", email: "correo", address: "dirección", city: "ciudad", region: "región", country: "país", instagram: "Instagram", mapUrl: "enlace del mapa", keywords: "palabras clave", siteUrl: "dominio principal", ogImage: "imagen al compartir", googleSiteVerification: "verificación de Google", gtmId: "identificador de Tag Manager", bookingUrl: "enlace de Booking", airbnbUrl: "enlace de Airbnb", vrboUrl: "enlace de Vrbo", locationId: "ubicación de la propiedad", kind: "tipo de alojamiento", features: "características", tag: "etiqueta", alt: "descripción de imagen", url: "enlace de imagen", question: "pregunta", answer: "respuesta", privacy: "política de privacidad", terms: "términos y condiciones", updatedAt: "fecha", code: "código del país", label: "nombre del medio de pago", id: "identificador",
  };
  const field = labels[last] || "información";
  if (parts[0] === "rooms") return `propiedad ${Number(parts[1]) + 1}${parts[2] === "photos" ? `, foto ${Number(parts[3]) + 1}` : ""}: ${field}`;
  if (parts[0] === "locations") return `ubicación ${Number(parts[1]) + 1}: ${field}`;
  if (parts[0] === "visitorCountries") return `país ${Number(parts[1]) + 1}: ${field}`;
  if (parts[0] === "paymentMethods") return `medio de pago ${Number(parts[1]) + 1}: ${field}`;
  const group: Record<string, string> = { seo: "Google", contact: "contacto", site: "presentación", hero: "portada", about: "historia", amenities: "servicios", location: "ubicación", faq: "preguntas frecuentes", policies: "textos legales" };
  return `${group[parts[0]] || "contenido"}: ${field}`;
}

function TextField({ label, value, onChange, hint, multiline, type = "text", required, placeholder, maxLength }: {
  label: string; value: string; onChange: (value: string) => void; hint?: string; multiline?: boolean; type?: string; required?: boolean; placeholder?: string; maxLength?: number;
}) {
  const id = useId();
  const describedBy = hint ? `${id}-hint` : undefined;
  return <div className="admin-field">
    <label htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
    {multiline ? <textarea id={id} aria-describedby={describedBy} value={value} onChange={event => onChange(event.target.value)} rows={4} required={required} placeholder={placeholder} maxLength={maxLength}/> : <input id={id} aria-describedby={describedBy} type={type} value={value} onChange={event => onChange(event.target.value)} onKeyDown={event => { if (type === "search" && event.key === "Enter") event.preventDefault(); }} required={required} placeholder={placeholder} maxLength={maxLength}/>}
    {hint ? <p className="admin-field-hint" id={describedBy}>{hint}</p> : null}
  </div>;
}

function Panel({ title, description, children, aside }: { title: string; description?: string; children: ReactNode; aside?: ReactNode }) {
  return <section className="admin-panel"><div className="admin-panel-heading"><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{aside}</div><div className="admin-panel-body">{children}</div></section>;
}

function SelectField({ label, value, options, onChange, hint }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; hint?: string }) {
  const id = useId();
  return <div className="admin-field"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={event => onChange(event.target.value)} aria-describedby={hint ? `${id}-hint` : undefined}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{hint ? <p id={`${id}-hint`} className="admin-field-hint">{hint}</p> : null}</div>;
}

function MoveControls({ label, index, total, disabled, onMove }: { label: string; index: number; total: number; disabled: boolean; onMove: (direction: -1 | 1) => void }) {
  return <div className="admin-order-controls">
    <button type="button" className="admin-icon-button" disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label={`Subir ${label}`} title="Subir una posición"><AdminIcon name="up" size={16}/></button>
    <button type="button" className="admin-icon-button" disabled={disabled || index === total - 1} onClick={() => onMove(1)} aria-label={`Bajar ${label}`} title="Bajar una posición"><AdminIcon name="down" size={16}/></button>
  </div>;
}

function ConfirmDialog({ confirmation, onCancel, onConfirm }: { confirmation: Confirmation; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  const retiring = confirmation.kind === "remove";
  return <dialog ref={dialogRef} className="admin-confirm-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={event => { event.preventDefault(); onCancel(); }} onClick={event => { if (event.target === event.currentTarget) onCancel(); }}>
    <div className="admin-confirm-content"><span className="admin-confirm-icon"><AdminIcon name={retiring ? "trash" : "undo"} size={25}/></span>
      <h2 id={`${id}-title`}>{retiring ? "¿Retirar esta propiedad?" : "¿Descartar los cambios?"}</h2>
      <p id={`${id}-description`}>{retiring ? `«${confirmation.room.name}» se retirará de esta edición. Puedes deshacerlo antes de guardar. El sitio público cambiará cuando guardes y publiques.` : "Se recuperará la última versión guardada de todas las secciones. Los cambios de esta edición se perderán."}</p>
      <div className="admin-confirm-actions"><button type="button" className="admin-button admin-button-outline" onClick={onCancel} autoFocus>Seguir editando</button><button type="button" className="admin-button admin-button-danger" onClick={onConfirm}>{retiring ? "Retirar propiedad" : "Descartar cambios"}</button></div>
    </div>
  </dialog>;
}

function PhotoEditor({ photo, ownerName, index, total, busy, cover, canRemove, onChange, onUpload, onMove, onRemove }: {
  photo: RoomPhoto; ownerName: string; index: number; total: number; busy: boolean; cover: boolean; canRemove: boolean; onChange: (photo: RoomPhoto) => void; onUpload: (files: File[]) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void;
}) {
  const uploadId = useId();
  return <div className="admin-photo-editor">
    <div className="admin-photo-preview">{photo.url ? <img src={photo.url} alt={photo.alt || `Foto ${index + 1} de ${ownerName}`} loading="lazy"/> : <div className="admin-photo-empty"><AdminIcon name="image" size={30}/><span>Tu próxima buena foto</span></div>}<span className={`admin-photo-number ${cover ? "admin-photo-cover" : ""}`}>{String(index + 1).padStart(2, "0")} · {cover ? `Portada ${index + 1}` : "Galería"}</span></div>
    <div className="admin-photo-fields">
      <label className={`admin-button admin-button-outline admin-upload-button ${busy ? "admin-disabled" : ""}`} htmlFor={uploadId}><AdminIcon name="upload" size={17}/>{photo.url ? "Reemplazar foto" : "Subir una foto"}</label>
      <input id={uploadId} className="admin-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => { const files = Array.from(event.target.files || []); if (files.length) onUpload(files); event.target.value = ""; }}/>
      <TextField label={`Descripción de la foto ${index + 1}`} value={photo.alt} required onChange={alt => onChange({ ...photo, alt })} placeholder={`Vista de ${ownerName.toLowerCase()}`} maxLength={250} hint="Describe lo que se ve para mejorar la accesibilidad y el SEO."/>
      <details className="admin-photo-details"><summary>Usar un enlace de imagen</summary><TextField label="URL de la foto" value={photo.url} onChange={url => onChange({ ...photo, url })} placeholder="https://…"/></details>
      <div className="admin-photo-actions"><MoveControls label={`foto ${index + 1} de ${ownerName}`} index={index} total={total} disabled={busy} onMove={onMove}/><button className="admin-icon-button admin-danger" type="button" disabled={busy || !canRemove} onClick={onRemove} aria-label={`Quitar foto ${index + 1} de ${ownerName}`} title={canRemove ? "Quitar de la galería" : "Oculta primero la propiedad para conservar menos de tres portadas"}><AdminIcon name="trash" size={16}/></button></div>
    </div>
  </div>;
}

export function GalleryEditor({ photos, ownerName, property = false, published = false, disabled, progress, onChange, onUpload }: {
  photos: RoomPhoto[]; ownerName: string; property?: boolean; published?: boolean; disabled: boolean; progress?: UploadProgress | null; onChange: (photos: RoomPhoto[]) => void; onUpload: (files: File[], replaceIndex?: number) => void;
}) {
  const uploadId = useId();
  const [photoKeys, setPhotoKeys] = useState(() => photos.map((_, index) => `initial-${index}`));
  const keys = photos.map((_, index) => photoKeys[index] || `pending-${index}`);
  useEffect(() => {
    // Uploaded files arrive through props; give each new card a stable local key.
    setPhotoKeys(previous => previous.length >= photos.length ? previous : [...previous, ...Array.from({ length: photos.length - previous.length }, () => `photo-${crypto.randomUUID()}`)]);
  }, [photos.length]);
  const available = MAX_PHOTOS - photos.length + photos.filter(photo => !photo.url).length;
  return <fieldset className="admin-fieldset admin-gallery-fieldset" disabled={disabled}>
    <div className="admin-gallery-toolbar"><div><strong>{photos.filter(photo => photo.url).length} fotografías añadidas</strong><p>{property ? "Las tres primeras posiciones son las portadas. Todas las fotos forman parte de la galería." : "Ordena las fotografías como quieres que se vean en esta ubicación."}</p></div><div className="admin-gallery-buttons"><label htmlFor={uploadId} className={`admin-button admin-button-primary ${disabled || available === 0 ? "admin-disabled" : ""}`}><AdminIcon name="upload" size={17}/>Subir varias fotos</label><input id={uploadId} className="admin-visually-hidden" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={disabled || available === 0} onChange={event => { const files = Array.from(event.target.files || []); if (files.length) onUpload(files); event.target.value = ""; }}/><button type="button" className="admin-button admin-button-outline" disabled={disabled || photos.length >= MAX_PHOTOS} onClick={() => { setPhotoKeys([...keys, `photo-${crypto.randomUUID()}`]); onChange([...photos, { url: "", alt: `Fotografía ${photos.length + 1} de ${ownerName}` }]); }}><AdminIcon name="plus" size={16}/>Agregar por enlace</button></div></div>
    {progress ? <div className="admin-upload-progress" role="status" aria-live="polite"><span className="admin-upload-spinner" aria-hidden="true"/><div><strong>Subiendo {progress.current} de {progress.total}</strong><small>{progress.name}</small></div><span>No cierres esta página.</span></div> : null}
    {photos.length ? <div className="admin-photo-grid admin-gallery-grid">{photos.map((photo, index) => <PhotoEditor key={keys[index]} photo={photo} ownerName={ownerName} index={index} total={photos.length} busy={disabled} cover={property && index < 3} canRemove={!property || !published || photos.length > 3} onChange={next => onChange(photos.map((item, current) => current === index ? next : item))} onUpload={files => onUpload(files, index)} onMove={direction => { setPhotoKeys(moveItem(keys, index, direction)); onChange(moveItem(photos, index, direction)); }} onRemove={() => { setPhotoKeys(keys.filter((_, current) => current !== index)); onChange(photos.filter((_, current) => current !== index)); }}/>)}</div> : <div className="admin-empty-state"><AdminIcon name="image" size={30}/><h2>Una galería por descubrir</h2><p>Sube tus fotografías o agrega el enlace de una imagen para comenzar.</p></div>}
    <p className="admin-muted-note">Hasta 40 fotos por galería. JPG, PNG o WebP; máximo 4 MB por archivo. Las subidas múltiples se realizan de una en una y completan primero los espacios vacíos.</p>
    {property && published && photos.length <= 3 ? <p className="admin-muted-note">Una propiedad visible conserva al menos tres portadas. Puedes reemplazarlas o quitar más posiciones después de ocultar la propiedad.</p> : null}
  </fieldset>;
}

export function AdminDashboard({ initialContent, status, user, signOutAction }: {
  initialContent: SiteContent; status: ContentStatus; user: { name?: string | null; email?: string | null }; signOutAction: () => Promise<void>;
}) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(() => JSON.stringify(initialContent));
  const [section, setSection] = useState<Section>("overview");
  const [selectedRoomId, setSelectedRoomId] = useState(initialContent.rooms[0]?.id || "");
  const [selectedLocationId, setSelectedLocationId] = useState(initialContent.locations[0]?.id || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadProgress | null>(null);
  const uploadLock = useRef(false);
  const [notice, setNotice] = useState<Notice>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [removedRooms, setRemovedRooms] = useState<RemovedRoom[]>([]);
  const [copyFilter, setCopyFilter] = useState<{ query: string; matches: PageCopyKey[] | null }>({ query: "", matches: null });
  const [itemKeys, setItemKeys] = useState(() => ({ faq: initialContent.faq.map((_, index) => `faq-${index}`), amenities: initialContent.amenities.map((_, index) => `amenity-${index}`) }));
  const dirty = JSON.stringify(content) !== savedContent;
  const photoCount = content.rooms.reduce((total, room) => total + room.photos.filter(photo => Boolean(photo.url)).length, 0);
  const photoSlotsCount = content.rooms.reduce((total, room) => total + room.photos.length, 0);
  const linkCount = content.rooms.reduce((total, room) => total + Number(Boolean(room.bookingUrl)) + Number(Boolean(room.airbnbUrl)) + Number(Boolean(room.vrboUrl)), 0);
  const publishedLocationIds = new Set(content.locations.filter(location => location.published).map(location => location.id));
  const isRoomVisible = (room: Room) => room.published && publishedLocationIds.has(room.locationId);
  const roomStatus = (room: Room) => !room.published ? "Oculta" : isRoomVisible(room) ? "Visible" : "Ubicación oculta";
  const publishedCount = content.rooms.filter(isRoomVisible).length;
  const activeRoom = content.rooms.find(room => room.id === selectedRoomId) || content.rooms[0];
  const activeLocation = content.locations.find(location => location.id === selectedLocationId) || content.locations[0];
  const currentSection = sections.find(item => item.id === section)!;
  const busy = saving || uploading !== null;
  const copyGroups = pageCopyGroups.map(group => ({ ...group, fields: group.fields.filter(field => copyFilter.matches === null || copyFilter.matches.includes(field.key)) })).filter(group => group.fields.length);

  useEffect(() => {
    if (!dirty) return;
    const preventLeave = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", preventLeave);
    return () => window.removeEventListener("beforeunload", preventLeave);
  }, [dirty]);

  useEffect(() => {
    if (notice?.type === "error") feedbackRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [notice]);

  function editContent(edit: (previous: SiteContent) => SiteContent) {
    setContent(edit);
    setNotice(null);
  }
  function update<T extends keyof SiteContent>(key: T, patch: Partial<SiteContent[T]>) {
    editContent(previous => ({ ...previous, [key]: { ...previous[key], ...patch } }));
  }
  function updateRoom(id: string, patch: Partial<Room>) {
    editContent(previous => ({ ...previous, rooms: previous.rooms.map(room => room.id === id ? { ...room, ...patch } : room) }));
  }
  function setRoomVisibility(room: Room, published: boolean) {
    if (published && room.photos.length < 3) {
      setSelectedRoomId(room.id);
      setNotice({ type: "error", text: "Agrega al menos tres fotografías de portada antes de mostrar esta propiedad. Puedes guardar mientras permanece oculta." });
      return;
    }
    updateRoom(room.id, { published });
  }
  function updateLocation(id: string, patch: Partial<SiteLocation>) {
    editContent(previous => ({ ...previous, locations: previous.locations.map(location => location.id === id ? { ...location, ...patch } : location) }));
  }
  function updateGallery(target: GalleryTarget, photos: RoomPhoto[]) {
    if (photos.length > MAX_PHOTOS) return;
    if (target.kind === "room") updateRoom(target.id, { photos });
    else updateLocation(target.id, { photos });
  }
  function addRoom() {
    if (busy || content.rooms.length >= MAX_PROPERTIES) return;
    const room = newProperty(content.rooms.length + 1, selectedLocationId || content.locations[0].id);
    editContent(previous => ({ ...previous, rooms: [...previous.rooms, room] }));
    setSelectedRoomId(room.id);
    setNotice({ type: "success", text: "Nueva propiedad creada como oculta. Completa sus datos y activa su visibilidad cuando esté lista." });
  }
  function moveRoom(index: number, direction: -1 | 1) {
    editContent(previous => ({ ...previous, rooms: moveItem(previous.rooms, index, direction) }));
  }
  function undoRemoval() {
    const last = removedRooms[removedRooms.length - 1];
    if (!last || busy) return;
    if (content.rooms.length >= MAX_PROPERTIES) { setNotice({ type: "error", text: "Retira otra propiedad para poder reponer esta. Puedes tener hasta 30 propiedades." }); return; }
    editContent(previous => {
      const rooms = [...previous.rooms];
      rooms.splice(Math.min(last.position, rooms.length), 0, last.room);
      return { ...previous, rooms };
    });
    setRemovedRooms(previous => previous.slice(0, -1));
    setSelectedRoomId(last.room.id);
  }
  function confirmChange() {
    if (!confirmation || busy) return;
    if (confirmation.kind === "discard") {
      const restored: SiteContent = JSON.parse(savedContent);
      setContent(restored);
      setSelectedRoomId(restored.rooms[0]?.id || "");
      setSelectedLocationId(restored.locations[0]?.id || "");
      setItemKeys({ faq: restored.faq.map((_, index) => `faq-${index}`), amenities: restored.amenities.map((_, index) => `amenity-${index}`) });
      setRemovedRooms([]);
      setNotice({ type: "success", text: "Se recuperó la última versión guardada." });
    } else if (content.rooms.length > 1) {
      const position = content.rooms.findIndex(room => room.id === confirmation.room.id);
      if (position >= 0) {
        setRemovedRooms(previous => [...previous, { room: confirmation.room, position }]);
        const rooms = content.rooms.filter(room => room.id !== confirmation.room.id);
        setContent(previous => ({ ...previous, rooms }));
        if (selectedRoomId === confirmation.room.id) setSelectedRoomId(rooms[Math.min(position, rooms.length - 1)].id);
        setNotice(null);
      }
    }
    setConfirmation(null);
  }
  function moveCollection(collection: "faq" | "amenities", index: number, direction: -1 | 1) {
    editContent(previous => collection === "faq" ? { ...previous, faq: moveItem(previous.faq, index, direction) } : { ...previous, amenities: moveItem(previous.amenities, index, direction) });
    setItemKeys(previous => ({ ...previous, [collection]: moveItem(previous[collection], index, direction) }));
  }
  function removeCollectionItem(collection: "faq" | "amenities", index: number) {
    editContent(previous => collection === "faq" ? { ...previous, faq: previous.faq.filter((_, current) => current !== index) } : { ...previous, amenities: previous.amenities.filter((_, current) => current !== index) });
    setItemKeys(previous => ({ ...previous, [collection]: previous[collection].filter((_, current) => current !== index) }));
  }
  function addCollectionItem(collection: "faq" | "amenities") {
    if (busy) return;
    if (collection === "faq" && content.faq.length < MAX_FAQ) editContent(previous => ({ ...previous, faq: [...previous.faq, { question: "", answer: "" }] }));
    else if (collection === "amenities" && content.amenities.length < MAX_AMENITIES) editContent(previous => ({ ...previous, amenities: [...previous.amenities, { title: "", description: "" }] }));
    else return;
    setItemKeys(previous => ({ ...previous, [collection]: [...previous[collection], `${collection}-${crypto.randomUUID()}`] }));
  }
  function updateCopy(key: PageCopyKey, value: string) {
    update("copy", { [key]: value });
  }
  function searchCopy(query: string) {
    const normalize = (value: string) => value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const search = normalize(query.trim());
    const matches: PageCopyKey[] | null = search ? pageCopyGroups.flatMap(group => group.fields.filter(field => normalize(`${group.label} ${field.label} ${field.defaultValue} ${content.copy[field.key]}`).includes(search)).map(field => field.key)) : null;
    // Keep the search result stable while a matching text is being edited.
    setCopyFilter({ query, matches });
  }
  async function uploadPhotos(files: File[], target: GalleryTarget, replaceIndex?: number) {
    if (uploadLock.current || saving || !status.configured || status.error) return;
    const owner = target.kind === "room" ? content.rooms.find(room => room.id === target.id) : content.locations.find(location => location.id === target.id);
    if (!owner) return;
    const emptySlots = owner.photos.flatMap((photo, index) => photo.url ? [] : [index]);
    const capacity = replaceIndex === undefined ? MAX_PHOTOS - owner.photos.length + emptySlots.length : 1;
    if (capacity <= 0) { setNotice({ type: "error", text: "Esta galería ya tiene 40 fotografías. Quita una antes de añadir otra." }); return; }
    const selected = files.slice(0, capacity);
    const failures: string[] = [];
    let successful = 0;
    uploadLock.current = true;
    setUploading({ target: `${target.kind}:${target.id}`, current: 1, total: selected.length, name: selected[0]?.name || "" });
    setNotice(null);
    try {
      for (let index = 0; index < selected.length; index++) {
        const file = selected[index];
        setUploading({ target: `${target.kind}:${target.id}`, current: index + 1, total: selected.length, name: file.name });
        try {
          if (!file.size || file.size > 4 * 1024 * 1024) throw new Error("debe pesar entre 1 byte y 4 MB");
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("elige un archivo JPG, PNG o WebP");
          const data = new FormData();
          data.append("file", file);
          const response = await fetch("/api/upload", { method: "POST", body: data });
          const result = await response.json();
          if (!response.ok || !result.url) throw new Error(result.error || "no se pudo subir la fotografía");
          const destination = replaceIndex ?? emptySlots[successful] ?? owner.photos.length + Math.max(0, successful - emptySlots.length);
          setContent(previous => {
            const addPhoto = <T extends { id: string; name: string; photos: RoomPhoto[] }>(item: T): T => {
              if (item.id !== target.id) return item;
              const photos = [...item.photos];
              const position = Math.min(destination, photos.length);
              if (position >= MAX_PHOTOS) return item;
              photos[position] = { url: result.url, alt: photos[position]?.alt || `Fotografía ${position + 1} de ${item.name}` };
              return { ...item, photos };
            };
            return target.kind === "room" ? { ...previous, rooms: previous.rooms.map(addPhoto) } : { ...previous, locations: previous.locations.map(addPhoto) };
          });
          successful++;
        } catch (error) {
          failures.push(`${file.name}: ${error instanceof Error ? error.message : "error al subir"}`);
        }
      }
      const omitted = files.length - selected.length;
      const summary = successful ? `${successful === 1 ? "Una fotografía subida" : `${successful} fotografías subidas`}. Guarda los cambios para publicarlas.` : "No se pudo subir ninguna fotografía.";
      setNotice({ type: failures.length || !successful ? "error" : "success", text: `${summary}${omitted ? ` Se omitieron ${omitted} archivos por el límite de la galería.` : ""}${failures.length ? ` ${failures.slice(0, 3).join("; ")}${failures.length > 3 ? "; revisa también los demás archivos" : ""}.` : ""}` });
    } finally { uploadLock.current = false; setUploading(null); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !status.configured || status.error) return;
    setSaving(true);
    setNotice(null);
    try {
      const submitted: SiteContent = {
        ...content,
        rooms: content.rooms.map(room => ({ ...room, features: room.features.map(value => value.trim()).filter(Boolean) })),
        seo: { ...content.seo, keywords: content.seo.keywords.map(value => value.trim()).filter(Boolean) },
        location: { ...content.location, highlights: content.location.highlights.map(value => value.trim()).filter(Boolean) },
        locations: content.locations.map(location => ({ ...location, amenities: location.amenities.map(value => value.trim()).filter(Boolean) })),
      };
      const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: submitted }) });
      const result = await response.json();
      if (!response.ok) {
        if (Array.isArray(result.issues) && result.issues.length) {
          const path = String(result.issues[0].path || "").replace(/^content\./, "");
          if (path.startsWith("rooms.")) { setSection("rooms"); setSelectedRoomId(content.rooms[Number(path.split(".")[1]) || 0]?.id || content.rooms[0].id); }
          else if (path.startsWith("seo.")) setSection("seo");
          else if (path.startsWith("contact.")) setSection("contact");
          else if (path.startsWith("policies.")) setSection("legal");
          else if (path.startsWith("faq.")) setSection("faq");
          else if (path.startsWith("locations.")) { setSection("locations"); setSelectedLocationId(content.locations[Number(path.split(".")[1]) || 0]?.id || content.locations[0].id); }
          else if (path.startsWith("visitorCountries") || path.startsWith("paymentMethods")) setSection("extras");
          else if (path.startsWith("copy.")) { setSection("copy"); setCopyFilter({ query: "", matches: null }); }
          else setSection("content");
          const fields = [...new Set(result.issues.slice(0, 4).map((issue: { path?: string }) => issueLabel(String(issue.path || ""))))].join("; ");
          throw new Error(`Revisa y completa estos campos: ${fields}. Los enlaces deben usar HTTPS y pertenecer a la plataforma indicada.`);
        }
        throw new Error(result.error || "No pudimos guardar. Tus cambios siguen aquí para que vuelvas a intentarlo.");
      }
      const nextContent: SiteContent = result.content ?? submitted;
      setContent(nextContent);
      setSavedContent(JSON.stringify(nextContent));
      setRemovedRooms([]);
      setLastSaved(new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Santiago" }));
      setNotice({ type: "success", text: "Cambios guardados y publicados. Las propiedades ocultas se mantienen fuera del sitio." });
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Ocurrió un error al guardar." });
    } finally { setSaving(false); }
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand" aria-label="Hostal Piffre, ir al sitio"><img className="admin-brand-logo" src="/brand/logo.webp" alt="Hostal Piffre" width="720" height="906"/><span><small>EL ESPACIO DE TU HOSTAL</small></span></a>
      <p className="admin-sidebar-label">TU SITIO, A TU MANERA</p>
      <nav aria-label="Secciones de administración" className="admin-navigation">{sections.map(item => <button type="button" key={item.id} onClick={() => setSection(item.id)} aria-current={section === item.id ? "page" : undefined} className={section === item.id ? "admin-nav-active" : ""}><AdminIcon name={item.icon}/>{item.label}{section === item.id ? <span className="admin-nav-dot"/> : null}</button>)}</nav>
      <div className="admin-sidebar-bottom">
        <a className="admin-site-link" href="/" target="_blank" rel="noopener noreferrer">Visitar mi sitio<AdminIcon name="external" size={16}/></a>
        <div className="admin-user"><span className="admin-avatar"><img src="/brand/logo.webp" alt="" width="720" height="906"/></span><span><strong>{user.name || "Administración Piffre"}</strong><small>{user.email || "Sesión con Vercel"}</small></span></div>
        <form action={signOutAction}><button className="admin-signout" type="submit"><AdminIcon name="logout" size={16}/>Cerrar sesión</button></form>
      </div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><span>Administración <span className="admin-breadcrumb-divider">/</span> <strong>{currentSection.label}</strong></span><span className="admin-private-label"><span/>Espacio privado</span></header>
      <form onSubmit={save} className="admin-edit-form"><fieldset className="admin-fieldset" disabled={saving}>
        <div className="admin-page-heading"><div><p className="admin-eyebrow">BIENVENIDO A CASA</p><h1>{section === "overview" ? "Todo listo para recibir." : currentSection.label}</h1><p>{currentSection.description}</p></div><a className="admin-button admin-button-outline" href="/" target="_blank" rel="noopener noreferrer">Ver mi sitio<AdminIcon name="external" size={16}/></a></div>
        {!status.configured ? <div className="admin-notice admin-notice-error" role="status"><AdminIcon name="warning"/><div><strong>Falta conectar la base de datos</strong><p>Aún no es posible publicar cambios desde este panel. La edición y las fotos se guardarán cuando se complete la conexión a Supabase.</p></div></div> : status.error ? <div className="admin-notice admin-notice-error" role="alert"><AdminIcon name="warning"/><div><strong>No pudimos cargar los cambios guardados</strong><p>Se muestra el contenido inicial. Recarga antes de editar para evitar reemplazar tus cambios anteriores.</p></div></div> : !status.persisted && !lastSaved ? <div className="admin-notice admin-notice-neutral" role="status"><AdminIcon name="edit"/><div><strong>Tu sitio está listo para personalizar</strong><p>Este es el contenido inicial. Tus cambios se guardarán al pulsar «Guardar y publicar».</p></div></div> : null}
        {notice ? <div ref={feedbackRef} className={`admin-notice admin-notice-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}><AdminIcon name={notice.type === "success" ? "check" : "warning"}/><p>{notice.text}</p><button type="button" aria-label="Cerrar aviso" onClick={() => setNotice(null)}><AdminIcon name="close" size={17}/></button></div> : null}
        {removedRooms.length ? <div className="admin-notice admin-notice-neutral admin-removal-notice" role="status"><AdminIcon name="undo"/><p>{removedRooms.length === 1 ? "Una propiedad retirada" : `${removedRooms.length} propiedades retiradas`} en esta edición. El sitio cambiará al guardar.</p><button type="button" className="admin-text-button" onClick={undoRemoval} disabled={busy}>Deshacer última retirada</button></div> : null}

        {section === "overview" ? <>
          <div className="admin-stat-grid admin-stat-grid-four">
            <div className="admin-stat-card"><span className="admin-stat-icon"><AdminIcon name="bed"/></span><strong>{content.rooms.length}<span>{content.rooms.length === 1 ? "propiedad" : "propiedades"} · {publishedCount} visibles</span></strong><button type="button" onClick={() => setSection("rooms")} aria-label="Editar propiedades"><AdminIcon name="arrow"/></button></div>
            <div className="admin-stat-card"><span className="admin-stat-icon"><AdminIcon name="image"/></span><strong>{photoCount}<span>fotografías · {photoSlotsCount} espacios</span></strong><button type="button" onClick={() => setSection("rooms")} aria-label="Administrar fotos"><AdminIcon name="arrow"/></button></div>
            <div className="admin-stat-card"><span className="admin-stat-icon"><AdminIcon name="external"/></span><strong>{linkCount}<span>de {content.rooms.length * 3} enlaces de plataformas</span></strong><button type="button" onClick={() => setSection("rooms")} aria-label="Editar enlaces de reserva"><AdminIcon name="arrow"/></button></div>
            <div className="admin-stat-card"><span className="admin-stat-icon"><AdminIcon name="question"/></span><strong>{content.faq.length}<span>preguntas frecuentes</span></strong><button type="button" onClick={() => setSection("faq")} aria-label="Editar preguntas frecuentes"><AdminIcon name="arrow"/></button></div>
          </div>
          <section className="admin-welcome-card"><div><span className="admin-welcome-overline">LOS PEQUEÑOS DETALLES IMPORTAN</span><h2>Tu próxima reserva<br/>empieza con una buena foto.</h2><p>Elige tres portadas por propiedad y completa su galería. Conecta tus enlaces de Booking, Airbnb, Vrbo y WhatsApp.</p><button type="button" className="admin-button admin-button-cream" onClick={() => setSection("rooms")}>Preparar mis propiedades<AdminIcon name="arrow" size={18}/></button></div><div className="admin-welcome-illustration" aria-hidden="true"><img className="admin-welcome-logo" src="/brand/logo.webp" alt="" width="720" height="906"/><span className="admin-welcome-caption">HECHO PARA SENTIRSE EN CASA</span></div></section>
          <div className="admin-overview-bottom">
            <Panel title="Tus espacios" description="Cada propiedad tiene su propia personalidad.">{content.rooms.map((room, index) => <button type="button" key={room.id} className="admin-room-shortcut" onClick={() => { setSelectedRoomId(room.id); setSection("rooms"); }}><span className="admin-room-shortcut-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{room.name}</strong><small>{roomStatus(room)} · {room.photos.filter(photo => photo.url).length} fotografías</small></span><AdminIcon name="arrow" size={18}/></button>)}</Panel>
            <Panel title="Antes de recibir visitas" description="Una lista pequeña para una gran bienvenida."><div className="admin-checklist">{[
              { done: content.rooms.every(room => !isRoomVisible(room) || room.photos.slice(0, 3).filter(photo => photo.url).length === 3), label: "Preparar las tres portadas de cada propiedad visible", target: "rooms" as Section },
              { done: linkCount === content.rooms.length * 3, label: "Revisar Booking, Airbnb y Vrbo", target: "rooms" as Section },
              { done: Boolean(content.contact.whatsapp && content.contact.instagram), label: "Revisar WhatsApp e Instagram", target: "contact" as Section },
              { done: content.faq.length > 0, label: "Responder las dudas frecuentes", target: "faq" as Section },
              { done: Boolean(content.seo.title && content.seo.description), label: "Completar la presentación en Google", target: "seo" as Section },
            ].map(item => <button type="button" key={item.label} onClick={() => setSection(item.target)}><span className={item.done ? "admin-check-circle admin-check-done" : "admin-check-circle"}>{item.done ? <AdminIcon name="check" size={13}/> : null}</span>{item.label}<AdminIcon name="arrow" size={15}/></button>)}</div><p className="admin-muted-note">Estas cifras reflejan tu edición actual. Los cambios se publican cuando guardas.</p></Panel>
          </div>
        </> : null}

        {section === "rooms" ? <>
          <Panel title={`Tus propiedades · ${content.rooms.length} de ${MAX_PROPERTIES}`} description="El orden de esta lista será el orden de aparición en la página." aside={<button type="button" className="admin-button admin-button-primary" onClick={addRoom} disabled={busy || content.rooms.length >= MAX_PROPERTIES}><AdminIcon name="plus" size={17}/>Agregar propiedad</button>}>
            <div className="admin-property-list">{content.rooms.map((room, index) => <div key={room.id} className={`admin-property-row ${activeRoom?.id === room.id ? "admin-property-row-active" : ""}`}>
              <button type="button" className="admin-property-select" aria-pressed={activeRoom?.id === room.id} onClick={() => setSelectedRoomId(room.id)}><span className="admin-property-position">{String(index + 1).padStart(2, "0")}</span><span><strong>{room.name}</strong><small>{room.photos.filter(photo => photo.url).length} fotografías · {isRoomVisible(room) ? "Se muestra en el sitio" : room.published ? "Oculta porque su ubicación está oculta" : "Oculta del sitio"}</small></span></button>
              <span className={`admin-status-badge ${isRoomVisible(room) ? "admin-status-visible" : ""}`}>{roomStatus(room)}</span>
              <div className="admin-property-actions"><MoveControls label={room.name} index={index} total={content.rooms.length} disabled={busy} onMove={direction => moveRoom(index, direction)}/><button type="button" className="admin-icon-button" disabled={busy} aria-label={`${room.published ? "Desactivar publicación de" : "Activar publicación de"} ${room.name}`} title={isRoomVisible(room) ? "Ocultar propiedad" : room.published ? "Desactivar publicación de esta propiedad; su ubicación está oculta" : "Activar publicación al guardar"} onClick={() => setRoomVisibility(room, !room.published)}><AdminIcon name={room.published ? "eye" : "eyeOff"} size={17}/></button><button type="button" className="admin-icon-button admin-danger" disabled={busy || content.rooms.length === 1} aria-label={`Retirar ${room.name}`} title={content.rooms.length === 1 ? "Conserva al menos una propiedad" : "Retirar propiedad"} onClick={() => setConfirmation({ kind: "remove", room })}><AdminIcon name="trash" size={16}/></button></div>
            </div>)}</div>
            <p className="admin-muted-note">Las propiedades nuevas empiezan ocultas. Puedes mantener entre 1 y 30 espacios y elegir cuáles mostrar.</p>
          </Panel>
          {activeRoom ? <>
            <Panel title={`Editando: ${activeRoom.name}`} description="Puedes guardar una propiedad oculta y completar su información más adelante." aside={<span className={`admin-status-badge ${isRoomVisible(activeRoom) ? "admin-status-visible" : ""}`}>{roomStatus(activeRoom)}</span>}>
              <div className="admin-fields-grid"><SelectField label="Ubicación de esta propiedad" value={activeRoom.locationId} options={content.locations.map(location => ({ value: location.id, label: location.name }))} onChange={locationId => updateRoom(activeRoom.id, { locationId })}/><SelectField label="Tipo de alojamiento" value={activeRoom.kind} options={[{ value: "room", label: "Habitación" }, { value: "apartment", label: "Departamento" }]} onChange={kind => updateRoom(activeRoom.id, { kind: kind as Room["kind"] })}/></div>
              <div className="admin-fields-grid"><TextField label="Nombre de la propiedad" value={activeRoom.name} onChange={name => updateRoom(activeRoom.id, { name })} required maxLength={100}/><TextField label="Etiqueta breve" value={activeRoom.tag} onChange={tag => updateRoom(activeRoom.id, { tag })} placeholder="Un rincón para descansar" required={activeRoom.published} maxLength={80}/></div>
              <TextField label="Descripción" value={activeRoom.description} onChange={description => updateRoom(activeRoom.id, { description })} multiline required={activeRoom.published} maxLength={1800}/>
              <TextField label="Características" value={activeRoom.features.join(", ")} onChange={value => updateRoom(activeRoom.id, { features: value.split(",").map(item => item.trimStart()) })} hint="Separa cada característica con una coma. Por ejemplo: WiFi, Cocina equipada, Terraza."/>
              <label className="admin-toggle-row"><span><strong>Mostrar esta propiedad en el sitio</strong><small>{activeRoom.published ? isRoomVisible(activeRoom) ? "Aparecerá en la página cuando guardes y publiques." : "Su publicación está activada, pero su ubicación está oculta. Activa también esa ubicación para que se muestre." : "Solo tú la ves en este panel. Actívala cuando esté lista."}</small></span><input type="checkbox" checked={activeRoom.published} onChange={event => setRoomVisibility(activeRoom, event.target.checked)} disabled={busy}/></label>
            </Panel>
            <Panel title="Portadas y galería completa" description="Prepara una primera impresión y deja que tus huéspedes recorran el resto del espacio."><GalleryEditor key={activeRoom.id} photos={activeRoom.photos} ownerName={activeRoom.name} property published={activeRoom.published} disabled={busy || !status.configured || Boolean(status.error)} progress={uploading?.target === `room:${activeRoom.id}` ? uploading : null} onChange={photos => updateGallery({ kind: "room", id: activeRoom.id }, photos)} onUpload={(files, replaceIndex) => void uploadPhotos(files, { kind: "room", id: activeRoom.id }, replaceIndex)}/></Panel>
            <Panel title="De la inspiración a la reserva" description="Cada propiedad tiene cuatro botones de reserva y contacto."><div className="admin-fields-grid"><TextField label="Enlace de Booking" value={activeRoom.bookingUrl} onChange={bookingUrl => updateRoom(activeRoom.id, { bookingUrl })} type="url" placeholder="https://www.booking.com/…"/><TextField label="Enlace de Airbnb" value={activeRoom.airbnbUrl} onChange={airbnbUrl => updateRoom(activeRoom.id, { airbnbUrl })} type="url" placeholder="https://www.airbnb.cl/rooms/…"/></div><div className="admin-fields-grid"><TextField label="Enlace de Vrbo" value={activeRoom.vrboUrl} onChange={vrboUrl => updateRoom(activeRoom.id, { vrboUrl })} type="url" placeholder="https://www.vrbo.com/…"/><TextField label="Enlace de WhatsApp de esta propiedad (opcional)" value={activeRoom.whatsappUrl} onChange={whatsappUrl => updateRoom(activeRoom.id, { whatsappUrl })} type="url" placeholder="https://wa.me/569…" hint="Si lo dejas vacío, el botón usará tu número general con un mensaje que incluye el nombre de esta propiedad."/></div><p className="admin-muted-note">Booking, Airbnb y Vrbo permanecen visibles; sin enlace se muestran desactivados. WhatsApp usa el enlace propio o el contacto general. El mensaje automático se edita en «Textos de la página → Propiedades y reservas».</p></Panel>
          </> : null}
        </> : null}

        {section === "locations" ? <>
          <div className="admin-location-tabs" aria-label="Elegir ubicación">{content.locations.map(location => <button key={location.id} type="button" aria-pressed={activeLocation?.id === location.id} className={activeLocation?.id === location.id ? "admin-location-tab-active" : ""} onClick={() => setSelectedLocationId(location.id)}><AdminIcon name="pin" size={20}/><span><strong>{location.name}</strong><small>{content.rooms.filter(room => room.locationId === location.id).length} propiedades asignadas</small></span></button>)}</div>
          {activeLocation ? <>
            <Panel title={`Presentación de ${activeLocation.name}`} description="Estos datos se usan en la página de esta ubicación y en su presentación en el sitio.">
              <div className="admin-fields-grid"><TextField label="Nombre de la ubicación" value={activeLocation.name} onChange={name => updateLocation(activeLocation.id, { name })} required maxLength={100}/><TextField label="Etiqueta de presentación" value={activeLocation.eyebrow} onChange={eyebrow => updateLocation(activeLocation.id, { eyebrow })} maxLength={150}/></div>
              <div className="admin-fields-grid"><TextField label="Título de la ubicación" value={activeLocation.title} onChange={title => updateLocation(activeLocation.id, { title })} required={activeLocation.published} maxLength={180}/><TextField label="Parte destacada del título" value={activeLocation.titleAccent} onChange={titleAccent => updateLocation(activeLocation.id, { titleAccent })} maxLength={180}/></div>
              <TextField label="Descripción de la ubicación" value={activeLocation.description} onChange={description => updateLocation(activeLocation.id, { description })} multiline required={activeLocation.published} maxLength={4000}/>
              <label className="admin-toggle-row"><span><strong>Mostrar esta ubicación en el sitio</strong><small>Revisa también la visibilidad de las propiedades asignadas cuando hagas un cambio.</small></span><input type="checkbox" checked={activeLocation.published} onChange={event => updateLocation(activeLocation.id, { published: event.target.checked })} disabled={busy}/></label>
            </Panel>
            <Panel title="Dirección e indicaciones" description="Completa solo datos confirmados. Puedes dejar la dirección y el enlace del mapa vacíos si aún no están definidos.">
              <TextField label="Dirección de la ubicación" value={activeLocation.address} onChange={address => updateLocation(activeLocation.id, { address })} maxLength={250}/>
              <div className="admin-fields-grid"><TextField label="Comuna y ciudad" value={activeLocation.city} onChange={city => updateLocation(activeLocation.id, { city })} maxLength={100}/><TextField label="Región" value={activeLocation.region} onChange={region => updateLocation(activeLocation.id, { region })} maxLength={150}/></div>
              <div className="admin-fields-grid"><TextField label="País" value={activeLocation.country} onChange={country => updateLocation(activeLocation.id, { country })} maxLength={100}/><TextField label="Enlace del mapa de esta ubicación" value={activeLocation.mapUrl} onChange={mapUrl => updateLocation(activeLocation.id, { mapUrl })} type="url" placeholder="https://www.google.com/maps/…"/></div>
            </Panel>
            <Panel title="Servicios de esta ubicación" description="Distingue los servicios de cada dirección, incluida la lavandería cuando corresponda.">
              <TextField label="Servicios disponibles" value={activeLocation.amenities.join("\n")} onChange={value => updateLocation(activeLocation.id, { amenities: value.split("\n") })} multiline hint="Un servicio por línea, hasta 20. Por ejemplo: WiFi, Cocina compartida, Lavandería de pago. Indica cualquier costo adicional en el texto."/>
            </Panel>
            <Panel title={`Lugares y servicios cercanos · ${activeLocation.nearby.length} de 20`} description="Ayuda al huésped a conocer el barrio con información comprobada." aside={<button type="button" className="admin-button admin-button-outline" disabled={busy || activeLocation.nearby.length >= 20} onClick={() => updateLocation(activeLocation.id, { nearby: [...activeLocation.nearby, { title: "", description: "" }] })}><AdminIcon name="plus" size={16}/>Agregar lugar</button>}>
              {activeLocation.nearby.length ? activeLocation.nearby.map((nearby, index) => <div className="admin-collection-card" key={`${activeLocation.id}-${index}`}><div className="admin-collection-heading"><span>Lugar {index + 1}</span><div><MoveControls label={`lugar cercano ${index + 1} de ${activeLocation.name}`} index={index} total={activeLocation.nearby.length} disabled={busy} onMove={direction => updateLocation(activeLocation.id, { nearby: moveItem(activeLocation.nearby, index, direction) })}/><button type="button" className="admin-icon-button admin-danger" disabled={busy} aria-label={`Quitar lugar cercano ${index + 1}`} onClick={() => updateLocation(activeLocation.id, { nearby: activeLocation.nearby.filter((_, current) => current !== index) })}><AdminIcon name="trash" size={16}/></button></div></div><div className="admin-fields-grid"><TextField label={`Nombre del lugar ${index + 1}`} value={nearby.title} onChange={title => updateLocation(activeLocation.id, { nearby: activeLocation.nearby.map((item, current) => current === index ? { ...item, title } : item) })} required maxLength={150}/><TextField label={`Descripción del lugar ${index + 1}`} value={nearby.description} onChange={description => updateLocation(activeLocation.id, { nearby: activeLocation.nearby.map((item, current) => current === index ? { ...item, description } : item) })} required maxLength={1200}/></div></div>) : <p className="admin-muted-note">Aún no hay lugares cercanos añadidos para esta ubicación.</p>}
            </Panel>
            <Panel title="Fotografías de la ubicación" description="Muestra los espacios compartidos, el acceso o el entorno de esta dirección."><GalleryEditor key={activeLocation.id} photos={activeLocation.photos} ownerName={activeLocation.name} disabled={busy || !status.configured || Boolean(status.error)} progress={uploading?.target === `location:${activeLocation.id}` ? uploading : null} onChange={photos => updateGallery({ kind: "location", id: activeLocation.id }, photos)} onUpload={(files, replaceIndex) => void uploadPhotos(files, { kind: "location", id: activeLocation.id }, replaceIndex)}/></Panel>
            <Panel title="Visibilidad de esta ubicación en Google" description="Cada ubicación tiene su propio título y descripción para los buscadores.">
              <TextField label="Título SEO de la ubicación" value={activeLocation.seo.title} onChange={title => updateLocation(activeLocation.id, { seo: { ...activeLocation.seo, title } })} required={activeLocation.published} maxLength={160} hint={`${activeLocation.seo.title.length} caracteres. Incluye el nombre y la zona de este alojamiento.`}/>
              <TextField label="Descripción SEO de la ubicación" value={activeLocation.seo.description} onChange={description => updateLocation(activeLocation.id, { seo: { ...activeLocation.seo, description } })} multiline required={activeLocation.published} maxLength={500}/>
            </Panel>
          </> : null}
        </> : null}

        {section === "extras" ? <>
          <Panel title={`Países de nuestros visitantes · ${content.visitorCountries.length} de 50`} description="El orden de la lista define el orden de las banderas en la franja del sitio." aside={<button type="button" className="admin-button admin-button-primary" disabled={busy || content.visitorCountries.length >= 50} onClick={() => editContent(previous => ({ ...previous, visitorCountries: [...previous.visitorCountries, { code: "", name: "" }] }))}><AdminIcon name="plus" size={16}/>Agregar país</button>}>
            <p className="admin-muted-note admin-section-help">Usa el código internacional de dos letras de cada país: CL para Chile, AR para Argentina, BR para Brasil. Cada código debe aparecer una sola vez.</p>
            {content.visitorCountries.map((country, index) => <div className="admin-collection-card admin-country-card" key={index}><div className="admin-collection-heading"><span>País {index + 1}</span><div><MoveControls label={`país ${index + 1}${country.name ? `: ${country.name}` : ""}`} index={index} total={content.visitorCountries.length} disabled={busy} onMove={direction => editContent(previous => ({ ...previous, visitorCountries: moveItem(previous.visitorCountries, index, direction) }))}/><button type="button" className="admin-icon-button admin-danger" disabled={busy} aria-label={`Quitar país ${index + 1}`} onClick={() => editContent(previous => ({ ...previous, visitorCountries: previous.visitorCountries.filter((_, current) => current !== index) }))}><AdminIcon name="trash" size={16}/></button></div></div><div className="admin-fields-grid admin-country-fields"><TextField label={`Código de país ${index + 1}`} value={country.code} onChange={code => editContent(previous => ({ ...previous, visitorCountries: previous.visitorCountries.map((item, current) => current === index ? { ...item, code: code.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2) } : item) }))} required maxLength={2} placeholder="CL"/><TextField label={`Nombre del país ${index + 1}`} value={country.name} onChange={name => editContent(previous => ({ ...previous, visitorCountries: previous.visitorCountries.map((item, current) => current === index ? { ...item, name } : item) }))} required maxLength={100} placeholder="Chile"/></div></div>)}
            {!content.visitorCountries.length ? <p className="admin-muted-note">La franja de países quedará vacía hasta que agregues tu primer país.</p> : null}
          </Panel>
          <Panel title={`Medios de pago · ${content.paymentMethods.length} de 20`} description="Muestra solo los medios que aceptas. Se puede cambiar su orden sin perder la configuración." aside={<button type="button" className="admin-button admin-button-primary" disabled={busy || content.paymentMethods.length >= 20} onClick={() => editContent(previous => ({ ...previous, paymentMethods: [...previous.paymentMethods, { id: `metodo-${crypto.randomUUID()}`, label: "", enabled: false }] }))}><AdminIcon name="plus" size={16}/>Agregar medio</button>}>
            {content.paymentMethods.map((payment, index) => <div className="admin-collection-card" key={index}><div className="admin-collection-heading"><span>Medio de pago {index + 1}</span><div><MoveControls label={`medio de pago ${index + 1}${payment.label ? `: ${payment.label}` : ""}`} index={index} total={content.paymentMethods.length} disabled={busy} onMove={direction => editContent(previous => ({ ...previous, paymentMethods: moveItem(previous.paymentMethods, index, direction) }))}/><button type="button" className="admin-icon-button admin-danger" disabled={busy} aria-label={`Quitar medio de pago ${index + 1}`} onClick={() => editContent(previous => ({ ...previous, paymentMethods: previous.paymentMethods.filter((_, current) => current !== index) }))}><AdminIcon name="trash" size={16}/></button></div></div><TextField label={`Nombre del medio de pago ${index + 1}`} value={payment.label} onChange={label => editContent(previous => ({ ...previous, paymentMethods: previous.paymentMethods.map((item, current) => current === index ? { ...item, label } : item) }))} required maxLength={100} placeholder="Transferencia bancaria"/><label className="admin-toggle-row"><span><strong>Mostrar este medio de pago</strong><small>{payment.enabled ? "Aparecerá en el sitio al guardar." : "Se conserva en el panel y no se muestra a los visitantes."}</small></span><input type="checkbox" checked={payment.enabled} onChange={event => editContent(previous => ({ ...previous, paymentMethods: previous.paymentMethods.map((item, current) => current === index ? { ...item, enabled: event.target.checked } : item) }))}/></label><details className="admin-payment-advanced"><summary>Identificador del medio de pago</summary><TextField label={`Identificador del medio ${index + 1}`} value={payment.id} onChange={id => editContent(previous => ({ ...previous, paymentMethods: previous.paymentMethods.map((item, current) => current === index ? { ...item, id: id.toLowerCase().replace(/[^a-z0-9-]/g, "") } : item) }))} required maxLength={50} hint="Debe ser único y usar letras minúsculas, números o guiones."/></details></div>)}
            {!content.paymentMethods.length ? <p className="admin-muted-note">Todavía no hay medios de pago configurados.</p> : null}
          </Panel>
        </> : null}

        {section === "copy" ? <>
          <Panel title="Cada palabra, a tu manera" description={`${pageCopyFields.length} textos agrupados por sección. Los títulos principales, servicios y datos del alojamiento se editan en «Contenido del sitio».`}>
            <TextField label="Buscar un texto o una sección" value={copyFilter.query} onChange={searchCopy} type="search" placeholder="Por ejemplo: botón, mapa, WhatsApp…"/>
            <p className="admin-muted-note">Puedes usar variables como {"{habitaciones}"}, {"{habitacion}"}, {"{sitio}"} y {"{anio}"} donde se indiquen. Se reemplazan automáticamente en tu página.</p>
          </Panel>
          {copyGroups.length ? copyGroups.map(group => <details key={group.id} className="admin-copy-group" open={Boolean(copyFilter.query.trim())}><summary><span><strong>{group.label}</strong><small>{group.fields.length} textos</small></span><AdminIcon name="plus" size={18}/></summary><div className="admin-copy-body"><p className="admin-copy-description">{group.description}</p>{group.fields.map(field => <TextField key={field.key} label={field.label} value={content.copy[field.key]} onChange={value => updateCopy(field.key, value)} multiline={field.multiline} placeholder={field.defaultValue} maxLength={3000} hint={field.defaultValue.includes("{") ? `Variables disponibles en este texto: ${[...new Set(field.defaultValue.match(/\{[a-zA-Z]+\}/g) || [])].join(", ")}.` : undefined}/>)}<button type="button" className="admin-text-button" onClick={() => update("copy", Object.fromEntries(group.fields.map(field => [field.key, field.defaultValue])))}>{copyFilter.query.trim() ? "Restaurar los textos iniciales que se muestran" : "Restaurar los textos iniciales de esta sección"}</button></div></details>) : <div className="admin-empty-state"><AdminIcon name="search" size={28}/><h2>No encontramos ese texto</h2><p>Prueba con otra palabra o revisa una sección diferente.</p></div>}
        </> : null}

        {section === "faq" ? <Panel title={`Preguntas frecuentes · ${content.faq.length} de ${MAX_FAQ}`} description="Edita las respuestas y cambia su orden. Los cambios se publican al guardar." aside={<button type="button" className="admin-button admin-button-primary" disabled={busy || content.faq.length >= MAX_FAQ} onClick={() => addCollectionItem("faq")}><AdminIcon name="plus" size={17}/>Agregar pregunta</button>}>
          {content.faq.length ? content.faq.map((faq, index) => <div className="admin-collection-card" key={itemKeys.faq[index]}><div className="admin-collection-heading"><span>Pregunta {index + 1}</span><div><MoveControls label={`pregunta ${index + 1}${faq.question ? `: ${faq.question}` : ""}`} index={index} total={content.faq.length} disabled={busy} onMove={direction => moveCollection("faq", index, direction)}/><button type="button" className="admin-icon-button admin-danger" disabled={busy} aria-label={`Quitar pregunta ${index + 1}${faq.question ? `: ${faq.question}` : ""}`} title="Quitar pregunta" onClick={() => removeCollectionItem("faq", index)}><AdminIcon name="trash" size={16}/></button></div></div><TextField label={`Pregunta ${index + 1}`} value={faq.question} onChange={question => editContent(previous => ({ ...previous, faq: previous.faq.map((item, current) => current === index ? { ...item, question } : item) }))} required maxLength={250}/><TextField label={`Respuesta a la pregunta ${index + 1}`} value={faq.answer} onChange={answer => editContent(previous => ({ ...previous, faq: previous.faq.map((item, current) => current === index ? { ...item, answer } : item) }))} multiline required maxLength={1500}/></div>) : <div className="admin-empty-state"><AdminIcon name="question" size={30}/><h2>Una buena respuesta abre puertas</h2><p>Agrega tu primera pregunta para ayudar a tus futuros huéspedes.</p></div>}
          <p className="admin-muted-note">Puedes añadir hasta 20 preguntas. Los títulos y la introducción de esta sección se editan en «Textos de la página».</p>
        </Panel> : null}

        {section === "seo" ? <>
          <Panel title="Así te encontrarán en Google" description="Una presentación clara, local y escrita para personas."><TextField label="Título del sitio" value={content.seo.title} onChange={title => update("seo", { title })} hint={`${content.seo.title.length} caracteres. Como referencia, intenta usar entre 50 y 60.`} required maxLength={160}/><TextField label="Descripción para buscadores" value={content.seo.description} onChange={description => update("seo", { description })} multiline hint={`${content.seo.description.length} caracteres. Describe tu alojamiento y ubicación de forma natural.`} required maxLength={500}/><div className="admin-search-preview"><span>VISTA PREVIA ORIENTATIVA</span><p className="admin-search-url">{content.seo.siteUrl || "https://alojamientospiffre.cl"}</p><p className="admin-search-title">{content.seo.title || "Nombre de tu sitio"}</p><p className="admin-search-description">{content.seo.description || "Agrega una descripción para tus futuros huéspedes."}</p></div><p className="admin-muted-note">Google puede adaptar el título y la descripción de sus resultados. Los cambios pueden tardar en reflejarse.</p></Panel>
          <Panel title="Configuración de visibilidad" description="Estos datos ayudan a identificar y compartir tu sitio."><TextField label="Dirección principal del sitio (URL canónica)" value={content.seo.siteUrl} onChange={siteUrl => update("seo", { siteUrl })} type="url" required/><TextField label="Palabras clave de referencia" value={content.seo.keywords.join(", ")} onChange={value => update("seo", { keywords: value.split(",").map(item => item.trimStart()) })} hint="Separadas por comas. Sirven como guía editorial; no garantizan posiciones en Google."/><TextField label="Imagen al compartir el sitio" value={content.seo.ogImage} onChange={ogImage => update("seo", { ogImage })} placeholder="https://…" hint="URL pública o ruta del sitio (por ejemplo, /og-image.png). Idealmente de 1200 × 630 píxeles."/><label className="admin-toggle-row"><span><strong>Permitir que Google indexe el sitio</strong><small>Desactívalo solo si necesitas ocultar el sitio de los buscadores.</small></span><input type="checkbox" checked={content.seo.robotsIndex} onChange={event => update("seo", { robotsIndex: event.target.checked })}/></label></Panel>
          <Panel title="Google Search Console y Tag Manager" description="Completa estos campos cuando tengas tus cuentas y códigos preparados."><TextField label="Código de verificación de Google Search Console" value={content.seo.googleSiteVerification} onChange={googleSiteVerification => update("seo", { googleSiteVerification })} maxLength={200} placeholder="Código de la etiqueta de verificación" hint="Pega solo el valor del atributo content de la etiqueta google-site-verification, sin las comillas ni el HTML."/><TextField label="Identificador de Google Tag Manager" value={content.seo.gtmId} onChange={gtmId => update("seo", { gtmId: gtmId.toUpperCase().trim() })} placeholder="GTM-XXXXXXX" hint="Puedes dejarlo vacío. Publica únicamente el contenedor y las etiquetas que hayas revisado para este sitio."/></Panel>
        </> : null}

        {section === "contact" ? <>
          <Panel title="Una conversación, una nueva estadía" description="El botón flotante y el contacto general usarán este número."><div className="admin-fields-grid"><TextField label="Número de WhatsApp" value={content.contact.whatsapp} onChange={whatsapp => update("contact", { whatsapp: whatsapp.replace(/\D/g, "") })} type="tel" hint="Incluye el código de país, sin + ni espacios. Por ejemplo: 56954933261." required/><TextField label="Correo electrónico" value={content.contact.email} onChange={email => update("contact", { email })} type="email" required/></div><TextField label="Mensaje inicial de WhatsApp" value={content.contact.whatsappMessage} onChange={whatsappMessage => update("contact", { whatsappMessage })} multiline hint="Es el mensaje que verá el huésped al abrir el contacto general de WhatsApp."/><TextField label="Perfil de Instagram" value={content.contact.instagram} onChange={instagram => update("contact", { instagram })} type="url" placeholder="https://www.instagram.com/…"/></Panel>
          <Panel title="Que llegar sea fácil" description="Esta dirección también ayuda al posicionamiento local del alojamiento."><TextField label="Dirección" value={content.contact.address} onChange={address => update("contact", { address })}/><div className="admin-fields-grid"><TextField label="Comuna y ciudad" value={content.contact.city} onChange={city => update("contact", { city })}/><TextField label="Región" value={content.contact.region} onChange={region => update("contact", { region })}/></div><div className="admin-fields-grid"><TextField label="País" value={content.contact.country} onChange={country => update("contact", { country })}/><TextField label="Enlace de Google Maps" value={content.contact.mapUrl} onChange={mapUrl => update("contact", { mapUrl })} type="url"/></div></Panel>
        </> : null}

        {section === "content" ? <>
          <Panel title="El nombre y la bienvenida" description="Las palabras con las que comienza la experiencia Piffre."><div className="admin-fields-grid"><TextField label="Nombre del alojamiento" value={content.site.name} onChange={name => update("site", { name })} required/><TextField label="Frase de marca" value={content.site.tagline} onChange={tagline => update("site", { tagline })}/></div><TextField label="Descripción general del alojamiento" value={content.site.description} onChange={description => update("site", { description })} multiline/><TextField label="Texto pequeño de portada" value={content.hero.eyebrow} onChange={eyebrow => update("hero", { eyebrow })}/><div className="admin-fields-grid"><TextField label="Título principal" value={content.hero.title} onChange={title => update("hero", { title })}/><TextField label="Parte destacada del título" value={content.hero.titleAccent} onChange={titleAccent => update("hero", { titleAccent })}/></div><TextField label="Texto de portada" value={content.hero.description} onChange={description => update("hero", { description })} multiline/></Panel>
          <Panel title="La historia del alojamiento"><TextField label="Título de presentación" value={content.about.title} onChange={title => update("about", { title })}/><TextField label="Descripción" value={content.about.text} onChange={text => update("about", { text })} multiline/></Panel>
          <Panel title={`Comodidades y servicios · ${content.amenities.length} de ${MAX_AMENITIES}`} description="Publica solo los servicios que efectivamente ofreces." aside={<button type="button" className="admin-button admin-button-outline" disabled={busy || content.amenities.length >= MAX_AMENITIES} onClick={() => addCollectionItem("amenities")}><AdminIcon name="plus" size={17}/>Agregar servicio</button>}>
            {content.amenities.length ? content.amenities.map((amenity, index) => <div className="admin-collection-card" key={itemKeys.amenities[index]}><div className="admin-collection-heading"><span>Servicio {index + 1}</span><div><MoveControls label={`servicio ${index + 1}${amenity.title ? `: ${amenity.title}` : ""}`} index={index} total={content.amenities.length} disabled={busy} onMove={direction => moveCollection("amenities", index, direction)}/><button type="button" className="admin-icon-button admin-danger" disabled={busy} aria-label={`Quitar servicio ${index + 1}`} onClick={() => removeCollectionItem("amenities", index)}><AdminIcon name="trash" size={16}/></button></div></div><div className="admin-fields-grid"><TextField label={`Nombre del servicio ${index + 1}`} value={amenity.title} onChange={title => editContent(previous => ({ ...previous, amenities: previous.amenities.map((item, current) => current === index ? { ...item, title } : item) }))} required maxLength={100}/><TextField label={`Descripción del servicio ${index + 1}`} value={amenity.description} onChange={description => editContent(previous => ({ ...previous, amenities: previous.amenities.map((item, current) => current === index ? { ...item, description } : item) }))} required maxLength={500}/></div></div>) : <p className="admin-muted-note">Todavía no agregaste servicios. Puedes comenzar con los que tus huéspedes más valoran.</p>}
          </Panel>
          <Panel title="El barrio también es parte del viaje"><TextField label="Título de ubicación" value={content.location.title} onChange={title => update("location", { title })}/><TextField label="Descripción del entorno" value={content.location.description} onChange={description => update("location", { description })} multiline/><TextField label="Puntos destacados" value={content.location.highlights.join("\n")} onChange={value => update("location", { highlights: value.split("\n") })} multiline hint="Escribe un punto por línea. Puedes agregar hasta 12."/></Panel>
        </> : null}

        {section === "legal" ? <>
          <div className="admin-notice admin-notice-neutral"><AdminIcon name="document"/><p>Los textos iniciales son un borrador. Revisa que reflejen las prácticas, las condiciones y los datos reales de tu alojamiento antes de publicarlos.</p></div>
          <Panel title="Política de privacidad" description="Explica qué datos recibes y cómo los utilizas."><TextField label="Título de la página" value={content.policies.privacyTitle} onChange={privacyTitle => update("policies", { privacyTitle })}/><TextField label="Contenido de privacidad" value={content.policies.privacy} onChange={privacy => update("policies", { privacy })} multiline hint="Usa párrafos separados por una línea en blanco."/></Panel>
          <Panel title="Términos y condiciones" description="La información importante para acordar una estadía."><TextField label="Título de la página" value={content.policies.termsTitle} onChange={termsTitle => update("policies", { termsTitle })}/><TextField label="Contenido de términos" value={content.policies.terms} onChange={terms => update("policies", { terms })} multiline hint="Confirma horarios, cancelaciones, pagos y condiciones con el anfitrión."/><TextField label="Fecha de última actualización" value={content.policies.updatedAt} onChange={updatedAt => update("policies", { updatedAt })} type="date"/></Panel>
        </> : null}

        <footer className="admin-savebar"><div><span className={dirty ? "admin-save-indicator admin-save-dirty" : "admin-save-indicator"}/><span>{!status.configured ? "Publicación pendiente de conexión" : status.error ? "Revisa la conexión de tu sitio" : saving ? "Publicando tus cambios…" : dirty ? "Tienes cambios sin guardar" : lastSaved ? `Último guardado a las ${lastSaved}` : !status.persisted ? "Contenido inicial por personalizar" : "Tu contenido está al día"}<small>Se guardan los cambios de todas las secciones.</small></span></div><div className="admin-save-actions">{dirty ? <button type="button" className="admin-text-button" disabled={busy} onClick={() => setConfirmation({ kind: "discard" })}>Descartar cambios</button> : null}<button className="admin-button admin-button-primary" type="submit" disabled={!dirty || busy || !status.configured || Boolean(status.error)}><AdminIcon name="save" size={18}/>{saving ? "Guardando…" : uploading ? "Subiendo foto…" : "Guardar y publicar"}</button></div></footer>
      </fieldset></form>
      <div className="admin-footer-note">Hecho con cariño para Hostal Piffre <span>Providencia, Santiago</span></div>
      {confirmation ? <ConfirmDialog confirmation={confirmation} onCancel={() => setConfirmation(null)} onConfirm={confirmChange}/> : null}
    </main>
  </div>;
}
