# ProjectTrack

## Descripcion
Sistema de gestion de proyectos y control financiero para autonomos y pequenas empresas en Espana. NO es un sistema de facturacion — es una herramienta complementaria para controlar proyectos, ingresos, gastos y obligaciones fiscales.

## Stack tecnologico
- **Frontend**: Next.js 16.2.2 (Turbopack, App Router)
- **Base de datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 7 con PrismaPg adapter
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (facturas/tickets)
- **Pagos**: Stripe (suscripciones)
- **IA/OCR**: Anthropic Claude (extraccion de datos de facturas)
- **Email**: Resend (pendiente de configuracion)
- **Deploy**: Vercel
- **UI**: Tailwind CSS + shadcn/ui (Base UI)
- **Charts**: Recharts

## Funcionalidades principales
- Gestion de proyectos con presupuesto, IVA e IRPF configurables
- Registro de ingresos/cobros por proyecto
- Control de gastos con reparto entre proyectos
- OCR inteligente: sube foto/PDF de ticket -> IA extrae datos
- Dashboard financiero con 5 graficos (ingresos vs gastos, categorias, beneficio neto, reserva fiscal, proximos cobros)
- Estimacion fiscal trimestral (IVA repercutido/soportado, IRPF, pago fraccionado)
- Reportes trimestrales exportables en CSV para el contador
- Sistema "no declarar" para gestion interna sin afectar la declaracion
- Landing page profesional con typewriter, testimonios, feature tabs
- Responsive (sidebar drawer en movil)
- 2 planes: Starter (gratis) y PRO (14,99 EUR/mes)

## Variables de entorno necesarias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
RESEND_API_KEY=
ANTHROPIC_API_KEY=
```

## Estructura del proyecto
```
app/
├── (auth)/          # Login, Register
├── (dashboard)/     # App principal
│   ├── dashboard/   # Dashboard financiero
│   ├── projects/    # Gestion de proyectos
│   ├── invoices/    # Facturas emitidas (ingresos)
│   ├── expenses/    # Gastos / Compras
│   ├── reports/     # Reportes trimestrales
│   └── settings/    # Billing, Members
├── (onboarding)/    # Onboarding wizard
├── api/
│   ├── ocr/         # Extraccion OCR con Claude AI
│   ├── stripe/      # Webhooks y checkout
│   └── invoices/    # Upload de archivos
├── faq/             # Preguntas frecuentes (publico)
└── page.tsx         # Landing page

components/
├── app/             # Componentes de la aplicacion
├── charts/          # Graficos (Recharts)
├── landing/         # Componentes de la landing page
└── ui/              # shadcn/ui components

lib/
├── prisma.ts        # Cliente Prisma
├── supabase/        # Cliente Supabase
├── stripe.ts        # Cliente Stripe
├── anthropic.ts     # Cliente Anthropic
├── workspace.ts     # Helper de workspace
├── format.ts        # Formateo de moneda/fecha (es-ES)
└── chart-data.ts    # Utilidades de graficos
```

## Comandos
```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de produccion
pnpm db:push      # Push schema a la DB
pnpm db:studio    # Prisma Studio
```

## Despliegue
- **Produccion**: https://project-track-ruby.vercel.app
- **Vercel**: Deploy via CLI (`npx vercel --prod`)
- **Build command**: `pnpm prisma generate && pnpm next build`

## Modelos de datos principales
- **Workspace**: Espacio de trabajo (empresa/autonomo)
- **Project**: Proyecto con presupuesto, IVA, IRPF, cliente
- **Invoice**: Factura (tipo INCOME o EXPENSE)
- **ExpenseAllocation**: Reparto de gasto entre proyectos
- **InvoiceFile**: Archivos adjuntos con datos OCR

## Estado del proyecto
- [x] Auth + Onboarding
- [x] CRUD de proyectos con campos fiscales
- [x] Ingresos con desglose base/IVA/IRPF
- [x] Gastos con reparto entre proyectos
- [x] OCR inteligente con Claude AI
- [x] Dashboard con 5 graficos
- [x] Estimacion fiscal trimestral
- [x] Reportes CSV para el contador
- [x] Landing page profesional
- [x] FAQ
- [x] Responsive movil
- [ ] Selector de sector en onboarding
- [ ] Dominio propio + emails
- [ ] Auditoria de seguridad
- [ ] Integracion API con Quipu/Billin
