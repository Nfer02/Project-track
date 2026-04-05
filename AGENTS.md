# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## ProjectTrack — Patrones del proyecto

### Server Actions
- Todas las operaciones de facturas/gastos estan en `app/(dashboard)/invoices/actions.ts`
- Las operaciones de proyectos estan en `app/(dashboard)/projects/actions.ts`

### Patron Client Wrapper
- Nunca pasar closures de server actions desde server components a client components
- Crear un client wrapper que importe la server action directamente

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
- `DropdownMenuItem` navega via `onSelect={() => router.push(...)}`
- No existe `asChild` en Base UI (es concepto de Radix)
