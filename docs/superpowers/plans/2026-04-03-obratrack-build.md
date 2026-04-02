# ProjectTrack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build ProjectTrack, a SaaS financiero para autónomos que gestiona obras/proyectos, facturas (con OCR), y visualiza rentabilidad en tiempo real.

**Architecture:** Next.js 15 App Router con Server Components para lectura, Server Actions para mutaciones, y Client Components solo para formularios/uploaders/modales. Supabase maneja auth, storage y base de datos (PostgreSQL via Prisma). Sin Zustand ni React Query en MVP.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui, Supabase (Auth + Storage + DB), Prisma ORM, Stripe, Resend, Claude API (claude-haiku-4-5-20251001), pnpm, Vercel.

---

## File Structure

```
project-track/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # Landing
│   │   └── pricing/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx                        # Shell protegido (sidebar + header)
│   │   ├── onboarding/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx                  # Dashboard financiero del proyecto
│   │   │       └── invoices/
│   │   │           ├── page.tsx
│   │   │           └── new/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── team/page.tsx
│   │       └── billing/page.tsx
│   ├── api/
│   │   ├── workspaces/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── metrics/route.ts
│   │   ├── invoices/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── scan/route.ts                 # OCR con Claude API
│   │   ├── workspaces/[id]/members/route.ts
│   │   ├── checkout/route.ts
│   │   └── webhooks/
│   │       ├── stripe/route.ts
│   │       └── supabase/route.ts
│   ├── layout.tsx                            # Root layout (font, metadata)
│   └── globals.css                           # Tailwind v4 + design tokens
├── components/
│   ├── ui/                                   # shadcn/ui (auto-generado)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── app-shell.tsx
│   ├── projects/
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   ├── budget-progress.tsx               # Anillo SVG
│   │   ├── financial-summary.tsx             # 3 cards: ingresos/gastos/beneficio
│   │   └── deviation-alert.tsx               # Banner si desviación > 10%
│   ├── invoices/
│   │   ├── invoice-list.tsx
│   │   ├── invoice-form.tsx
│   │   ├── invoice-uploader.tsx              # Drag & drop + cámara mobile
│   │   └── ocr-preview-modal.tsx
│   └── shared/
│       ├── currency-display.tsx              # tabular-nums
│       └── status-badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                         # Browser client
│   │   ├── server.ts                         # Server client (cookies)
│   │   └── admin.ts                          # Service role client
│   ├── prisma.ts                             # Singleton PrismaClient
│   ├── stripe.ts                             # Stripe instance
│   ├── resend.ts                             # Resend instance
│   ├── claude.ts                             # Anthropic client
│   └── utils.ts                             # cn(), formatCurrency(), etc.
├── actions/
│   ├── auth.ts                              # signIn, signUp, signOut
│   ├── workspaces.ts                        # createWorkspace
│   ├── projects.ts                          # createProject, updateProject, deleteProject
│   ├── invoices.ts                          # createInvoice, updateInvoice, deleteInvoice
│   └── members.ts                           # inviteMember, removeMember, updateRole
├── hooks/
│   └── use-workspace.ts                     # Workspace context del usuario actual
├── types/
│   └── index.ts                             # Tipos derivados de Prisma + helpers
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── middleware.ts                             # Protege /(app)/*
├── .env.local
└── next.config.ts
```

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js 15 + shadcn/ui

**Files:**
- Create: todo el proyecto en `/`

- [ ] **Step 1: Crear el proyecto**

```bash
cd C:\Users\ASUS\.claude\projects\project-track
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

Cuando pregunte por Turbopack: **Yes**. Cuando pregunte por `src/` directory: **No**.

- [ ] **Step 2: Instalar dependencias principales**

```bash
pnpm add @supabase/supabase-js @supabase/ssr @prisma/client prisma
pnpm add stripe @stripe/stripe-js resend
pnpm add @anthropic-ai/sdk
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add jose                          # JWT para invitaciones
pnpm add -D @types/node
```

- [ ] **Step 3: Inicializar shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

Seleccionar: **Default** style, **Neutral** base color, CSS variables: **Yes**.

Instalar componentes necesarios:

```bash
pnpm dlx shadcn@latest add button input label card badge dialog sheet tabs select textarea toast skeleton progress separator avatar dropdown-menu form
```

- [ ] **Step 4: Configurar fuente Plus Jakarta Sans**

Reemplazar `app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "ProjectTrack",
  description: "Gestión financiera de proyectos para autónomos",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${font.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Configurar design tokens en globals.css**

En `app/globals.css`, después de las directivas de shadcn, añadir al `:root`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --primary: 221.2 83.2% 53.3%;         /* #2563EB */
  --cta: 24.6 95% 53.1%;                /* #F97316 */
  --success: 142.1 76.2% 36.3%;         /* #16A34A */
  --danger: 0 84.2% 60.2%;              /* #DC2626 */
  --warning: 32.1 94.6% 43.7%;          /* #D97706 */
  --radius: 0.5rem;
}
```

- [ ] **Step 6: Verificar que arranca**

```bash
pnpm dev
```

Esperado: servidor en `http://localhost:3000` sin errores.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 15 + shadcn/ui + design tokens"
```

---

### Task 2: Supabase + Prisma + Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`
- Create: `.env.local`

- [ ] **Step 1: Crear proyecto en Supabase**

