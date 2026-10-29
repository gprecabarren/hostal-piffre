# Consulta periódica de Supabase

GitHub Actions ejecuta `.github/workflows/supabase-health.yml` los lunes,
miércoles y viernes a las **04:17, hora de Santiago**. Los intervalos son de
dos o tres días. También se puede ejecutar manualmente con **Run workflow**.

## Qué hace

Una petición HTTPS directa a la Data API de Supabase, equivalente a:

```sql
select id from public.site_content where id = 'main' limit 1;
```

Solo devuelve el identificador público `main`. Se comprueba el código HTTP y
el contenido JSON para que una tabla inaccesible o una respuesta vacía no
parezcan una ejecución correcta. Hay dos reintentos acotados para errores
transitorios y un máximo de dos minutos para todo el trabajo.

No recorre el contenido JSON del sitio, no descarga fotos, no modifica filas,
no crea tablas ni extensiones y no solicita páginas de Vercel. El sitio no
depende del resultado de esta tarea. La carga es una lectura mínima de la
clave primaria, unas 13 veces al mes, salvo reintentos o ejecuciones manuales.

## Configuración

En **Settings → Secrets and variables → Actions → Variables** del repositorio:

- `SUPABASE_URL`: URL del proyecto del cliente.
- `SUPABASE_PUBLISHABLE_KEY`: clave pública existente `sb_publishable_…`.

La consulta utiliza el rol `anon` y las políticas RLS existentes. No necesita
`SUPABASE_SECRET_KEY`, `service_role` ni contraseña de PostgreSQL. Este trabajo
de lectura no tiene permisos de escritura en GitHub. El flujo rechaza claves
que no sean de tipo publishable.
Si se rota la clave pública, actualizar esta variable.

## Coste y límites

El repositorio es público. El runner estándar de Ubuntu es gratuito según la
[documentación de GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
No se instalan dependencias ni se guardan artefactos o cachés.

GitHub puede retrasar u omitir ejecuciones programadas. En repositorios públicos
también desactiva los horarios tras 60 días sin actividad en el repositorio.
Un segundo trabajo independiente renueva preventivamente este workflow mediante
el endpoint oficial `PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable`
y comprueba que siga `active`. Se ejecuta aunque falle la lectura de Supabase.

Solo ese trabajo recibe `actions: write`, con el token temporal que GitHub crea
para la ejecución. No recibe credenciales de Supabase, no necesita un token
personal persistente, no escribe en el código, no añade commits artificiales
y no activa despliegues. No se instalan acciones externas. La técnica de
renovación preventiva está documentada en el proyecto
[Workflow Keepalive](https://github.com/liskin/gh-workflow-keepalive), y usamos
directamente la [API oficial de GitHub](https://docs.github.com/en/rest/actions/workflows#enable-a-workflow).

Si alguien desactiva manualmente el workflow o GitHub cambia este comportamiento,
hay que reactivarlo desde Actions. No puede repararse a sí mismo si ya no se
ejecuta. La respuesta `active` verifica la renovación actual; no equivale a una
garantía futura del servicio. Véase también la
[documentación del evento schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

Esta tarea genera actividad mínima, pero no garantiza que Supabase nunca pause
un proyecto gratuito. Su
[documentación de disponibilidad](https://supabase.com/docs/guides/deployment/going-into-prod#availability)
reserva la garantía contra pausa por inactividad al plan Pro.

## Revisión inicial

El 29 de octubre de 2026 se revisó el repositorio (cero workflows), `vercel.json`
(sin cron) y la integración Cron de Supabase (sin instalar). No existía una
tarea equivalente en esos servicios.
