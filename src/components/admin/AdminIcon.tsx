import type { CSSProperties } from "react";

export type AdminIconName = "home" | "bed" | "search" | "phone" | "edit" | "document" | "arrow" | "external" | "check" | "image" | "upload" | "save" | "logout" | "warning" | "plus" | "close";

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
};

export function AdminIcon({ name, size = 20, style }: { name: AdminIconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}
