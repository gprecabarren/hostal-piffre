import type { Metadata } from "next";
import { auth, authConfigured, isAdminSession, signIn, signOut } from "@/lib/auth";
import { getContentStatus, getSiteContent } from "@/lib/content";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminIcon } from "@/components/admin/AdminIcon";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Administración | Hostal Piffre" },
  description: "Acceso privado de administración de Hostal Piffre.",
  robots: { index: false, follow: false },
};

async function login() {
  "use server";
  await signIn("vercel", { redirectTo: "/admin" });
}

async function logout() {
  "use server";
  await signOut({ redirectTo: "/admin" });
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [session, parameters] = await Promise.all([auth(), searchParams]);
  if (isAdminSession(session)) {
    const [content, status] = await Promise.all([getSiteContent(), getContentStatus()]);
    return <AdminDashboard initialContent={content} status={status} user={{ name: session?.user?.name, email: session?.user?.email }} signOutAction={logout}/>;
  }

  const accessDenied = Boolean(session) || parameters.error === "AccessDenied";
  return <main className="admin-login-page"><section className="admin-login-brand" aria-label="Hostal Piffre"><a href="/" className="admin-login-official-brand"><img src="/brand/logo.webp" alt="Hostal Piffre, volver al sitio" width="720" height="906"/></a><h1>Cuidar tu hostal<br/>comienza aquí.</h1><p>TU HOGAR LEJOS DE CASA.<br/>PROVIDENCIA · SANTIAGO CENTRO.</p></section><section className="admin-login-content"><div className="admin-login-card"><p className="admin-login-label">EL ESPACIO DE TU HOSTAL</p><h2>Qué bueno tenerte<br/>de vuelta.</h2><p className="admin-login-description">Actualiza tus habitaciones, fotos y datos de contacto. Todo en un lugar, a tu ritmo.</p>{!authConfigured ? <div className="admin-notice admin-notice-neutral" role="status"><AdminIcon name="warning"/><div><strong>El acceso está en preparación</strong><p>Falta completar la conexión de inicio de sesión con Vercel. Tu sitio público está disponible.</p></div></div> : accessDenied ? <div className="admin-notice admin-notice-error" role="alert"><AdminIcon name="warning"/><p>Esta cuenta no tiene acceso al panel. Inicia sesión con el correo autorizado del alojamiento.</p></div> : parameters.error ? <div className="admin-notice admin-notice-error" role="alert"><AdminIcon name="warning"/><p>No se pudo completar el inicio de sesión. Vuelve a intentarlo con tu cuenta de Vercel autorizada.</p></div> : null}{session ? <form action={logout}><button className="admin-login-button" type="submit">Cerrar sesión de esta cuenta<AdminIcon name="logout" size={18}/></button></form> : <form action={login}><button className="admin-login-button" type="submit" disabled={!authConfigured}><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 23 22H1Z"/></svg>Continuar con Vercel<AdminIcon name="arrow" size={17}/></button></form>}<p className="admin-login-small">Acceso exclusivo para la administración del alojamiento. La sesión se verifica de forma segura con Vercel.</p><a href="/" className="admin-login-back"><AdminIcon name="arrow" size={16}/>Volver al sitio de Piffre</a></div></section></main>;
}
