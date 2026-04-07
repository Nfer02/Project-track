# Manual del Propietario — ProjectTrack

**Propietario:** Nelson Fernandez
**Ultima actualizacion:** Abril 2026

---

## 1. Resumen del sistema

ProjectTrack es una aplicacion web de gestion financiera diseñada para autonomos y pequeñas empresas en España. Permite gestionar proyectos, registrar facturas emitidas y gastos, escanear documentos con IA (OCR), generar reportes trimestrales para el gestor y cobrar suscripciones PRO con Stripe.

- **URL de produccion:** https://projecttrack.app
- **URL alternativa:** https://project-track-ruby.vercel.app
- **Repositorio:** https://github.com/Nfer02/Project-track
- **Stack:** Next.js 16, Prisma 7, Supabase (PostgreSQL + Auth), Stripe, Tailwind CSS

---

## 2. Servicios y accesos

### 2.1 Vercel (hosting)

- **Dashboard:** https://vercel.com/nelsonfernandez1002-7523s-projects/project-track
- **Funcion:** Hosting de la aplicacion, build automatico y deploy
- **Credenciales a guardar:**
  - Vercel Token (`vcp_...`) — guardar en lugar seguro
- **Plan:** Hobby (gratis)
- **Limites del plan:** 1 proyecto comercial, 100 GB de ancho de banda/mes, builds de hasta 45 min
- **Como hacer deploy:**
  ```
  npx vercel --prod
  ```

### 2.2 Supabase (base de datos + auth)

- **Dashboard:** https://supabase.com/dashboard/project/jxwbutdpbabxsywqkzio
- **Funcion:** Base de datos PostgreSQL, autenticacion de usuarios, almacenamiento de archivos
- **Credenciales a guardar:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DATABASE_URL` (con contraseña — nunca compartir)
  - `DIRECT_URL` (para migraciones — nunca compartir)
- **Plan:** Free
- **Limites:** 500 MB base de datos, 1 GB storage, 2 GB transferencia/mes, 50.000 usuarios autenticados
- **Secciones importantes del dashboard:**
  - **Auth > Users:** Ver usuarios registrados, desactivar cuentas
  - **Auth > URL Configuration:** URLs de redireccion (debe incluir `https://projecttrack.app/**`)
  - **SQL Editor:** Ejecutar migraciones manuales
  - **Storage > invoice-files:** Bucket donde se guardan las facturas subidas
  - **Settings > API:** Obtener claves de Supabase
  - **Settings > Database:** Obtener cadenas de conexion

### 2.3 Stripe (pagos)

- **Dashboard:** https://dashboard.stripe.com
- **Funcion:** Cobros de suscripciones PRO, generacion automatica de facturas
- **Credenciales a guardar:**
  - `STRIPE_SECRET_KEY` (`sk_live_...`) — NUNCA compartir
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_live_...`) — publica, se puede compartir
  - `STRIPE_WEBHOOK_SECRET` (`whsec_...`) — NUNCA compartir
  - `STRIPE_PRICE_ID` (`price_...`) — ID del precio del plan PRO
- **Plan:** Sin cuota mensual; comision del 1,5% + 0,25 EUR por transaccion (tarjetas europeas)
- **Webhook configurado:** `https://projecttrack.app/api/stripe/webhook`
- **Eventos que escucha el webhook:**
  - `checkout.session.completed` — Cuando un usuario paga PRO
  - `customer.subscription.updated` — Cuando cambia el estado de la suscripcion
  - `customer.subscription.deleted` — Cuando se cancela
  - `invoice.payment_succeeded` — Factura de Stripe pagada

### 2.4 Anthropic Claude (OCR / IA)