Ir a [supabase.com](https://supabase.com) → New project. Copiar:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key → `SUPABASE_SERVICE_ROLE_KEY`
- Connection string (Transaction mode, port 6543) → `DATABASE_URL`
- Connection string (Session mode, port 5432) → `DIRECT_URL`

- [ ] **Step 2: Crear `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres.xxxx:password@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
INVITATION_JWT_SECRET=change-me-to-a-secure-random-string-32chars
```

- [ ] **Step 3: Escribir `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Plan {
  FREE
  PRO
}

enum MemberRole {
  OWNER
  EDITOR
  VIEWER
}

enum ProjectStatus {
  ACTIVE
  COMPLETED
  PAUSED
  ARCHIVED
}

enum InvoiceType {
  EXPENSE
  INCOME
}

enum InvoiceStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  TRIALING
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships WorkspaceMember[]

  @@map("users")
}

model Workspace {
  id                   String              @id @default(uuid())
  name                 String
  plan                 Plan                @default(FREE)
  subscriptionStatus   SubscriptionStatus?
  stripeCustomerId     String?             @unique
  stripeSubscriptionId String?             @unique
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  members  WorkspaceMember[]
  projects Project[]
  invoices Invoice[]

  @@map("workspaces")
}

model WorkspaceMember {
  id          String     @id @default(uuid())
  userId      String
  workspaceId String
  role        MemberRole @default(VIEWER)
  createdAt   DateTime   @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
  @@index([workspaceId])
  @@map("workspace_members")
}

model Project {
  id          String        @id @default(uuid())
  workspaceId String
  name        String
  client      String?
  budget      Decimal       @db.Decimal(12, 2)
  status      ProjectStatus @default(ACTIVE)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  invoices  Invoice[]

  @@index([workspaceId])
  @@map("projects")
}

model Invoice {
  id           String        @id @default(uuid())
  workspaceId  String
  projectId    String
  type         InvoiceType
  number       String?
  counterparty String?
  nif          String?
  base         Decimal       @db.Decimal(12, 2)
  vat          Decimal       @db.Decimal(5, 2)  @default(21)
  total        Decimal       @db.Decimal(12, 2)
  currency     String        @default("EUR")
  issueDate    DateTime?
  dueDate      DateTime?
  status       InvoiceStatus @default(PENDING)
  fileUrl      String?
  ocrProcessed Boolean       @default(false)
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@index([projectId])
  @@map("invoices")
}
```

- [ ] **Step 4: Ejecutar migración inicial**

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

Esperado: tablas creadas en Supabase, cliente generado en `node_modules/.prisma`.

- [ ] **Step 5: Crear `lib/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

- [ ] **Step 6: Crear clientes Supabase**

`lib/supabase/client.ts` (browser):
```ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/server.ts` (server components / actions):
```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

`lib/supabase/admin.ts` (service role — solo para webhooks/server):
```ts
import { createClient } from "@supabase/supabase-js"

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: Prisma schema + Supabase clients"
```

---

### Task 3: Auth + Middleware

**Files:**
- Create: `middleware.ts`
- Create: `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`
- Create: `app/(auth)/layout.tsx`
- Create: `actions/auth.ts`
- Create: `app/api/webhooks/supabase/route.ts`

- [ ] **Step 1: Crear `middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAppRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/projects") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/onboarding")

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)"],
}
```

- [ ] **Step 2: Crear `actions/auth.ts`**

```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { data: { name: formData.get("name") as string } },
  })
  if (error) return { error: error.message }
  redirect("/onboarding")
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })
  if (error) return { error: error.message }
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/sign-in")
}
```

- [ ] **Step 3: Crear página de sign-in `app/(auth)/sign-in/page.tsx`**

```tsx
"use client"
import { signIn } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useActionState } from "react"

export default function SignInPage() {
  const [state, action, pending] = useActionState(signIn, undefined)
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/sign-up" className="text-primary underline">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Crear página de sign-up `app/(auth)/sign-up/page.tsx`**

```tsx
"use client"
import { signUp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useActionState } from "react"

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, undefined)
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/sign-in" className="text-primary underline">Inicia sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 5: Webhook Supabase → sincronizar tabla `users` `app/api/webhooks/supabase/route.ts`**

En Supabase Dashboard → Database → Webhooks: crear webhook en tabla `auth.users`, evento `INSERT`, apuntando a `{NEXT_PUBLIC_APP_URL}/api/webhooks/supabase` con header `x-webhook-secret: {valor de SUPABASE_WEBHOOK_SECRET}`.

Añadir a `.env.local`: `SUPABASE_WEBHOOK_SECRET=change-me-to-random-secret`

```ts
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret")
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { type, record } = body

  if (type === "INSERT" && record?.id) {
    await prisma.user.upsert({
      where: { id: record.id },
      update: {},
      create: {
        id: record.id,
        email: record.email,
        name: record.raw_user_meta_data?.name ?? null,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 6: Añadir `/onboarding` a las rutas protegidas del middleware**

En `middleware.ts`, actualizar `isAppRoute`:

```ts
const isAppRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
  request.nextUrl.pathname.startsWith("/projects") ||
  request.nextUrl.pathname.startsWith("/settings") ||
  request.nextUrl.pathname.startsWith("/onboarding")
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: auth (sign-in, sign-up, middleware, user sync webhook)"
```

---

## Phase 2: Core Business Logic

### Task 4: Onboarding + Workspace

**Files:**
- Create: `actions/workspaces.ts`
- Create: `app/onboarding/page.tsx` (fuera de `(app)`, no requiere workspace)
- Create: `app/(app)/layout.tsx`

- [ ] **Step 1: Crear `actions/workspaces.ts`**

```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const name = formData.get("name") as string
  if (!name?.trim()) return { error: "El nombre es obligatorio" }

  const workspace = await prisma.workspace.create({
    data: {
      name: name.trim(),
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
    },
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function getCurrentWorkspace(userId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  })
  return member
}
```

- [ ] **Step 2: Crear `app/onboarding/page.tsx`** (fuera del grupo `(app)` para evitar redirect loop)

```tsx
import { createWorkspace } from "@/actions/workspaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenido a ProjectTrack</CardTitle>
          <CardDescription>Crea tu espacio de trabajo para empezar</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createWorkspace} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de tu empresa o negocio</Label>
              <Input id="name" name="name" placeholder="Ej: Reformas García S.L." required />
            </div>
            <Button type="submit" className="w-full">Crear espacio de trabajo</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Crear layout protegido `app/(app)/layout.tsx`**

Nota: `/onboarding` está fuera de este grupo, por eso podemos redirigir sin loop.

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/actions/workspaces"
import AppShell from "@/components/layout/app-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  return <AppShell workspace={member.workspace}>{children}</AppShell>
}
```

- [ ] **Step 4: Crear `components/layout/app-shell.tsx`**

```tsx
"use client"
import Sidebar from "./sidebar"
import Header from "./header"
import type { Workspace } from "@prisma/client"

