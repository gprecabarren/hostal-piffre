import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { auth, isAdminSession } from "@/lib/auth";
import { getSupabaseAdmin, ROOM_IMAGES_BUCKET } from "@/lib/content";
import { isSameOrigin } from "@/lib/validation";

export const runtime = "nodejs";
// Leave room for multipart overhead below Vercel's function request-body limit.
const MAX_BYTES = 4 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedFormats = new Set(["jpeg", "png", "webp"]);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "La solicitud debe provenir de este sitio." }, { status: 403 });
  if (!isAdminSession(await auth())) return Response.json({ error: "Inicia sesión con una cuenta autorizada." }, { status: 401 });
  if (Number(request.headers.get("content-length")) > MAX_BYTES + 65536) return Response.json({ error: "La imagen debe pesar hasta 4 MB." }, { status: 413 });
  let file: FormDataEntryValue | null;
  try { file = (await request.formData()).get("file"); } catch { return Response.json({ error: "No se pudo leer la imagen." }, { status: 400 }); }
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return Response.json({ error: "Selecciona una imagen JPG, PNG o WebP." }, { status: 415 });
  if (!file.size || file.size > MAX_BYTES) return Response.json({ error: "La imagen debe pesar entre 1 byte y 4 MB." }, { status: 413 });
  let optimized: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 40_000_000, animated: false, failOn: "warning" });
    const metadata = await image.metadata();
    if (!metadata.format || !allowedFormats.has(metadata.format) || (metadata.pages || 1) !== 1) throw new Error("Unsupported image");
    // Full re-encoding validates the bytes, removes EXIF/GPS and produces a web-friendly image.
    optimized = await image.rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
    if (optimized.length > MAX_BYTES) throw new Error("Image too large");
  } catch {
    return Response.json({ error: "La imagen no es válida. Prueba con otra fotografía JPG, PNG o WebP." }, { status: 422 });
  }
  try {
    const db = getSupabaseAdmin();
    const path = `rooms/${randomUUID()}.webp`;
    const { error } = await db.storage.from(ROOM_IMAGES_BUCKET).upload(path, optimized, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
    if (error) throw error;
    const { data } = db.storage.from(ROOM_IMAGES_BUCKET).getPublicUrl(path);
    return Response.json({ url: data.publicUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No se pudo subir la fotografía. Revisa la conexión y el almacenamiento de Supabase." }, { status: 503 });
  }
}