- **Dashboard:** https://console.anthropic.com
- **Funcion:** Extraccion de datos de facturas/tickets con inteligencia artificial (OCR)
- **Credenciales:** `ANTHROPIC_API_KEY` (`sk-ant-...`) — NUNCA compartir
- **Modelo usado:** claude-sonnet-4-5
- **Coste aproximado:** ~0,012 EUR por escaneo
- **Rate limit implementado:** 20 peticiones por usuario/hora (protege contra abuso)
- **Donde se usa:** Endpoint `/api/ocr/extract`

### 2.5 Resend (emails)

- **Dashboard:** https://resend.com
- **Funcion:** Envio de emails transaccionales (invitaciones a workspace, notificaciones)
- **Credenciales:** `RESEND_API_KEY` (`re_...`)
- **Dominio:** projecttrack.app (verificar que DNS esta configurado)
- **Plan:** Free — 3.000 emails/mes, 100 emails/dia
- **Alternativa de respaldo:** Supabase Auth tiene email built-in (3 emails/hora, limitado)

### 2.6 Namecheap (dominio)

- **Dashboard:** https://ap.www.namecheap.com
- **Funcion:** Registro del dominio projecttrack.app
- **Renovacion:** Anual (~11 EUR/año)
- **DNS configurado para:**
  - Vercel: registro A (`76.76.21.21`) + CNAME (`cname.vercel-dns.com`)
  - Resend: registros TXT para verificacion de email
- **Auto-renovacion:** Activada (verificar que la tarjeta vinculada esta vigente)

### 2.7 Google Search Console (SEO)

- **Dashboard:** https://search.google.com/search-console
- **Funcion:** Indexacion en Google, metricas de busqueda, errores de rastreo
- **Verificado con:** Archivo HTML (`googlea268a5d53565d0c0.html` en la raiz publica)
- **Acciones periodicas:** Revisar errores de cobertura, enviar sitemap si hay paginas nuevas

### 2.8 GitHub (codigo fuente)

- **Repositorio:** https://github.com/Nfer02/Project-track
- **Rama principal:** `master`
- **Visibilidad:** Privado
- **Deploy:** Manual via Vercel CLI (`npx vercel --prod`); no hay integracion automatica con GitHub en el plan Hobby

---

## 3. Variables de entorno

Lista completa de todas las variables necesarias para que la aplicacion funcione:

| Variable | Descripcion | Donde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave publica de Supabase | Supabase > Settings > API |
| `DATABASE_URL` | Conexion a DB con pooler (para runtime) | Supabase > Settings > Database |
| `DIRECT_URL` | Conexion directa a DB (para migraciones) | Supabase > Settings > Database |
| `NEXT_PUBLIC_APP_URL` | URL publica de la app | `https://projecttrack.app` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | Stripe > Developers > API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publica de Stripe | Stripe > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe | Stripe > Developers > Webhooks |
| `STRIPE_PRICE_ID` | ID del precio del plan PRO | Stripe > Products > PRO > Price ID |
| `RESEND_API_KEY` | API key de Resend | Resend > API Keys |
| `ANTHROPIC_API_KEY` | API key de Claude para OCR | Anthropic > Settings > API Keys |

**Donde se configuran:**
- **Desarrollo local:** Archivo `.env.local` en la raiz del proyecto (nunca subir a git)
- **Produccion (Vercel):** Dashboard de Vercel > Settings > Environment Variables

**Validacion:** La app valida al arrancar que todas las variables criticas existen. Si falta alguna, muestra un error claro en los logs (ver `lib/env.ts`).

---

## 4. Flujo de la aplicacion

### 4.1 Registro de usuario

1. Visitante llega a la landing page (projecttrack.app)
2. Se apunta a la waitlist (modo actual — el registro esta desactivado hasta que se active manualmente)
3. Cuando se active el registro: visitante va a `/register`
4. Supabase Auth crea la cuenta del usuario
5. Onboarding: el usuario introduce su nombre, sector de actividad y crea un workspace
6. Accede al dashboard principal

### 4.2 Flujo de un proyecto

