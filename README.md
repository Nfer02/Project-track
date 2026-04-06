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
- Auth con Supabase + onboarding con selector de sector profesional
- Gestion de proyectos con campos fiscales (IVA, IRPF, NIF cliente)
- Registro de ingresos con desglose base imponible/IVA/IRPF en tiempo real
- Control de gastos con reparto entre proyectos + subida de tickets
- OCR inteligente con Claude AI: sube foto/PDF de ticket y extrae NIF, IVA, proveedor automaticamente
- Dashboard financiero con 5 graficos profesionales (ingresos vs gastos, categorias, beneficio neto, reserva fiscal, proximos cobros)
- Dashboard de proyecto con 4 graficos especificos por proyecto
- Estimacion fiscal trimestral orientativa (IVA repercutido/soportado, IRPF, pago fraccionado) con disclaimer legal
- Reportes trimestrales exportables en CSV para el contador con disclaimer legal
- Sistema "no declarar" para gestion interna sin afectar la declaracion
- Deteccion automatica de facturas vencidas al cargar la pagina
- Landing page profesional con video, testimonios, feature tabs y typewriter
- FAQ completa con 30+ preguntas en 10 categorias
- Terminos y condiciones (LSSI-CE compliant)
- Politica de privacidad (RGPD compliant)
- Cookie notice informativo con localStorage
- Responsive movil (sidebar drawer)
- 2 planes: Starter (gratis) y PRO (14,99 EUR/mes)
- Perfil de usuario + opcion de eliminar cuenta
- Auditoria legal (18 correcciones de compliance) y ortografica (30 correcciones)

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
│   └── settings/    # Billing, Members, Perfil
├── (onboarding)/    # Onboarding wizard con selector de sector
├── api/
│   ├── ocr/         # Extraccion OCR con Claude AI
│   ├── stripe/      # Webhooks y checkout
│   └── invoices/    # Upload de archivos
├── faq/             # Preguntas frecuentes (publico)
├── terms/           # Terminos y condiciones (publico)
├── privacy/         # Politica de privacidad (publico)
├── delete-account/  # Eliminar cuenta
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
- [x] Auth + Onboarding con selector de sector
- [x] CRUD de proyectos con campos fiscales (IVA, IRPF, NIF cliente)
- [x] Ingresos con desglose base/IVA/IRPF en tiempo real
- [x] Gastos con reparto entre proyectos + OCR
- [x] OCR inteligente con Claude AI (extrae NIF, IVA, proveedor)
- [x] Dashboard con 5 graficos profesionales
- [x] Dashboard de proyecto con 4 graficos especificos
- [x] Estimacion fiscal trimestral (orientativa)
- [x] Reportes CSV para el contador con disclaimer legal
- [x] Landing page profesional con video, testimonios, feature tabs
- [x] FAQ (30+ preguntas, 10 categorias)
- [x] Terminos y condiciones (LSSI-CE compliant)
- [x] Politica de privacidad (RGPD compliant)
- [x] Cookie notice informativo
- [x] Responsive movil (sidebar drawer)
- [x] 2 planes: Starter (gratis) y PRO (14,99 EUR/mes)
- [x] Perfil de usuario + eliminar cuenta
- [x] Auditoria legal (18 correcciones de compliance)
- [x] Auditoria ortografica (30 correcciones)
- [ ] Dominio propio + emails con Resend
- [ ] Recuperacion de contrasena
- [ ] Correo y bot de soporte
- [ ] Testeo responsive en dispositivos reales
- [ ] Auditoria de seguridad tecnica
- [ ] Integracion API con Quipu/Billin (futuro)
