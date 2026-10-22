import type { CSSProperties } from "react";

export type AdminIconName = "home" | "bed" | "search" | "phone" | "edit" | "document" | "arrow" | "external" | "check" | "image" | "upload" | "save" | "logout" | "warning" | "plus" | "close" | "up" | "down" | "trash" | "undo" | "eye" | "eyeOff" | "question";

const paths: Record<AdminIconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/></>,
  bed: <><path d="M3 18V6m18 12V9a2 2 0 0 0-2-2H9v8H3m0 0h18M3 21v-3m18 3v-3"/><path d="M6 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></>,
  search: <><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></>,
  phone: <><path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z"/><path d="m9 7-1 2c.5 3 2 4.5 5 5l2-1-2-2-1 1-2-2 1-1Z"/></>,
  edit: <><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z"/></>,
  document: <><path d="M14 3H5v18h14V8Z"/><path d="M14 3v5h5M8 12h8m-8 4h8"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  external: <><path d="M14 3h7v7m0-7L10 14"/><path d="M10 3H3v18h18v-7"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
  upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/></>,
  logout: <><path d="M9 21H3V3h6m7 4 5 5-5 5m-9-5h14"/></>,
  warning: <><path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3h.01"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  up: <><path d="M12 20V4m-6 6 6-6 6 6"/></>,
  down: <><path d="M12 4v16m-6-6 6 6 6-6"/></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></>,
  undo: <><path d="M3 10h11a7 7 0 0 1 0 14M3 10l6-6m-6 6 6 6" transform="translate(0 -2)"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="m3 3 18 18M10.5 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3.1 4.1M6.1 6.1A21 21 0 0 0 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3M10 10a2.8 2.8 0 0 0 4 4"/></>,
  question: <><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/></>,
};

export function AdminIcon({ name, size = 20, style }: { name: AdminIconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}