1. Crear proyecto: nombre, cliente, NIF del cliente, presupuesto estimado
2. Configurar fiscalidad: tipo de IVA (21%, 10%, 4%, 0%), retencion de IRPF (15%, 7%, 0%)
3. Registrar cobros: crear facturas emitidas con concepto, importe, fecha, estado
4. Registrar gastos: manualmente o escaneando con OCR
5. Ver finanzas del proyecto: ingresos vs gastos, margen, progreso del presupuesto
6. Generar reportes trimestrales

### 4.3 Flujo de pagos con Stripe

1. Usuario en plan Free hace clic en "Actualizar a PRO"
2. Se abre Stripe Checkout (pagina de pago segura de Stripe)
3. El usuario introduce su tarjeta y paga
4. Stripe procesa el pago y envia un evento al webhook
5. El webhook (`/api/stripe/webhook`) actualiza el workspace a plan PRO en la base de datos
6. El usuario tiene acceso inmediato a funciones PRO
7. Stripe genera automaticamente una factura para el usuario
8. Cada mes, Stripe cobra automaticamente y envia otro evento

### 4.4 Flujo de OCR (escaneo de facturas)

1. El usuario sube una foto o PDF de un ticket/factura
2. La imagen se envia al endpoint `/api/ocr/extract`
3. Se verifica el rate limit (maximo 20 escaneos/hora por usuario)
4. Claude Sonnet analiza el documento
5. Extrae: proveedor, NIF, base imponible, tipo de IVA, cuota de IVA, total, fecha
6. Los datos extraidos se auto-rellenan en el formulario de gasto
7. El usuario revisa, corrige si es necesario y guarda

### 4.5 Flujo de reportes

1. El usuario va a `/reports`
2. Selecciona el trimestre (T1, T2, T3, T4) y el año
3. Ve el resumen: facturas declaradas (emitidas y gastos), bases imponibles, IVA, IRPF
4. Puede exportar a CSV para enviar al gestor/asesor fiscal
5. Disclaimer incluido: "Datos orientativos, no sustituyen asesoramiento profesional"

---

## 5. Panel de administracion

- **URL:** https://projecttrack.app/admin
- **Acceso:** Solo el email `nelsonfernandez1002@gmail.com` tiene permiso
- **Que puedes ver:**
  - Numero total de usuarios y workspaces
  - Distribucion Free vs PRO
  - MRR (Monthly Recurring Revenue)
  - Lista de personas en la waitlist
  - Sectores de actividad de los usuarios
  - Tendencias de registro
  - Estado de las suscripciones activas

---

## 6. Mantenimiento rutinario

### 6.1 Deploy de cambios

```bash
cd C:\Users\ASUS\.claude\projects\Project-track
git add -A && git commit -m "descripcion del cambio"
npx vercel --prod
git push origin master
```

**Nota:** Siempre hacer deploy a Vercel ANTES de push a GitHub. Si el build falla en Vercel, puedes corregir antes de subir al repositorio.

### 6.2 Ejecutar migraciones de base de datos

**Opcion A — Desde el dashboard de Supabase:**
1. Ir a https://supabase.com/dashboard/project/jxwbutdpbabxsywqkzio/sql/new
2. Pegar el SQL de migracion
3. Clic en "Run"

**Opcion B — Desde la terminal (Prisma):**
```bash
pnpm prisma db push
```
Esto sincroniza el schema de Prisma con la base de datos. Requiere que `DIRECT_URL` este configurada en `.env.local`.

### 6.3 Regenerar el cliente de Prisma

Si cambias el schema (`prisma/schema.prisma`):
```bash
pnpm prisma generate
```

### 6.4 Monitorizar errores

- **Vercel:** Dashboard > Deployments > clic en el deploy > "Functions" tab para ver logs
- **Supabase:** Dashboard > Database > Logs
- **Stripe:** Dashboard > Developers > Events (ver si los webhooks se entregan correctamente)
- **Resend:** Dashboard > Emails (ver si los emails se envian)