interface Props {
  workspace: Workspace | null
  children: React.ReactNode
}

export default function AppShell({ workspace, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspace={workspace} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header workspace={workspace} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Crear `components/layout/sidebar.tsx`**

```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Workspace } from "@prisma/client"

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proyectos", href: "/projects", icon: FolderOpen },
  { label: "Ajustes", href: "/settings", icon: Settings },
]

export default function Sidebar({ workspace }: { workspace: Workspace | null }) {
  const pathname = usePathname()
  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-bold text-primary">ProjectTrack</span>
      </div>
      <div className="px-4 py-2 text-xs font-medium text-muted-foreground truncate">
        {workspace?.name}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 6: Crear `components/layout/header.tsx`**

```tsx
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import type { Workspace } from "@prisma/client"

export default function Header({ workspace }: { workspace: Workspace | null }) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div />
      <form action={signOut}>
        <Button variant="ghost" size="sm" type="submit">Cerrar sesión</Button>
      </form>
    </header>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: onboarding, workspace creation, app shell"
```

---

### Task 5: Projects CRUD

**Files:**
- Create: `actions/projects.ts`
- Create: `app/api/projects/route.ts`, `app/api/projects/[id]/route.ts`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/projects/new/page.tsx`
- Create: `app/(app)/projects/[id]/page.tsx`
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/project-form.tsx`

- [ ] **Step 1: Crear `actions/projects.ts`**

```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentWorkspace } from "./workspaces"
import type { ProjectStatus } from "@prisma/client"

async function getWorkspaceOrThrow() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")
  return member
}

export async function createProject(formData: FormData) {
  const member = await getWorkspaceOrThrow()

  // Plan FREE: máximo 1 proyecto activo
  if (member.workspace.plan === "FREE") {
    const count = await prisma.project.count({
      where: { workspaceId: member.workspaceId, status: "ACTIVE" },
    })
    if (count >= 1) return { error: "El plan FREE permite solo 1 proyecto activo. Actualiza a PRO." }
  }

  if (member.role === "VIEWER") return { error: "No tienes permisos para crear proyectos" }

  const project = await prisma.project.create({
    data: {
      workspaceId: member.workspaceId,
      name: formData.get("name") as string,
      client: (formData.get("client") as string) || null,
      budget: parseFloat(formData.get("budget") as string),
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : null,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
    },
  })

  revalidatePath("/dashboard")
  redirect(`/projects/${project.id}`)
}

export async function updateProject(id: string, formData: FormData) {
  const member = await getWorkspaceOrThrow()
  if (member.role === "VIEWER") return { error: "Sin permisos" }

  await prisma.project.update({
    where: { id, workspaceId: member.workspaceId },
    data: {
      name: formData.get("name") as string,
      client: (formData.get("client") as string) || null,
      budget: parseFloat(formData.get("budget") as string),
      status: formData.get("status") as ProjectStatus,
    },
  })
  revalidatePath(`/projects/${id}`)
}

export async function deleteProject(id: string) {
  const member = await getWorkspaceOrThrow()
  if (!["OWNER", "EDITOR"].includes(member.role)) return { error: "Sin permisos" }
  await prisma.project.delete({ where: { id, workspaceId: member.workspaceId } })
  revalidatePath("/dashboard")
  redirect("/dashboard")
}
```

- [ ] **Step 2: Crear `components/projects/project-form.tsx`**

```tsx
"use client"
import { createProject } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"

export default function ProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined)
  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del proyecto *</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client">Cliente</Label>
        <Input id="client" name="client" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Presupuesto (€) *</Label>
        <Input id="budget" name="budget" type="number" step="0.01" min="0" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha inicio</Label>
          <Input id="startDate" name="startDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha fin</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Creando…" : "Crear proyecto"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Crear `components/projects/project-card.tsx`**

```tsx
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@prisma/client"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{project.name}</CardTitle>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          {project.client && <p className="text-sm text-muted-foreground">{project.client}</p>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Presupuesto:{" "}
            <span className="tabular-nums font-medium text-foreground">
              {Number(project.budget).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 4: Crear `app/(app)/dashboard/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/actions/workspaces"
