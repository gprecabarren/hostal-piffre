# Inicio de sesión del panel

El panel utiliza Sign in with Vercel (OpenID Connect) a través de Auth.js. El acceso se limita a los correos definidos en `ADMIN_EMAILS`, por defecto `alojamientospiffre@gmail.com`.

## Configuración de la aplicación Vercel

- En **Team Settings → Apps → la aplicación → Permissions**, habilitar `openid`, `email` y `profile`, y guardar.
- En **Authentication**, habilitar `client_secret_basic` y generar un secreto de cliente.
- Registrar estos callbacks exactos:
  - `http://localhost:3000/api/auth/callback/vercel`
  - `https://alojamientospiffre.cl/api/auth/callback/vercel`
- Guardar el identificador y el secreto exclusivamente en las variables `AUTH_VERCEL_ID` y `AUTH_VERCEL_SECRET`. Configurar también `AUTH_SECRET`, `AUTH_URL` y `ADMIN_EMAILS`.

`email` es necesario para autorizar el correo de administración. `profile` permite mostrar su nombre. No se requieren permisos de lectura o escritura de recursos Vercel ni `offline_access`.

## Diagnóstico

En la prueba local del 22 de octubre de 2026, el proveedor devolvió `invalid_scope` a la URL de callback. Este error ocurre en la autorización, antes del intercambio de tokens y de la validación de firma. Los scopes enviados por el código (`openid email profile`) coinciden con los documentados por Vercel y su discovery público. La revisión pendiente era confirmar que los tres estén habilitados y guardados en **Permissions** de la misma aplicación cuyo identificador usa el sitio, y repetir el inicio desde `/admin`.

No eliminar la validación de correo para resolver un error de scope. El backend también verifica firma RS256, emisor, audiencia, expiración y nonce del ID Token; Auth.js administra PKCE, state y la sesión cifrada. No se deben registrar códigos OAuth, tokens, cookies ni secretos en documentación o capturas.

Referencias: [permisos y scopes](https://vercel.com/docs/sign-in-with-vercel/scopes-and-permissions), [configuración en Dashboard](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#configure-the-necessary-permissions), [discovery público](https://vercel.com/.well-known/openid-configuration).