### 6.5 Renovaciones y costes recurrentes

| Servicio | Frecuencia | Coste | Accion |
|---|---|---|---|
| Dominio (Namecheap) | Anual | ~11 EUR | Auto-renovacion activada; verificar tarjeta |
| Supabase | N/A | Gratis | Upgrade si la DB supera 500 MB |
| Vercel | N/A | Gratis | Upgrade si necesitas equipo o mas builds |
| Resend | N/A | Gratis | Upgrade si superas 3.000 emails/mes |
| Stripe | N/A | Por transaccion | Sin renovacion; comision automatica |
| Anthropic | N/A | Por uso | Recargar creditos si se agotan |

---

## 7. Que hacer si algo falla

### La app no carga

1. Ve a https://vercel.com y verifica que el ultimo deploy esta en estado "Ready"
2. Si el deploy fallo, revisa los logs del build para ver el error
3. Si esta todo bien en Vercel, verifica el DNS en Namecheap
4. Redeploy rapido: `npx vercel --prod`

### Los usuarios no pueden registrarse

1. Verifica en Supabase > Auth > Settings que "Enable Email Signup" esta activado
2. Verifica que en Auth > URL Configuration las redirect URLs incluyen `https://projecttrack.app/**`
3. Si el modo waitlist esta activo, el registro esta desactivado intencionalmente

### El OCR no funciona

1. Verifica que `ANTHROPIC_API_KEY` es valida: ve a https://console.anthropic.com y comprueba que la key existe y no esta revocada
2. Verifica que hay creditos disponibles en la cuenta de Anthropic
3. Si el error es 429, el usuario ha superado el limite de 20 escaneos/hora

### Los pagos no funcionan

1. Ve a Stripe > Developers > Webhooks y verifica que el endpoint `https://projecttrack.app/api/stripe/webhook` esta activo
2. Verifica que `STRIPE_WEBHOOK_SECRET` en Vercel env vars coincide con el del webhook en Stripe
3. Revisa los eventos recientes en Stripe > Developers > Events; si hay errores 400/500, el webhook no esta procesando bien
4. Verifica que `STRIPE_PRICE_ID` apunta al producto correcto

### Los emails no llegan

1. Ve a Resend > Domains y verifica que `projecttrack.app` esta en estado "Verified"
2. Si no esta verificado, revisa los registros DNS (TXT) en Namecheap
3. Verifica que `RESEND_API_KEY` en Vercel env vars es correcta
4. Alternativa temporal: Supabase tiene email built-in pero esta limitado a 3 emails/hora

### Error de base de datos

1. Ve a Supabase > Database > Health y verifica que la DB esta activa
2. Si hay problemas de conexion, verifica que `DATABASE_URL` en Vercel apunta al pooler correcto
3. Si la DB esta llena (500 MB), necesitas upgrade del plan o limpiar datos antiguos

---

## 8. Seguridad

### Credenciales que NUNCA debes compartir

- `STRIPE_SECRET_KEY` — Permite hacer cobros en tu nombre
- `ANTHROPIC_API_KEY` — Permite usar (y gastar) tu cuenta de IA
- `DATABASE_URL` / `DIRECT_URL` — Contienen la contraseña de la base de datos
- `STRIPE_WEBHOOK_SECRET` — Permite falsificar eventos de pago
- Vercel Token (`vcp_...`) — Da acceso completo a tus deploys
- GitHub Token (`ghp_...`) — Da acceso al codigo fuente

### Credenciales publicas (se pueden compartir)

- `NEXT_PUBLIC_SUPABASE_URL` — URL publica del proyecto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clave anonima (protegida por RLS)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Clave publica de Stripe
- `NEXT_PUBLIC_APP_URL` — URL de la aplicacion

### Medidas de seguridad implementadas

