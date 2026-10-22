# Inicio de sesión del panel

El panel utiliza Sign in with Vercel (OpenID Connect) a través de Auth.js. El acceso se limita a los correos definidos en `ADMIN_EMAILS`, por defecto `alojamientospiffre@gmail.com`.

## Configuración de la aplicación Vercel

- En **Team Settings → Apps → la aplicación → Permissions**, habilitar `openid`, `email` y `profile`, y guardar.
- En **Authentication**, habilitar `client_secret_basic` y generar un secreto de cliente.
- Registrar estos callbacks exactos:
  - `http://localhost:3000/api/auth/callback/vercel`
  - `https://alojamientospiffre.cl/api/auth/callback/vercel`
- Guardar el identificador y el secreto exclusivamente en las variables `AUTH_VERCEL_ID` y `AUTH_VERCEL_SECRET`. Configurar también `AUTH_SECRET` y `ADMIN_EMAILS`. `AUTH_URL` es opcional; Vercel proporciona el host de confianza de cada dominio configurado.

`email` es necesario para autorizar el correo de administración. `profile` permite mostrar su nombre. No se requieren permisos de lectura o escritura de recursos Vercel ni `offline_access`.

## Diagnóstico

El 22 de octubre de 2026 se verificó el inicio de sesión real con la cuenta del cliente tanto localmente como en producción. El error inicial `invalid_scope` se resolvió habilitando y guardando `email` y `profile` en **Permissions**. Los scopes enviados por el código (`openid email profile`) se mantienen. La aplicación está limitada a miembros del equipo; el servidor además aplica la lista de correos autorizados.

`AUTH_SECRET`, `AUTH_VERCEL_SECRET` y `SUPABASE_SECRET_KEY` quedaron como variables de tipo **Secret**, exclusivamente en **Production**. Los valores públicos de configuración pueden utilizarse en Preview. Nunca copiar las claves privadas de producción a previews.

No eliminar la validación de correo para resolver un error de scope. El backend también verifica firma RS256, emisor, audiencia, expiración y nonce del ID Token; Auth.js administra PKCE, state y la sesión cifrada. No se deben registrar códigos OAuth, tokens, cookies ni secretos en documentación o capturas.

Referencias: [permisos y scopes](https://vercel.com/docs/sign-in-with-vercel/scopes-and-permissions), [configuración en Dashboard](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#configure-the-necessary-permissions), [discovery público](https://vercel.com/.well-known/openid-configuration).