import ProjectCard from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const projects = await prisma.project.findMany({
    where: { workspaceId: member.workspaceId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proyectos activos</h1>
        <Button asChild>
          <Link href="/projects/new">Nuevo proyecto</Link>
        </Button>
      </div>
      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No tienes proyectos activos.</p>
          <Button asChild className="mt-4">
            <Link href="/projects/new">Crear primer proyecto</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Crear `app/(app)/projects/new/page.tsx`**

```tsx
import ProjectForm from "@/components/projects/project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo proyecto</h1>
      <ProjectForm />
    </div>
  )
}
```

- [ ] **Step 6: Crear `app/(app)/projects/[id]/page.tsx` (shell, dashboard financiero se completa en Task 8)**

```tsx
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getCurrentWorkspace } from "@/actions/workspaces"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: member.workspaceId },
    include: { invoices: { orderBy: { createdAt: "desc" }, take: 5 } },
  })
  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.client && <p className="text-muted-foreground">{project.client}</p>}
        </div>
        <Button asChild>
          <Link href={`/projects/${id}/invoices/new`}>Añadir factura</Link>
        </Button>
      </div>
      {/* Dashboard financiero: se añade en Task 8 */}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: projects CRUD (create, list, detail)"
```

---

### Task 6: Invoices CRUD (manual)

**Files:**
- Create: `actions/invoices.ts`
- Create: `components/invoices/invoice-form.tsx`
- Create: `components/invoices/invoice-list.tsx`
- Create: `app/(app)/projects/[id]/invoices/page.tsx`
- Create: `app/(app)/projects/[id]/invoices/new/page.tsx`

- [ ] **Step 1: Crear `actions/invoices.ts`**

```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentWorkspace } from "./workspaces"
import type { InvoiceType, InvoiceStatus } from "@prisma/client"

async function getMemberOrThrow() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")
  return member
}

export async function createInvoice(projectId: string, formData: FormData) {
  const member = await getMemberOrThrow()
  if (member.role === "VIEWER") return { error: "Sin permisos" }

  // Plan FREE: máximo 20 facturas/mes
  if (member.workspace.plan === "FREE") {
    const start = new Date(); start.setDate(1); start.setHours(0,0,0,0)
    const count = await prisma.invoice.count({
      where: { workspaceId: member.workspaceId, createdAt: { gte: start } },
    })
    if (count >= 20) return { error: "Límite de 20 facturas/mes en plan FREE. Actualiza a PRO." }
  }

  const base = parseFloat(formData.get("base") as string)
  const vat = parseFloat(formData.get("vat") as string) || 21
  const total = base * (1 + vat / 100)

  await prisma.invoice.create({
    data: {
      workspaceId: member.workspaceId,
      projectId,
      type: formData.get("type") as InvoiceType,
      number: (formData.get("number") as string) || null,
      counterparty: (formData.get("counterparty") as string) || null,
      nif: (formData.get("nif") as string) || null,
      base,
      vat,
      total,
      currency: "EUR",
      issueDate: formData.get("issueDate") ? new Date(formData.get("issueDate") as string) : null,
      dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
      status: (formData.get("status") as InvoiceStatus) || "PENDING",
      notes: (formData.get("notes") as string) || null,
    },
  })

  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}/invoices`)
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus, projectId: string) {
  const member = await getMemberOrThrow()
  if (member.role === "VIEWER") return { error: "Sin permisos" }
  await prisma.invoice.update({
    where: { id, workspaceId: member.workspaceId },
    data: { status },
  })
  revalidatePath(`/projects/${projectId}`)
}

export async function deleteInvoice(id: string, projectId: string) {
  const member = await getMemberOrThrow()
  if (member.role === "VIEWER") return { error: "Sin permisos" }
  await prisma.invoice.delete({ where: { id, workspaceId: member.workspaceId } })
  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}/invoices`)
}
```

- [ ] **Step 2: Crear `components/invoices/invoice-form.tsx`**

```tsx
"use client"
import { createInvoice } from "@/actions/invoices"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useActionState } from "react"

interface Props {
  projectId: string
  defaultValues?: Partial<{
    type: string; number: string; counterparty: string; nif: string
    base: string; vat: string; issueDate: string; dueDate: string; notes: string
  }>
}

export default function InvoiceForm({ projectId, defaultValues = {} }: Props) {
  const action = createInvoice.bind(null, projectId)
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select name="type" defaultValue={defaultValues.type || "EXPENSE"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Gasto</SelectItem>
              <SelectItem value="INCOME">Ingreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Nº factura</Label>
          <Input id="number" name="number" defaultValue={defaultValues.number} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="counterparty">Contraparte</Label>
          <Input id="counterparty" name="counterparty" defaultValue={defaultValues.counterparty} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nif">NIF</Label>
          <Input id="nif" name="nif" defaultValue={defaultValues.nif} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base">Base imponible (€) *</Label>
          <Input id="base" name="base" type="number" step="0.01" min="0"
            defaultValue={defaultValues.base} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vat">IVA (%)</Label>
          <Input id="vat" name="vat" type="number" step="0.01" defaultValue={defaultValues.vat || "21"} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Fecha emisión</Label>
          <Input id="issueDate" name="issueDate" type="date" defaultValue={defaultValues.issueDate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha vencimiento</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={defaultValues.dueDate} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={defaultValues.notes} />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar factura"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Crear `components/invoices/invoice-list.tsx`**

```tsx
import type { Invoice } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
}

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay facturas.</p>
  }
  return (
    <div className="divide-y rounded-lg border">
      {invoices.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">
              {inv.type === "INCOME" ? "↑" : "↓"} {inv.counterparty || "—"}
              {inv.number && <span className="ml-2 text-xs text-muted-foreground">#{inv.number}</span>}
            </p>
            {inv.issueDate && (
              <p className="text-xs text-muted-foreground">
                {new Date(inv.issueDate).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[inv.status]}`}>
              {inv.status}
            </span>
            <span className="tabular-nums text-sm font-medium">
              {Number(inv.total).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Crear `app/(app)/projects/[id]/invoices/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getCurrentWorkspace } from "@/actions/workspaces"
import InvoiceList from "@/components/invoices/invoice-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function InvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: member.workspaceId },
  })
  if (!project) notFound()

  const invoices = await prisma.invoice.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Facturas — {project.name}</h1>
        <Button asChild>
          <Link href={`/projects/${id}/invoices/new`}>Añadir factura</Link>
        </Button>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  )
}
```

- [ ] **Step 5: Crear `app/(app)/projects/[id]/invoices/new/page.tsx`**

```tsx
import InvoiceForm from "@/components/invoices/invoice-form"
import InvoiceUploader from "@/components/invoices/invoice-uploader"

export default async function NewInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Nueva factura</h1>
      <InvoiceUploader projectId={id} />
      <div>
        <h2 className="mb-4 font-semibold">O introduce manualmente</h2>
        <InvoiceForm projectId={id} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: invoices CRUD (create, list, delete)"
```

---

### Task 7: File Upload + OCR con Claude API

**Files:**
- Create: `lib/claude.ts`
- Create: `app/api/invoices/scan/route.ts`
- Create: `components/invoices/invoice-uploader.tsx`
- Create: `components/invoices/ocr-preview-modal.tsx`

- [ ] **Step 1: Añadir a `.env.local`**

```env
ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 2: Crear `lib/claude.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
```

- [ ] **Step 3: Configurar bucket en Supabase Storage**

En Supabase Dashboard → Storage: crear bucket `invoices` con acceso **privado**.