- **Headers de seguridad:** CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff (configurados en `vercel.json`)
- **Rate limiting:** OCR limitado a 20 peticiones/hora por usuario
- **Validacion de inputs:** Zod en cliente y servidor; Prisma previene SQL injection
- **Autenticacion:** Gestionada por Supabase (cookies httpOnly/secure, bcrypt)
- **CSRF:** Proteccion built-in en Next.js server actions
- **Variables de entorno:** Validadas al arrancar la app

### Si sospechas que una clave ha sido comprometida

1. **Stripe:** Ve a Stripe > Developers > API keys > "Roll key" para generar una nueva
2. **Anthropic:** Ve a Anthropic > Settings > API Keys > Revocar y crear nueva
3. **Resend:** Ve a Resend > API Keys > Eliminar y crear nueva
4. **Supabase:** Ve a Settings > API > Regenerar claves (esto requiere actualizar env vars en todos lados)
5. **GitHub:** Ve a Settings > Developer Settings > Personal Access Tokens > Revocar
6. **Vercel:** Ve a Settings > Tokens > Revocar
7. Despues de rotar cualquier clave: actualizar en `.env.local` local Y en Vercel env vars, y redeploy

---

## 9. Costes mensuales actuales

| Servicio | Coste |
|---|---|
| Dominio (Namecheap) | ~1 EUR/mes |
| Vercel | 0 EUR (plan Hobby) |
| Supabase | 0 EUR (plan Free) |
| Stripe | 0 EUR (solo comision por transaccion) |
| Resend | 0 EUR (plan Free) |
| Anthropic (OCR) | Variable; ~0,012 EUR por escaneo |
| **Total actual** | **~1 EUR/mes + uso de OCR** |

### Proyeccion cuando haya usuarios

| Escenario | Usuarios | OCR/mes | Coste estimado |
|---|---|---|---|
| Primeros usuarios | 10 | 100 | ~2,20 EUR/mes |
| Crecimiento | 50 | 500 | ~7 EUR/mes |
| Escala | 200 | 2.000 | ~25 EUR/mes |

Los ingresos por suscripciones PRO deberian cubrir los costes de OCR con margen.

---

## 10. Estructura de archivos importante

```
Project-track/
  app/
    (auth)/          -- Login, registro, recuperar contraseña
    (dashboard)/     -- Dashboard, proyectos, facturas, reportes, settings
      invoices/
        actions.ts   -- Server actions de facturas y gastos
      projects/
        actions.ts   -- Server actions de proyectos
      admin/         -- Panel de administracion
      reports/       -- Reportes trimestrales
      settings/      -- Configuracion del workspace, miembros
    api/
      ocr/extract/   -- Endpoint de OCR con Claude
      stripe/webhook/ -- Webhook de Stripe
  lib/
    env.ts           -- Validacion de variables de entorno
    stripe.ts        -- Cliente Stripe (lazy init)
    anthropic.ts     -- Cliente Anthropic (lazy init)
    resend.ts        -- Cliente Resend
    prisma.ts        -- Cliente Prisma con adapter PG
    format.ts        -- Formateo de moneda (EUR) y fechas (es-ES)
  prisma/
    schema.prisma    -- Schema de la base de datos
  vercel.json        -- Headers de seguridad + configuracion de build
  proxy.ts           -- Middleware de autenticacion (rutas publicas vs protegidas)
```

---

## 11. Contacto y documentacion adicional

Si algo falla y no sabes resolverlo, la documentacion tecnica esta en:

- `README.md` — Descripcion general del proyecto
- `AGENTS.md` — Patrones de desarrollo y convenciones del codigo
- `docs/analisis-financiero.md` — Analisis detallado de costes y proyecciones
- `.env.local.example` — Plantilla de variables de entorno

Para soporte tecnico, toda la logica de la aplicacion esta en el repositorio de GitHub y puede ser revisada por cualquier desarrollador con experiencia en Next.js y TypeScript.
