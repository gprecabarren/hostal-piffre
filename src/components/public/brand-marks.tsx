import type { ReactNode } from "react";

export function CountryFlag({ code }: { code: string }) {
  const horizontal = (top: string, middle: string, bottom: string) => <><path fill={top} d="M0 0h30v6.7H0z" /><path fill={middle} d="M0 6.7h30v6.6H0z" /><path fill={bottom} d="M0 13.3h30V20H0z" /></>;
  const vertical = (left: string, middle: string, right: string) => <><path fill={left} d="M0 0h10v20H0z" /><path fill={middle} d="M10 0h10v20H10z" /><path fill={right} d="M20 0h10v20H20z" /></>;
  const star = (x: number, y: number, color = "white") => <path fill={color} d="m0-3 .8 2.1H3L1.2.5 1.9 3 0 1.5-1.9 3l.7-2.5L-3-.9h2.2L0-3Z" transform={`translate(${x} ${y})`} />;
  const flags: Record<string, ReactNode> = {
    CL: <><path fill="white" d="M0 0h30v10H0z" /><path fill="#d52b1e" d="M0 10h30v10H0z" /><path fill="#0039a6" d="M0 0h10v10H0z" />{star(5, 5)}</>,
    AR: <>{horizontal("#74acdf", "white", "#74acdf")}<circle cx="15" cy="10" r="2" fill="#e7ad29" /></>,
    BO: horizontal("#d52b1e", "#f9e300", "#007934"),
    CO: <><path fill="#fcd116" d="M0 0h30v10H0z" /><path fill="#003893" d="M0 10h30v5H0z" /><path fill="#ce1126" d="M0 15h30v5H0z" /></>,
    EC: <><path fill="#ffdd00" d="M0 0h30v10H0z" /><path fill="#034ea2" d="M0 10h30v5H0z" /><path fill="#ed1c24" d="M0 15h30v5H0z" /><ellipse cx="15" cy="10" rx="1.4" ry="2.5" fill="#80632b" /></>,
    PE: vertical("#d91023", "white", "#d91023"),
    PY: <>{horizontal("#d52b1e", "white", "#0038a8")}<circle cx="15" cy="10" r="1.4" fill="#dcaf37" /></>,
    VE: <>{horizontal("#ffcc00", "#00247d", "#cf142b")}<path d="M10 11q5-6 10 0" stroke="white" strokeWidth="1.2" strokeDasharray="1 1.4" fill="none" /></>,
    BR: <><path fill="#009739" d="M0 0h30v20H0z" /><path fill="#ffdf00" d="m15 2 12 8-12 8L3 10 15 2Z" /><circle cx="15" cy="10" r="5" fill="#002776" /><path d="M10 8q5-1 10 4" stroke="white" strokeWidth="1.2" fill="none" /></>,
    UY: <><path fill="white" d="M0 0h30v20H0z" /><path stroke="#0038a8" strokeWidth="2.2" d="M0 4.4h30M0 8.8h30M0 13.2h30M0 17.6h30" /><path fill="white" d="M0 0h12v11H0z" /><circle cx="6" cy="5.5" r="2.5" fill="#f5b335" /></>,
    ES: <><path fill="#aa151b" d="M0 0h30v20H0z" /><path fill="#f1bf00" d="M0 5h30v10H0z" /><path fill="#a52935" d="M8 8h3v5H8z" /></>,
    FR: vertical("#002395", "white", "#ed2939"), IT: vertical("#009246", "white", "#ce2b37"), DE: horizontal("#111111", "#dd0000", "#ffce00"),
    NL: horizontal("#ae1c28", "white", "#21468b"), RU: horizontal("white", "#0039a6", "#d52b1e"), BE: vertical("#111111", "#fdda24", "#ef3340"),
    MX: <>{vertical("#006847", "white", "#ce1126")}<circle cx="15" cy="10" r="1.7" fill="#846333" /></>,
    CA: <>{vertical("#d80621", "white", "#d80621")}<path fill="#d80621" d="m15 4 1 3 2-1-.5 3 2 1-3 2-.5 3h-2l-.5-3-3-2 2-1-.5-3 2 1 1-3Z" /></>,
    US: <><path fill="white" d="M0 0h30v20H0z" /><path d="M0 1h30M0 4h30M0 7h30M0 10h30M0 13h30M0 16h30M0 19h30" stroke="#b31942" strokeWidth="1.5" /><path fill="#0a3161" d="M0 0h13v10H0z" /><path d="M2 2h.1M6 2h.1M10 2h.1M4 5h.1M8 5h.1M2 8h.1M6 8h.1M10 8h.1" stroke="white" strokeWidth="1.4" /></>,
    GB: <><path fill="#012169" d="M0 0h30v20H0z" /><path stroke="white" strokeWidth="5" d="m0 0 30 20M30 0 0 20" /><path stroke="#c8102e" strokeWidth="2" d="m0 0 30 20M30 0 0 20" /><path stroke="white" strokeWidth="7" d="M15 0v20M0 10h30" /><path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" /></>,
    JP: <><path fill="white" d="M0 0h30v20H0z" /><circle cx="15" cy="10" r="5" fill="#bc002d" /></>,
    CN: <><path fill="#ee1c25" d="M0 0h30v20H0z" />{star(6, 6, "#ffff00")}</>,
  };
  const design = flags[code];
  return design ? <svg className="country-flag" viewBox="0 0 30 20" aria-hidden="true">{design}</svg> : <span className="country-emoji" aria-hidden="true">{Array.from(code).map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("")}</span>;
}

