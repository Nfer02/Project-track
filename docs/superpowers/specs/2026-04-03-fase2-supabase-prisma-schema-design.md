# Fase 2: Supabase + Prisma + Schema — Spec

**Fecha:** 2026-04-03
**Proyecto:** ProjectTrack

---

## Contexto

ProjectTrack es una app de gestión financiera de proyectos para autónomos. Esta fase establece la capa de datos completa: Supabase como plataforma (Auth + Storage + PostgreSQL) y Prisma como ORM type-safe sobre esa base de datos.

---

## Decisiones de arquitectura

### Enfoque elegido: Supabase Auth + Prisma sobre PostgreSQL de Supabase

- **Supabase Auth** maneja sesiones, tokens JWT, y flujos de email/contraseña.
- **Prisma** se conecta directamente al PostgreSQL de Supabase via `DATABASE_URL` (connection pooling con PgBouncer en `DIRECT_URL`).
- Los usuarios de Supabase Auth se **sincronizan** a la tabla `User` de Prisma en el primer login (upsert), usando el UUID de Supabase como `id`.
- `@supabase/ssr` maneja las cookies de sesión en Server Components y Route Handlers.

### Por qué no usar solo Supabase sin Prisma

Prisma da tipado end-to-end, migraciones declarativas y queries type-safe. Vale el overhead para un proyecto de esta escala.

---

## Schema de base de datos

### Entidades

```
User
  id: String (UUID de Supabase Auth)
  email: String @unique
  name: String?
  avatarUrl: String?
  createdAt: DateTime

Workspace
  id: String (cuid)
  name: String
  slug: String @unique
  plan: Plan (FREE | PRO)
  createdAt: DateTime
  → members: WorkspaceMember[]
  → projects: Project[]
  → subscription: Subscription?

WorkspaceMember
  id: String (cuid)
  userId: String → User
  workspaceId: String → Workspace
  role: MemberRole (OWNER | ADMIN | MEMBER)
  inviteEmail: String?   -- para invitaciones pendientes
  inviteToken: String? @unique
  acceptedAt: DateTime?
  createdAt: DateTime
  @@unique([userId, workspaceId])

Project
  id: String (cuid)
  workspaceId: String → Workspace
  name: String
  clientName: String?
  description: String?
  status: ProjectStatus (ACTIVE | COMPLETED | ARCHIVED)
  budget: Decimal(12,2)?
  currency: String @default("USD")
  startDate: DateTime?
  endDate: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
  → invoices: Invoice[]

Invoice
  id: String (cuid)
  projectId: String → Project
  number: String         -- número del comprobante
  description: String?
  amount: Decimal(12,2)
  currency: String @default("USD")
  issueDate: DateTime
  dueDate: DateTime?
  paidDate: DateTime?
  status: InvoiceStatus (DRAFT | PENDING | PAID | OVERDUE | CANCELLED)
  notes: String?
  createdAt: DateTime
  updatedAt: DateTime
  @@unique([projectId, number])
  → files: InvoiceFile[]

InvoiceFile
  id: String (cuid)
  invoiceId: String → Invoice
  storagePath: String    -- path en Supabase Storage
  filename: String
  mimeType: String
  sizeBytes: Int
  ocrData: Json?         -- datos extraídos por Claude OCR (Fase 7)
  createdAt: DateTime

Subscription
  id: String (cuid)
  workspaceId: String @unique → Workspace
  stripeCustomerId: String? @unique
  stripeSubId: String? @unique
  stripePriceId: String?
  status: SubscriptionStatus (ACTIVE | INACTIVE | PAST_DUE | CANCELLED)
  currentPeriodEnd: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
```

---

## Archivos a crear

| Archivo | Propósito |
|---|---|
| `prisma/schema.prisma` | Schema completo de Prisma |
| `lib/prisma.ts` | Singleton del PrismaClient |
| `lib/supabase/client.ts` | Supabase browser client |
| `lib/supabase/server.ts` | Supabase server client (SSR con cookies) |
| `.env.local.example` | Variables de entorno documentadas |

---

## Variables de entorno requeridas

```
DATABASE_URL        -- PostgreSQL con PgBouncer (connection pooling)
DIRECT_URL          -- PostgreSQL directo (para migraciones)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Notas de implementación

- Usar `@db.Decimal` en Prisma para montos monetarios (evitar errores de punto flotante).
- `currency` como String ISO 4217 (USD, EUR, MXN, ARS, etc.) en lugar de enum, para flexibilidad.
- El `slug` del Workspace se genera automáticamente desde el nombre en la capa de aplicación.
- `InvoiceFile.ocrData` es `Json?` — la estructura se define en Fase 7.
- El PrismaClient singleton usa el patrón estándar anti-HMR para Next.js (global var).
