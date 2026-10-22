import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { defaultContent } from "./defaults";
import { siteContentSchema } from "./validation";
import type { ContentStatus, SiteContent } from "./types";

export const ROOM_IMAGES_BUCKET = "room-images";
export const contentConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SECRET_KEY);

function supabaseClient(key: string) {
  return createClient(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal || AbortSignal.timeout(8000) }) },
  });
}

/** Privileged client: importable only in server code. Call after authorization. */
export function getSupabaseAdmin() {
  if (!contentConfigured) throw new Error("Falta completar la conexión con Supabase.");
  return supabaseClient(process.env.SUPABASE_SECRET_KEY!);
}

const readContent = cache(async (): Promise<{ content: SiteContent; status: ContentStatus }> => {
  const fallback = structuredClone(defaultContent);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    return { content: fallback, status: { configured: false, persisted: false } };
  }
  try {
    const db = supabaseClient(process.env.SUPABASE_PUBLISHABLE_KEY);
    const { data, error } = await db.from("site_content").select("content,updated_at").eq("id", "main").maybeSingle();
    if (error || !data) throw new Error("El contenido aún no está disponible en Supabase.");
    const parsed = siteContentSchema.safeParse(data.content);
    if (!parsed.success) throw new Error("El contenido guardado necesita revisión.");
    return { content: parsed.data, status: { configured: contentConfigured, persisted: true, updatedAt: data.updated_at } };
  } catch {
    // The public site remains available if the content service is unavailable.
    // The administration displays the failure and never reports a save as successful.
    return { content: fallback, status: { configured: contentConfigured, persisted: false, error: "No se pudo leer el contenido guardado. Revisa la conexión y la tabla site_content." } };
  }
});

export async function getSiteContent(): Promise<SiteContent> {
  return (await readContent()).content;
}

export const getContent = getSiteContent;

export async function getContentStatus(): Promise<ContentStatus> {
  return (await readContent()).status;
}

/** API routes must check both administrator identity and same-origin first. */
export async function saveSiteContent(content: SiteContent): Promise<string> {
  const validated = siteContentSchema.parse(content);
  const updatedAt = new Date().toISOString();
  const db = getSupabaseAdmin();
  const { error } = await db.from("site_content").upsert({ id: "main", content: validated, updated_at: updatedAt }, { onConflict: "id" });
  if (error) throw new Error("No se pudieron guardar los cambios en Supabase.");
  return updatedAt;
}