- [ ] **Step 4: Crear `app/api/invoices/scan/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server"
import { anthropic } from "@/lib/claude"
import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `Eres un asistente experto en extracción de datos de facturas españolas.
Extrae los siguientes campos del documento y devuelve SOLO un JSON válido, sin markdown, sin explicaciones:
{
  "number": string | null,
  "counterparty": string | null,
  "nif": string | null,
  "base": number | null,
  "vat": number | null,
  "total": number | null,
  "issueDate": "YYYY-MM-DD" | null,
  "currency": "EUR" | string,
  "confidence": number (0-1)
}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString("base64")
  const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "application/pdf"

  const isPdf = mimeType === "application/pdf"

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: isPdf
          ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }]
          : [{ type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
             { type: "text", text: "Extrae los datos de esta factura." }],
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  // Subir archivo a Supabase Storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`
  const { data: storageData } = await supabase.storage
    .from("invoices")
    .upload(fileName, buffer, { contentType: mimeType })

  const fileUrl = storageData?.path
    ? supabase.storage.from("invoices").getPublicUrl(storageData.path).data.publicUrl
    : null

  try {
    const extracted = JSON.parse(text)
    return NextResponse.json({ ...extracted, fileUrl })
  } catch {
    return NextResponse.json({ confidence: 0, fileUrl, raw: text })
  }
}
```

- [ ] **Step 5: Crear `components/invoices/invoice-uploader.tsx`**

```tsx
"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera } from "lucide-react"
import OcrPreviewModal from "./ocr-preview-modal"

interface OcrResult {
  number?: string; counterparty?: string; nif?: string
  base?: number; vat?: number; total?: number
  issueDate?: string; currency?: string
  confidence?: number; fileUrl?: string
}

export default function InvoiceUploader({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OcrResult | null>(null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/invoices/scan", { method: "POST", body: fd })
    const data = await res.json()
    setResult(data)
    setLoading(false)
    setOpen(true)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/30 p-10 text-center"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Arrastra una factura aquí</p>
          <p className="text-sm text-muted-foreground">JPG, PNG o PDF · Extracción automática con IA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={loading} onClick={() => inputRef.current?.click()}>
            {loading ? "Procesando…" : "Seleccionar archivo"}
          </Button>
          <Button variant="outline" disabled={loading}
            onClick={() => { if (inputRef.current) { inputRef.current.capture = "environment"; inputRef.current.click() } }}>
            <Camera className="mr-2 h-4 w-4" /> Cámara
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      {result && (
        <OcrPreviewModal
          open={open}
          onClose={() => setOpen(false)}
          result={result}
          projectId={projectId}
        />
      )}
    </>
  )
}
```

- [ ] **Step 6: Crear `components/invoices/ocr-preview-modal.tsx`**

```tsx
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import InvoiceForm from "./invoice-form"
import { Badge } from "@/components/ui/badge"

interface OcrResult {
  number?: string; counterparty?: string; nif?: string
  base?: number; vat?: number; issueDate?: string
  fileUrl?: string; confidence?: number
}

interface Props {
  open: boolean
  onClose: () => void
  result: OcrResult
  projectId: string
}

export default function OcrPreviewModal({ open, onClose, result, projectId }: Props) {
  const confidence = result.confidence ?? 0
  const confidenceColor = confidence > 0.8 ? "bg-green-100 text-green-800" : confidence > 0.5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Datos extraídos por IA
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${confidenceColor}`}>
              {Math.round(confidence * 100)}% confianza
            </span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Revisa y corrige los datos antes de guardar.</p>
        <InvoiceForm
          projectId={projectId}
          defaultValues={{
            number: result.number,
            counterparty: result.counterparty,
            nif: result.nif,
            base: result.base?.toString(),
            vat: result.vat?.toString(),
            issueDate: result.issueDate,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: file upload + OCR con Claude API"
```

---

### Task 8: Dashboard Financiero del Proyecto

**Files:**
- Create: `app/api/projects/[id]/metrics/route.ts`
- Create: `components/projects/budget-progress.tsx`
- Create: `components/projects/financial-summary.tsx`
- Create: `components/projects/deviation-alert.tsx`
- Modify: `app/(app)/projects/[id]/page.tsx`

- [ ] **Step 1: Crear `app/api/projects/[id]/metrics/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getCurrentWorkspace } from "@/actions/workspaces"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const member = await getCurrentWorkspace(user.id)
  if (!member) return NextResponse.json({ error: "No workspace" }, { status: 403 })

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: member.workspaceId },
    include: { invoices: true },
  })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const expenses = project.invoices
    .filter((i) => i.type === "EXPENSE")
    .reduce((sum, i) => sum + Number(i.total), 0)

  const income = project.invoices
    .filter((i) => i.type === "INCOME" && i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.total), 0)

  const budget = Number(project.budget)
  const profit = income - expenses
  const deviation = budget > 0 ? ((expenses - budget) / budget) * 100 : 0
  const budgetUsedPct = budget > 0 ? Math.min((expenses / budget) * 100, 100) : 0

  return NextResponse.json({ budget, expenses, income, profit, deviation, budgetUsedPct })
}
```

- [ ] **Step 2: Crear `components/projects/budget-progress.tsx`**

```tsx
interface Props {
  pct: number   // 0-100
  label: string
}

export default function BudgetProgress({ pct, label }: Props) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (pct / 100) * circumference
  const color = pct > 90 ? "#DC2626" : pct > 70 ? "#D97706" : "#2563EB"

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={128} height={128} viewBox="0 0 128 128">
        <circle cx={64} cy={64} r={r} fill="none" stroke="#e5e7eb" strokeWidth={12} />
        <circle
          cx={64} cy={64} r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text x={64} y={64} textAnchor="middle" dominantBaseline="middle"
          className="tabular-nums" style={{ fontSize: 20, fontWeight: 700, fill: color }}>
          {Math.round(pct)}%
        </text>
      </svg>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
```

- [ ] **Step 3: Crear `components/projects/financial-summary.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

interface Props {
  income: number
  expenses: number
  profit: number
}

export default function FinancialSummary({ income, expenses, profit }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm text-muted-foreground">Ingresos cobrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tabular-nums text-2xl font-bold text-green-600">{fmt(income)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm text-muted-foreground">Gastos totales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tabular-nums text-2xl font-bold text-red-600">{fmt(expenses)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm text-muted-foreground">Beneficio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`tabular-nums text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(profit)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Crear `components/projects/deviation-alert.tsx`**

```tsx
import { AlertTriangle } from "lucide-react"

export default function DeviationAlert({ deviation }: { deviation: number }) {
  if (Math.abs(deviation) <= 10) return null
  const over = deviation > 0
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
      over ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"
    }`}>
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {over
        ? `Desviación de +${deviation.toFixed(1)}% sobre presupuesto`
        : `Por debajo del presupuesto en ${Math.abs(deviation).toFixed(1)}%`}
    </div>
  )
}
```

- [ ] **Step 5: Actualizar `app/(app)/projects/[id]/page.tsx` con el dashboard financiero**

Reemplazar el contenido del archivo con:

```tsx
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getCurrentWorkspace } from "@/actions/workspaces"
import BudgetProgress from "@/components/projects/budget-progress"
import FinancialSummary from "@/components/projects/financial-summary"
import DeviationAlert from "@/components/projects/deviation-alert"
import InvoiceList from "@/components/invoices/invoice-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const project = await prisma.project.findFirst({
    where: { id, workspaceId: member.workspaceId },
    include: { invoices: { orderBy: { createdAt: "desc" }, take: 5 } },
  })
  if (!project) notFound()

  const allInvoices = await prisma.invoice.findMany({ where: { projectId: id } })

  const expenses = allInvoices.filter(i => i.type === "EXPENSE").reduce((s, i) => s + Number(i.total), 0)
  const income = allInvoices.filter(i => i.type === "INCOME" && i.status === "PAID").reduce((s, i) => s + Number(i.total), 0)
  const budget = Number(project.budget)
  const profit = income - expenses
  const deviation = budget > 0 ? ((expenses - budget) / budget) * 100 : 0
  const budgetUsedPct = budget > 0 ? Math.min((expenses / budget) * 100, 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.client && <p className="text-muted-foreground">{project.client}</p>}
        </div>
        <Button asChild>
          <Link href={`/projects/${id}/invoices/new`}>Añadir factura</Link>
        </Button>
      </div>

      <DeviationAlert deviation={deviation} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <BudgetProgress pct={budgetUsedPct} label="Presupuesto usado" />
        <div className="flex-1">
          <FinancialSummary income={income} expenses={expenses} profit={profit} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Últimas facturas</h2>
          <Link href={`/projects/${id}/invoices`} className="text-sm text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        <InvoiceList invoices={project.invoices} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: project financial dashboard (budget ring, KPI cards, deviation alert)"
