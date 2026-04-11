# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## ProjectTrack — Patrones del proyecto

### Server Actions
- Todas las operaciones de facturas/gastos estan en `app/(dashboard)/invoices/actions.ts`
- Las operaciones de proyectos estan en `app/(dashboard)/projects/actions.ts`

### Patron Client Wrapper
- Nunca pasar closures de server actions desde server components a client components
- Crear un client wrapper que importe la server action directamente
- Nunca pasar referencias a componentes React (como iconos de Lucide) como props de Server a Client components — mover los datos dentro del client component

### Formularios
- Usar `FormField` (de react-hook-form) para todos los selects en formularios, NO `Controller`
- Usar `<select>` nativo en lugar de Base UI Select para datos dinamicos (proyectos, categorias, etc.)
- Base UI Select solo para opciones estaticas conocidas en build time

### Moneda y locale
- Moneda por defecto: EUR
- Locale: es-ES
- Usar `formatCurrency()` y `formatDate()` de `lib/format.ts`

### Idioma
- Todo el texto visible al usuario debe estar en espanol de Espana (sin voseo)
- Ejemplo: "Selecciona un proyecto" (no "Selecciona" ni "Seleccionas")

### Prisma 7
- `url`/`directUrl` van en `prisma.config.ts`, NO en el schema
- `PrismaClient` requiere adapter obligatorio (`@prisma/adapter-pg` con `PrismaPg`)

### Next.js 16
- `middleware.ts` se renombro a `proxy.ts`, funcion `proxy()` en lugar de `middleware()`
- Runtime es Node.js por defecto (no Edge)

### Stripe v21
- API version: `"2026-03-25.dahlia"`
- Inicializar de forma lazy (no en modulo top-level) para que el build funcione sin env vars
- `Invoice.subscription` ya no existe -> usar `invoice.parent?.subscription_details?.subscription`

### Base UI (shadcn/ui)
- `Button` NO tiene `asChild`. Usar `render={<Link href="..." />}`
- `DropdownMenuItem`: usar `onClick` en lugar de `onSelect` (Base UI no soporta `onSelect`)
- No existe `asChild` en Base UI (es concepto de Radix)

### Cookie notice
- Usar localStorage para persistir el estado de aceptacion del cookie notice
- No bloquear la navegacion; es informativo, no un consent wall

### Facturas vencidas
- Detectar facturas vencidas al cargar la pagina (en el server component), no durante la mutacion en DB
- Marcar como OVERDUE al hacer fetch, no al crear/editar

### Disclaimers legales
- Todas las estimaciones fiscales deben incluir un disclaimer: "orientativo, no sustituye asesoramiento profesional"
- Los reportes CSV deben incluir disclaimer similar
- Nunca presentar datos fiscales como definitivos o vinculantes

### Filtro de trimestre en Dashboard
- URL param: `?q=2025-Q3` (uno) o `?q=2025-Q3,2025-Q2` (varios, separados por coma)
- Componente: `components/app/dashboard-period-filter.tsx` — dropdown con checkboxes, multi-seleccion
- Helper `parseQuarterParams(q)` en dashboard/page.tsx parsea el param y devuelve `{year, month}[]`
- Helper `getMonthsInPeriod(ranges)` convierte rangos de trimestres en lista de meses para las graficas
- Las graficas SIEMPRE deben usar `buildIncomeExpenseForMonths()` / `buildNetProfitForMonths()` con los meses del periodo — NUNCA `buildIncomeExpenseMonthly()` (esta hardcodea "ultimos N desde hoy")
- Stats y graficas filtran por el mismo periodo; estimacion fiscal usa el trimestre mas reciente del array

### Formularios con Zod y react-hook-form
- Para campos opcionales en schemas Zod: usar `z.string()` SIN `.default()` ni `.optional()`
- Los valores por defecto van en el objeto `defaultValues` de `useForm()`, no en el schema
- `.optional().default()` hace que TypeScript infiera `string | undefined` aunque haya default — rompe el tipado del resolver

### Workspace — campos fiscales
- Modelo `Workspace` tiene: `nif`, `legalName`, `legalForm`, `vatRegime`, `defaultVatRate`, `defaultIrpfRate`, `isIspApplicable`, `employeeCount`, `autonomoQuota`
- Se editan en `app/(dashboard)/settings/empresa/` (page + form + actions)
- Se capturan opcionalmente en el onboarding (paso 4 de 4, con boton "Omitir por ahora")
- La action `updateWorkspaceFiscal` requiere rol OWNER o ADMIN

### Prisma — migraciones en produccion
- La DB de Supabase fue creada sin historial de migraciones → `prisma migrate dev` falla con "drift detected"
- Usar `prisma db push` para aplicar cambios de schema sin historial de migraciones
- Ejecutar con variable DIRECT_URL exportada: `DIRECT_URL="postgresql://..." npx prisma db push`
- Despues de `db push`, ejecutar `npx prisma generate` para regenerar el cliente

---

## Seguridad

### 1. Rate Limiting
- Implementar rate limiting en endpoint de OCR (`/api/ocr/extract`) — es el unico que cuesta dinero (llama a Claude AI)
- Usar `@upstash/ratelimit` con Upstash Redis (free tier: 10K requests/dia) o rate limiting in-memory como alternativa
- Limites recomendados:
  - OCR: 20 peticiones por usuario/hora
  - Auth (login/registro): gestionado por Supabase internamente
  - API general: Vercel tiene proteccion DDoS basica incluida
- Devolver error 429 (Too Many Requests) cuando se exceda el limite

### 2. Variables de Entorno y Secretos
- NUNCA escribir API keys, tokens o contrasenas en el codigo
- Usar SIEMPRE variables de entorno (.env.local) para credenciales
- `.env.local` debe estar en `.gitignore` (ya esta)
- `.env.local.example` debe tener nombres sin valores reales (ya existe)
- Validar al arrancar la app que todas las variables de entorno necesarias existen
- Si falta alguna, la app no debe iniciar (mostrar error claro)

### 3. Validacion de Inputs (Anti-Inyeccion)
- Validar con Zod en el CLIENTE (formularios) Y en el SERVIDOR (server actions)
- Prisma ORM previene SQL injection (nunca SQL crudo)
- React escapa HTML por defecto — no usar `dangerouslySetInnerHTML`
- Rechazar y loguear inputs que no pasen la validacion

### 4. Headers de Seguridad
- Configurar en `vercel.json` o `next.config.ts`:
  - Content-Security-Policy (CSP) — permitir recharts (SVG), ui-avatars.com, Stripe
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security (HSTS)
- `poweredByHeader: false` en next.config.ts (ya configurado)

### 5. Autenticacion y Sesiones
- Supabase Auth gestiona: cookies httpOnly/secure, bcrypt para contrasenas, CSRF via origin check
- Next.js server actions tienen proteccion CSRF built-in
- No implementar auth custom — usar Supabase

### 6. Logging de Seguridad
- `console.error` en catches de server actions (ya implementado)
- Para escalar: integrar Axiom (gratis en Vercel) o Sentry
- NUNCA loguear datos sensibles (contrasenas, tokens, datos personales)
