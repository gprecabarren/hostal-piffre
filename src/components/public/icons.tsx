import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: "arrow" | "arrowUp" | "pin" | "wifi" | "sun" | "leaf" | "heart" | "instagram" | "whatsapp" | "booking" | "airbnb" | "vrbo" | "images" | "washer" | "pause" | "play" | "globe" | "plus" | "chevron" | "menu" | "close" };

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
    booking: <><rect x="1" y="1" width="22" height="22" rx="4" fill="#003b95" stroke="none" /><path d="M6 5h5.2c3 0 4.5 1.3 4.5 3.5 0 1.4-.7 2.4-1.8 2.9 1.6.4 2.5 1.5 2.5 3.1 0 2.6-1.8 4.1-5 4.1H6V5Zm3 2.5v2.9h2c1.2 0 1.8-.5 1.8-1.5s-.6-1.4-1.8-1.4H9Zm0 5.3v3.3h2.2c1.5 0 2.2-.5 2.2-1.7 0-1.1-.7-1.6-2.2-1.6H9Z" fill="white" fillRule="evenodd" stroke="none" /><circle cx="18.9" cy="17.1" r="1.7" fill="#00a9e0" stroke="none" /></>,
    airbnb: <><path d="M12 3c-1.3 0-2 1.2-2.6 2.5L3.8 17c-1.1 2.2 0 4 1.9 4 2.4 0 4.7-2.8 6.3-5.2 1.6 2.4 3.9 5.2 6.3 5.2 1.9 0 3-1.8 1.9-4L14.6 5.5C14 4.2 13.3 3 12 3Z" stroke="#ff385c" strokeWidth="1.7" /><path d="M12 15.8c-2.7-3.3-3.7-6.1 0-6.1s2.7 2.8 0 6.1Z" stroke="#ff385c" strokeWidth="1.7" /></>,
    plus: <path d="M5 12h14M12 5v14" />,
    vrbo: <><path d="m3 4 8.8 16L21 4h-4.2l-5 9.1L7 4H3Z" fill="#1d5686" stroke="none" /><path d="m7 4 4.8 9.1 2.1-3.8L11 4H7Z" fill="#76bed8" stroke="none" /></>,
    images: <><rect x="3" y="5" width="16" height="16" rx="2" /><path d="M7 2h13a2 2 0 0 1 2 2v13M3 17l5-5 4 4 3-3 4 4" /><circle cx="14" cy="10" r="1.5" /></>,
    washer: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M4 7h16M7 4.5h.1M10 4.5h.1" /><circle cx="12" cy="14" r="4.5" /><path d="M8 14c3-2 5 2 8 0" /></>,
    pause: <><path d="M8 5v14M16 5v14" strokeWidth="3" /></>,
    play: <path d="m8 4 12 8-12 8V4Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7h14M5 17h14" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    menu: <path d="M4 8h16M4 16h16" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