```

---

### Task 9: Dashboard General

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`

El dashboard general ya existe (Task 5). Esta tarea añade métricas agregadas del workspace.

- [ ] **Step 1: Actualizar `app/(app)/dashboard/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/actions/workspaces"
import ProjectCard from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const [projects, invoices] = await Promise.all([
    prisma.project.findMany({
      where: { workspaceId: member.workspaceId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({ where: { workspaceId: member.workspaceId } }),
  ])

  const totalIncome = invoices.filter(i => i.type === "INCOME" && i.status === "PAID")
    .reduce((s, i) => s + Number(i.total), 0)
  const totalExpenses = invoices.filter(i => i.type === "EXPENSE")
    .reduce((s, i) => s + Number(i.total), 0)
  const pendingInvoices = invoices.filter(i => i.status === "PENDING").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/projects/new">Nuevo proyecto</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Ingresos totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="tabular-nums text-xl font-bold text-green-600">{fmt(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Gastos totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="tabular-nums text-xl font-bold text-red-600">{fmt(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Facturas pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="tabular-nums text-xl font-bold">{pendingInvoices}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="font-semibold">Proyectos activos</h2>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No tienes proyectos activos.</p>
          <Button asChild className="mt-4"><Link href="/projects/new">Crear primer proyecto</Link></Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: general dashboard with workspace KPIs"
```

---

## Phase 3: Advanced Features

### Task 10: Colaboradores + Invitaciones (Resend)

**Files:**
- Create: `lib/resend.ts`
- Create: `actions/members.ts`
- Create: `app/(app)/settings/team/page.tsx`
- Create: `app/api/workspaces/[id]/members/route.ts`

- [ ] **Step 1: Añadir a `.env.local`**

```env
RESEND_API_KEY=re_...
```

- [ ] **Step 2: Crear `lib/resend.ts`**

```ts
import { Resend } from "resend"
export const resend = new Resend(process.env.RESEND_API_KEY)
```

- [ ] **Step 3: Crear `actions/members.ts`**

```ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getCurrentWorkspace } from "./workspaces"
import { resend } from "@/lib/resend"
import { SignJWT, jwtVerify } from "jose"
import type { MemberRole } from "@prisma/client"

const secret = new TextEncoder().encode(process.env.INVITATION_JWT_SECRET!)

async function getOwnerOrThrow() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member || member.role !== "OWNER") throw new Error("Solo el OWNER puede gestionar miembros")
  return member
}

export async function inviteMember(formData: FormData) {
  const owner = await getOwnerOrThrow()
  const email = formData.get("email") as string
  const role = (formData.get("role") as MemberRole) || "EDITOR"

  const token = await new SignJWT({ email, workspaceId: owner.workspaceId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`

  await resend.emails.send({
    from: "ProjectTrack <noreply@project-track.app>",
    to: email,
    subject: `Te han invitado a ${owner.workspace.name} en ProjectTrack`,
    html: `
      <p>Has sido invitado a unirte al espacio de trabajo <strong>${owner.workspace.name}</strong> en ProjectTrack como <strong>${role}</strong>.</p>
      <p><a href="${inviteUrl}">Aceptar invitación</a></p>
      <p>Este enlace expira en 7 días.</p>
    `,
  })

  revalidatePath("/settings/team")
  return { ok: true }
}

export async function acceptInvitation(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const { payload } = await jwtVerify(token, secret)
  const { workspaceId, role } = payload as { workspaceId: string; role: MemberRole; email: string }

  await prisma.workspaceMember.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId } },
    update: { role },
    create: { userId: user.id, workspaceId, role },
  })

  redirect("/dashboard")
}