export function PaymentMark({ id, label }: { id: string; label: string }) {
  const key = id.toLowerCase().replace(/[^a-z]/g, "");
  if (key.includes("paypal")) return <svg className="payment-mark payment-mark--wide" viewBox="0 0 108 38" aria-hidden="true"><text x="4" y="27" fill="#003087" fontSize="25" fontStyle="italic" fontWeight="800" fontFamily="Arial,sans-serif">Pay<tspan fill="#009cde">Pal</tspan></text></svg>;
  if (key.includes("wise")) return <svg className="payment-mark payment-mark--wide" viewBox="0 0 108 38" aria-hidden="true"><path fill="#163300" d="M3 6h23l-4 7H10l-4 7h11L8 33H0l9-13H0l8-14Z"/><text x="30" y="28" fill="#163300" fontSize="29" fontStyle="italic" fontWeight="800" fontFamily="Arial,sans-serif">wise</text></svg>;
  if (key.includes("master") || key === "maestro") return <svg className="payment-mark" viewBox="0 0 70 38" aria-hidden="true"><circle cx="25" cy="19" r="15" fill={key === "maestro" ? "#e52335" : "#eb001b"} /><circle cx="45" cy="19" r="15" fill={key === "maestro" ? "#009ddd" : "#f79e1b"} fillOpacity=".9" /></svg>;
  if (key.includes("amex") || key.includes("american")) return <svg className="payment-mark" viewBox="0 0 70 38" aria-hidden="true"><rect x="7" y="1" width="56" height="36" rx="3" fill="#176fba" /><text x="35" y="25" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="Arial,sans-serif">AMEX</text></svg>;
  if (key.includes("visa")) return <svg className="payment-mark" viewBox="0 0 70 38" aria-hidden="true"><text x="35" y="28" textAnchor="middle" fill="#173b80" fontSize="28" fontStyle="italic" fontWeight="800" fontFamily="Arial,sans-serif">VISA</text></svg>;
  if (key.includes("webpay")) return <svg className="payment-mark payment-mark--wide" viewBox="0 0 94 38" aria-hidden="true"><rect x="2" y="8" width="20" height="20" rx="5" fill="#d62582" /><path d="m6 14 5 8 7-8" fill="none" stroke="white" strokeWidth="2.5" /><text x="27" y="25" fill="#5b226e" fontSize="18" fontWeight="750" fontFamily="Arial,sans-serif">webpay</text></svg>;
  if (key.includes("mercado")) return <svg className="payment-mark payment-mark--wide" viewBox="0 0 108 38" aria-hidden="true"><ellipse cx="19" cy="18" rx="16" ry="12" fill="#00b1ea" stroke="#233d70" /><path d="m8 18 7-5 7 2 6 5-6 5-8-5-3 1" fill="white" stroke="#233d70" strokeWidth="1.3" /><text x="40" y="16" fill="#233d70" fontSize="13" fontWeight="750" fontFamily="Arial,sans-serif">mercado</text><text x="40" y="30" fill="#233d70" fontSize="13" fontWeight="750" fontFamily="Arial,sans-serif">pago</text></svg>;
  return <span className="payment-mark-text" aria-hidden="true">{label}</span>;
}
