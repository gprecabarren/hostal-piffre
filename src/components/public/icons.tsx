import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: "arrow" | "arrowUp" | "pin" | "wifi" | "sun" | "leaf" | "heart" | "instagram" | "whatsapp" | "plus" | "chevron" | "menu" | "close" };

export function Icon({ name, ...props }: IconProps) {
  const paths = {
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    arrowUp: <><path d="M5 19 19 5M5 5h14v14" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    wifi: <><path d="M2 8a16 16 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" /><circle cx="12" cy="20" r=".6" fill="currentColor" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4m0-15.6-1.4 1.4M5.6 18.4l-1.4 1.4" /></>,
    leaf: <><path d="M19 3C10 2 3 6 4 13c.8 5 6 7 10 4 5-3 5-9 5-14ZM3 22c1-7 5-12 11-15" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" /></>,
    whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z" /><path d="m8.1 7.5 1.4 2.4-1 1.1a7.5 7.5 0 0 0 3.8 3.7l1.1-1 2.4 1.4c-.6 2.8-3.5 2.1-6.3-.3s-4.1-5.9-1.4-7.3Z" /></>,
    plus: <path d="M5 12h14M12 5v14" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    menu: <path d="M4 8h16M4 16h16" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