export async function removeMember(memberId: string) {
  const owner = await getOwnerOrThrow()
  const target = await prisma.workspaceMember.findUnique({ where: { id: memberId } })
  if (!target || target.workspaceId !== owner.workspaceId) return { error: "No encontrado" }
  if (target.role === "OWNER") return { error: "No puedes eliminar al OWNER" }
  await prisma.workspaceMember.delete({ where: { id: memberId } })
  revalidatePath("/settings/team")
}
```

- [ ] **Step 4: Crear `app/(app)/settings/team/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentWorkspace } from "@/actions/workspaces"
import { inviteMember, removeMember } from "@/actions/members"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")
  const isOwner = member.role === "OWNER"

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: member.workspaceId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Equipo</h1>

      <div className="divide-y rounded-lg border">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{m.user.name || m.user.email}</p>
              <p className="text-sm text-muted-foreground">{m.user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{m.role}</span>
              {isOwner && m.role !== "OWNER" && (
                <form action={removeMember.bind(null, m.id)}>
                  <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700">
                    Eliminar
                  </Button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="space-y-4">
          <h2 className="font-semibold">Invitar miembro</h2>
          <form action={inviteMember} className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1">
              <Label>Rol</Label>
              <Select name="role" defaultValue="EDITOR">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="self-end">Invitar</Button>
          </form>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Crear página de aceptar invitación `app/(app)/invite/page.tsx`**

```tsx
import { acceptInvitation } from "@/actions/members"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams

  if (!token) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-red-600">Enlace de invitación inválido.</p>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Aceptar invitación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Haz clic para unirte al espacio de trabajo.
          </p>
          <form action={acceptInvitation.bind(null, token)}>
            <Button type="submit" className="w-full">Aceptar invitación</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: team management + email invitations (Resend + JWT)"
```

---

### Task 11: Stripe Suscripciones

**Files:**
- Create: `lib/stripe.ts`
- Create: `app/api/checkout/route.ts`
- Create: `app/api/webhooks/stripe/route.ts`
- Create: `app/(app)/settings/billing/page.tsx`

- [ ] **Step 1: Añadir a `.env.local`**

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
```

Para obtener `STRIPE_PRO_PRICE_ID`: Stripe Dashboard → Products → Crear "ProjectTrack PRO" con precio mensual → copiar Price ID.

- [ ] **Step 2: Crear `lib/stripe.ts`**

```ts
import Stripe from "stripe"
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" })
```

- [ ] **Step 3: Crear `app/api/checkout/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { getCurrentWorkspace } from "@/actions/workspaces"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const member = await getCurrentWorkspace(user.id)
  if (!member || member.role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const workspace = member.workspace

  // Obtener o crear customer de Stripe
  let customerId = workspace.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { workspaceId: workspace.id },
    })
    customerId = customer.id
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?cancel=1`,
    metadata: { workspaceId: workspace.id },
  })

  return NextResponse.json({ url: session.url })
}
```

- [ ] **Step 4: Crear `app/api/webhooks/stripe/route.ts`**

```ts
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription

  if (event.type === "checkout.session.completed") {
    const s = session as Stripe.Checkout.Session
    const workspaceId = s.metadata?.workspaceId
    if (workspaceId) {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          plan: "PRO",
          subscriptionStatus: "ACTIVE",
          stripeSubscriptionId: s.subscription as string,
        },
      })
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = session as Stripe.Subscription
    const workspace = await prisma.workspace.findFirst({
      where: { stripeSubscriptionId: sub.id },
    })
    if (workspace) {
      await prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          plan: sub.status === "active" ? "PRO" : "FREE",
          subscriptionStatus: sub.status.toUpperCase() as any,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 5: Crear `app/(app)/settings/billing/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentWorkspace } from "@/actions/workspaces"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function checkout() {
  "use server"
  // Este server action se invoca desde el form
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, { method: "POST" })
  const { url } = await res.json()
  redirect(url)
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")
  const member = await getCurrentWorkspace(user.id)
  if (!member) redirect("/onboarding")

  const { workspace } = member
  const isPro = workspace.plan === "PRO"

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Facturación</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plan actual: {isPro ? "PRO" : "FREE"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <p className="text-sm text-muted-foreground">
              Tienes acceso a proyectos y facturas ilimitados.
              Estado: {workspace.subscriptionStatus}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Plan FREE: 1 proyecto activo · 20 facturas/mes
              </p>
              {member.role === "OWNER" && (
                <form action={checkout}>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Actualizar a PRO
                  </Button>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 6: Configurar Stripe webhook localmente para testing**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copiar el `whsec_...` que genera y ponerlo en `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: Stripe subscriptions (checkout, webhooks, billing page)"
```

---

### Task 12: Landing Page

**Files:**
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/pricing/page.tsx`

- [ ] **Step 1: Crear `app/(marketing)/layout.tsx`**

```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-primary">ProjectTrack</span>
          <nav className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Precios</a>
            <a href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">Entrar</a>
            <a href="/sign-up" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Empezar gratis
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProjectTrack
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Crear `app/(marketing)/page.tsx`**

```tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, Zap, Shield } from "lucide-react"

const features = [
  { icon: Zap, title: "OCR en < 30 segundos", desc: "Fotografía una factura y extrae todos los datos automáticamente con IA." },
  { icon: BarChart3, title: "Dashboard financiero", desc: "Presupuesto vs. gasto real, ingresos cobrados y rentabilidad en tiempo real." },
  { icon: FileText, title: "Gestión de facturas", desc: "Organiza gastos e ingresos por proyecto con filtros y estados personalizables." },
  { icon: Shield, title: "Seguro y privado", desc: "Datos cifrados, autenticación robusta y control de acceso por roles." },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Controla la rentabilidad<br />de tus obras al instante
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          ProjectTrack es la herramienta financiera para autónomos y pequeñas empresas constructoras.
          Registra facturas con OCR, visualiza presupuesto vs. real y toma decisiones con datos.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/sign-up">Empezar gratis</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">Ver precios</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">Todo lo que necesitas</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-background p-6 shadow-sm">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">¿Listo para controlar tus obras?</h2>
        <p className="mt-4 text-muted-foreground">Empieza gratis. Sin tarjeta de crédito.</p>
        <Button asChild size="lg" className="mt-8 bg-orange-500 hover:bg-orange-600">
          <Link href="/sign-up">Crear cuenta gratis</Link>
        </Button>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Crear `app/(marketing)/pricing/page.tsx`**

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "FREE",
    price: "0€",
    period: "/mes",
    features: ["1 proyecto activo", "20 facturas/mes", "OCR con IA", "Dashboard financiero"],
    cta: "Empezar gratis",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "PRO",
    price: "19€",
    period: "/mes",
    features: ["Proyectos ilimitados", "Facturas ilimitadas", "OCR con IA", "Dashboard financiero",
      "Colaboradores con roles", "Soporte prioritario"],
    cta: "Empezar con PRO",
    href: "/sign-up",
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="mb-4 text-center text-4xl font-bold">Precios simples y transparentes</h1>
      <p className="mb-16 text-center text-muted-foreground">Sin sorpresas. Cancela cuando quieras.</p>
      <div className="grid gap-8 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.highlight ? "border-primary shadow-lg" : ""}>
            {plan.highlight && (
              <div className="rounded-t-lg bg-primary py-1 text-center text-xs font-medium text-white">
                Más popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="tabular-nums text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full ${plan.highlight ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                variant={plan.highlight ? "default" : "outline"}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: landing page (hero, features, pricing, CTA)"
```

---

## Phase 4: Polish & Deploy

### Task 13: Polish + Accesibilidad

**Files:**
- Create: `app/(app)/settings/page.tsx`
- Modify: `components/layout/sidebar.tsx` (añadir loading states)
- Modify: `app/(app)/projects/[id]/page.tsx` (añadir loading.tsx)

- [ ] **Step 1: Crear `app/(app)/settings/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <Card>
        <CardHeader><CardTitle>Cuenta</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <nav className="space-y-1">
            <Link href="/settings/team" className="block text-sm text-primary hover:underline">Gestionar equipo →</Link>
            <Link href="/settings/billing" className="block text-sm text-primary hover:underline">Plan y facturación →</Link>
          </nav>
        </CardContent>
      </Card>
      <form action={signOut}>
        <Button variant="destructive" type="submit">Cerrar sesión</Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Añadir loading skeletons — crear `app/(app)/dashboard/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-36 rounded-lg" />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Añadir `app/(app)/projects/[id]/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
      <Skeleton className="h-48 rounded-lg" />
    </div>
  )
}
```

- [ ] **Step 4: Añadir `not-found.tsx` global**

Crear `app/not-found.tsx`:

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página no encontrada</p>
      <Button asChild><Link href="/dashboard">Volver al dashboard</Link></Button>
    </div>
  )
}
```

- [ ] **Step 5: Añadir aria-labels a botones icon-only en sidebar**

En `components/layout/sidebar.tsx`, cada `<Link>` ya tiene texto visible — verificar que no hay iconos sin texto accesible.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: settings page, loading skeletons, 404, a11y review"
```

---

### Task 14: Deploy a Vercel

**Files:**
- Create: `next.config.ts` (verificar configuración)

- [ ] **Step 1: Verificar `next.config.ts`**

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
}

export default nextConfig
```

- [ ] **Step 2: Añadir `.env.local` a `.gitignore` (ya debería estar)**

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 3: Subir a GitHub**

```bash
gh repo create project-track --private --source=. --push
```

- [ ] **Step 4: Conectar con Vercel**

Ir a [vercel.com/new](https://vercel.com/new) → Import desde GitHub → seleccionar `project-track`.

Framework: **Next.js** (auto-detectado). Root directory: `/`.

- [ ] **Step 5: Configurar variables de entorno en Vercel**

En Vercel → Settings → Environment Variables, añadir todas las variables de `.env.local` excepto `NEXT_PUBLIC_APP_URL` (poner la URL de Vercel) y `DATABASE_URL`/`DIRECT_URL` (usar las de producción de Supabase).

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL               # usar connection pooling (puerto 6543)
DIRECT_URL                 # usar direct connection (puerto 5432)
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET      # crear nuevo webhook en Stripe apuntando al dominio de Vercel
STRIPE_PRO_PRICE_ID
RESEND_API_KEY
ANTHROPIC_API_KEY
NEXT_PUBLIC_APP_URL        # https://project-track.vercel.app (o dominio personalizado)
INVITATION_JWT_SECRET
SUPABASE_WEBHOOK_SECRET
```

- [ ] **Step 6: Actualizar webhook de Supabase**

En Supabase Dashboard → Database → Webhooks: actualizar la URL del webhook de auth a `https://project-track.vercel.app/api/webhooks/supabase`.

- [ ] **Step 7: Actualizar webhook de Stripe**

En Stripe Dashboard → Developers → Webhooks: añadir endpoint `https://project-track.vercel.app/api/webhooks/stripe` con eventos:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

- [ ] **Step 8: Ejecutar migraciones en producción**

```bash
DATABASE_URL="<production-url>" pnpm prisma migrate deploy
```

- [ ] **Step 9: Verificar deploy**

Abrir la URL de Vercel y verificar:
1. Landing page carga correctamente
2. Sign-up crea usuario y redirige a onboarding
3. Onboarding crea workspace y redirige a dashboard
4. Se puede crear un proyecto
5. Se puede añadir una factura (manual)
6. OCR funciona con una imagen de prueba

- [ ] **Step 10: Commit final**

```bash
git add .
git commit -m "feat: deploy config + Vercel setup instructions"
git push origin main
```

---

## Checklist de Variables de Entorno

| Variable | Fuente |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | Supabase Dashboard → Settings → Database (Transaction mode, 6543) |
| `DIRECT_URL` | Supabase Dashboard → Settings → Database (Session mode, 5432) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` (local) / Stripe Dashboard webhook (prod) |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Products → PRO → Price ID |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` (local) / URL de Vercel (prod) |
| `INVITATION_JWT_SECRET` | Generar: `openssl rand -base64 32` |
| `SUPABASE_WEBHOOK_SECRET` | Generar: `openssl rand -base64 32` |
