import { revalidatePath } from "next/cache";
import { auth, isAdminSession } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content";
import { contentPayloadSchema, isSameOrigin } from "@/lib/validation";

export const runtime = "nodejs";
// Galleries may contain up to 40 photographs per property. Stay below the
// function request-body limit while allowing the validated content shape.
const MAX_CONTENT_BYTES = 4_000_000;

export async function GET() {
  return Response.json({ content: await getSiteContent() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "La solicitud debe provenir de este sitio." }, { status: 403 });
  if (!isAdminSession(await auth())) return Response.json({ error: "Inicia sesión con una cuenta autorizada." }, { status: 401 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "Formato de solicitud inválido." }, { status: 415 });
  const declaredSize = Number(request.headers.get("content-length"));
  if (declaredSize > MAX_CONTENT_BYTES) return Response.json({ error: "El contenido es demasiado extenso." }, { status: 413 });
  let raw: string;
  try { raw = await request.text(); } catch { return Response.json({ error: "No se pudo leer el contenido." }, { status: 400 }); }
  if (Buffer.byteLength(raw, "utf8") > MAX_CONTENT_BYTES) return Response.json({ error: "El contenido es demasiado extenso." }, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return Response.json({ error: "El contenido no es JSON válido." }, { status: 400 }); }
  const parsed = contentPayloadSchema.safeParse(json);
  if (!parsed.success) return Response.json({
    error: "Revisa los campos indicados antes de guardar.",
    issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
  }, { status: 422 });
  try {
    const updatedAt = await saveSiteContent(parsed.data.content);
    revalidatePath("/", "layout");
    return Response.json({ content: parsed.data.content, updatedAt }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "No se guardaron los cambios. Revisa la conexión con Supabase e inténtalo nuevamente." }, { status: 503 });
  }
}
