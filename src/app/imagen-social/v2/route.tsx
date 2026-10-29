import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getContent } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [content, logo] = await Promise.all([getContent(), readFile(join(process.cwd(), "public/brand/logo-social.png"))]);
  const locations = content.locations.filter((location) => location.published).slice(0, 2);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f8f6eb", color: "#203c29", padding: "48px 60px", alignItems: "center", gap: 55 }}>
      <div style={{ display: "flex", width: 290, flexShrink: 0, alignItems: "center", justifyContent: "center" }}>
        {/* The exact official logo, with its original lettering and proportions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={280} height={352} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "center" }}>
        <div style={{ fontSize: 20, letterSpacing: 3, color: "#65715f", marginBottom: 18 }}>{content.site.name.toUpperCase()}</div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.12, marginBottom: 30 }}>{content.site.tagline}</div>
        {locations.map((location) => <div key={location.id} style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #bec7ac", paddingTop: 17, marginBottom: 18 }}>
          <div style={{ fontSize: 25, fontWeight: 700, marginBottom: 5 }}>{location.name}</div>
          <div style={{ fontSize: 23, lineHeight: 1.35 }}>{location.address}</div>
        </div>)}
        <div style={{ fontSize: 19, color: "#65715f", marginTop: 8 }}>{new URL(content.seo.siteUrl).hostname}</div>
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
