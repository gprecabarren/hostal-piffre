"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { PageCopy } from "@/lib/copy";
import { contactChannel, isPublicAnalyticsPath } from "@/lib/analytics";
import "./analytics.css";

type Choice = "accepted" | "rejected";
type AnalyticsWindow = Window & { dataLayer?: unknown[] };
const CONSENT_KEY = "piffre-analytics-consent-v1";
const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;

function dataLayer() {
  const target = window as AnalyticsWindow;
  target.dataLayer ||= [];
  return target.dataLayer;
}

function consentCommand(action: "default" | "update", choice: Choice) {
  // gtag commands must use the Arguments shape expected by the Google tag.
  function command(..._values: unknown[]) { dataLayer().push(arguments); }
  command("consent", action, {
    analytics_storage: choice === "accepted" ? "granted" : "denied",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
}

export default function SiteAnalytics({ gtmId, copy, enabled, locationSlugs }: { gtmId: string; copy: PageCopy; enabled: boolean; locationSlugs: readonly string[] }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const containerStarted = useRef(false);
  const active = enabled && /^GTM-[A-Z0-9]+$/.test(gtmId) && isPublicAnalyticsPath(pathname, locationSlugs);

  useEffect(() => {
    if (!active) {
      if (containerStarted.current) window.location.reload();
      return;
    }
    consentCommand("default", "rejected");
    try {
      const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
      if (stored?.expiresAt > Date.now() && (stored.choice === "accepted" || stored.choice === "rejected")) setChoice(stored.choice);
    } catch { /* Without storage, keep the choice only for this visit. */ }
    setReady(true);
  }, [active]);

  useEffect(() => {
    if (!active || choice !== "accepted") return;
    consentCommand("update", "accepted");
    if (!containerStarted.current) {
      dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });
      containerStarted.current = true;
    }
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor) return;
      const channel = contactChannel(anchor.href);
      if (!channel) return;
      const room = anchor.closest<HTMLElement>("[data-room-id]");
      dataLayer().push({
        event: "contact_click", contact_channel: channel,
        room_id: room?.dataset.roomId || "general",
        room_name: room?.dataset.roomName || "Consulta general",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [active, choice]);

  function choose(next: Choice) {
    const revoke = choice === "accepted" && next === "rejected";
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice: next, expiresAt: Date.now() + SIX_MONTHS })); } catch { /* Optional persistence. */ }
    consentCommand("update", next);
    setChoice(next);
    setPreferencesOpen(false);
    if (revoke) {
      // Remove analytics cookies and fully unload the already-running container.
      for (const item of document.cookie.split(";")) {
        const key = item.trim().split("=")[0];
        if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(key)) continue;
        document.cookie = `${key}=; Max-Age=0; Path=/; SameSite=Lax`;
        for (const domain of [location.hostname, `.${location.hostname}`]) document.cookie = `${key}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
      }
      window.location.reload();
    }
  }

  if (!active || !ready) return null;
  return <>
    {choice === "accepted" ? <Script id="piffre-google-tag-manager" src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} strategy="afterInteractive" /> : null}
    {choice === null || preferencesOpen ? <section className="privacy-choice" role="region" aria-labelledby="privacy-choice-title">
      <div><h2 id="privacy-choice-title">{copy.consentTitle}</h2><p>{copy.consentMessage} <Link href="/politica-de-privacidad">{copy.footerPrivacy}</Link>.</p></div>
      <div className="privacy-choice-actions"><button type="button" onClick={() => choose("rejected")}>{copy.consentReject}</button><button type="button" onClick={() => choose("accepted")}>{copy.consentAccept}</button></div>
    </section> : <button type="button" className="privacy-preferences" onClick={() => setPreferencesOpen(true)}>{copy.consentPreferences}</button>}
  </>;
}
