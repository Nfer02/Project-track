#!/usr/bin/env python3
"""Genera el PDF del manual del propietario de ProjectTrack."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Preformatted
)

# Colors
BG_DARK = HexColor("#0f172a")
CARD_BG = HexColor("#1e293b")
BORDER = HexColor("#334155")
TEXT_WHITE = HexColor("#f9fafb")
TEXT_MUTED = HexColor("#94a3b8")
PRIMARY = HexColor("#3b82f6")
GREEN = HexColor("#10b981")
AMBER = HexColor("#f59e0b")
RED = HexColor("#ef4444")
WHITE = HexColor("#ffffff")
DARK_BG = HexColor("#111827")

OUTPUT = r"C:\Users\ASUS\Desktop\ProjectTrack-Manual-Propietario.pdf"

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=18*mm,
        rightMargin=18*mm,
        topMargin=18*mm,
        bottomMargin=15*mm,
    )

    title_style = ParagraphStyle("Title", fontSize=22, leading=28, textColor=PRIMARY, fontName="Helvetica-Bold", spaceAfter=4)
    subtitle_style = ParagraphStyle("Subtitle", fontSize=10, leading=14, textColor=TEXT_MUTED, fontName="Helvetica")
    h1_style = ParagraphStyle("H1", fontSize=14, leading=18, textColor=PRIMARY, fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=8)
    h2_style = ParagraphStyle("H2", fontSize=11, leading=15, textColor=WHITE, fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=6)
    body_style = ParagraphStyle("Body", fontSize=9, leading=13, textColor=TEXT_MUTED, fontName="Helvetica")
    bold_style = ParagraphStyle("Bold", fontSize=9, leading=13, textColor=WHITE, fontName="Helvetica-Bold")
    bullet_style = ParagraphStyle("Bullet", fontSize=8.5, leading=12, textColor=TEXT_MUTED, fontName="Helvetica", leftIndent=15, bulletIndent=5)
    code_style = ParagraphStyle("Code", fontSize=8, leading=11, textColor=GREEN, fontName="Courier", leftIndent=10, backColor=DARK_BG)
    warn_style = ParagraphStyle("Warn", fontSize=9, leading=13, textColor=RED, fontName="Helvetica-Bold")

    def spacer(h=6):
        return Spacer(1, h)

    def hr():
        return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=8, spaceBefore=8)

    def make_table(headers, rows, col_widths=None):
        data = [headers] + rows
        t = Table(data, colWidths=col_widths, repeatRows=1)
        style = [
            ("BACKGROUND", (0, 0), (-1, 0), CARD_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), PRIMARY),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 7.5),
            ("FONTSIZE", (0, 1), (-1, -1), 7.5),
            ("TEXTCOLOR", (0, 1), (-1, -1), TEXT_MUTED),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [DARK_BG, HexColor("#0f172a")]),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]
        t.setStyle(TableStyle(style))
        return t

    story = []

    # ─── Cover ────────────────────────────────────────
    story.append(spacer(30))
    story.append(Paragraph("ProjectTrack", title_style))
    story.append(Paragraph("Manual del Propietario", ParagraphStyle("Sub", fontSize=16, leading=20, textColor=WHITE, fontName="Helvetica-Bold")))
    story.append(spacer(10))
    story.append(Paragraph("Propietario: Nelson Fernandez", subtitle_style))
    story.append(Paragraph("Ultima actualizacion: Abril 2026", subtitle_style))
    story.append(spacer(15))
    story.append(hr())

    # ─── 1. Resumen ──────────────────────────────────
    story.append(Paragraph("1. Resumen del sistema", h1_style))
    story.append(Paragraph("ProjectTrack es una plataforma de gestion de proyectos y control financiero. Permite gestionar proyectos, registrar ingresos y gastos, escanear documentos con IA (OCR), generar reportes trimestrales y cobrar suscripciones PRO con Stripe.", body_style))
    story.append(spacer(6))
    story.append(make_table(
        ["Dato", "Valor"],
        [
            ["URL de produccion", "https://projecttrack.app"],
            ["URL alternativa", "https://project-track-ruby.vercel.app"],
            ["Repositorio", "https://github.com/Nfer02/Project-track"],
            ["Stack", "Next.js 16, Prisma 7, Supabase, Stripe, Tailwind CSS"],
            ["Panel admin", "https://projecttrack.app/admin"],
        ],
        col_widths=[100, 400],
    ))
    story.append(hr())

    # ─── 2. Servicios ─────────────────────────────────
    story.append(Paragraph("2. Servicios y accesos", h1_style))

    services = [
        ["Vercel (hosting)", "https://vercel.com/nelsonfernandez1002-7523s-projects/project-track", "Hobby (gratis)", "Vercel Token (vcp_...)"],
        ["Supabase (DB + Auth)", "https://supabase.com/dashboard/project/jxwbutdpbabxsywqkzio", "Free (500MB DB)", "SUPABASE_URL, ANON_KEY, DATABASE_URL, DIRECT_URL"],
        ["Stripe (pagos)", "https://dashboard.stripe.com", "Comision por transaccion", "SECRET_KEY, PUBLISHABLE_KEY, WEBHOOK_SECRET, PRICE_ID"],
        ["Anthropic (OCR/IA)", "https://console.anthropic.com", "Pago por uso (~0.012 EUR/scan)", "ANTHROPIC_API_KEY"],
        ["Resend (emails)", "https://resend.com", "Free (3.000 emails/mes)", "RESEND_API_KEY"],
        ["Namecheap (dominio)", "https://ap.www.namecheap.com", "~11 EUR/ano", "Cuenta Namecheap"],
        ["Google Search Console", "https://search.google.com/search-console", "Gratis", "Cuenta Google"],
        ["GitHub (codigo)", "https://github.com/Nfer02/Project-track", "Gratis (repo privado)", "GitHub Token"],
    ]

    story.append(make_table(
        ["Servicio", "Dashboard", "Plan/Coste", "Credenciales a guardar"],
        services,
        col_widths=[95, 175, 100, 130],
    ))
    story.append(hr())

    # ─── 3. Variables de entorno ──────────────────────
    story.append(Paragraph("3. Variables de entorno", h1_style))
    story.append(Paragraph("Todas las variables necesarias para que la app funcione:", body_style))
    story.append(spacer(4))

    env_vars = [
        ["NEXT_PUBLIC_SUPABASE_URL", "URL de Supabase", "Supabase > Settings > API"],
        ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Clave publica Supabase", "Supabase > Settings > API"],
        ["DATABASE_URL", "Conexion DB (pooler)", "Supabase > Settings > Database"],
        ["DIRECT_URL", "Conexion directa DB", "Supabase > Settings > Database"],
        ["NEXT_PUBLIC_APP_URL", "URL de la app", "https://projecttrack.app"],
        ["STRIPE_SECRET_KEY", "Clave secreta Stripe", "Stripe > Developers > API keys"],
        ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Clave publica Stripe", "Stripe > Developers > API keys"],
        ["STRIPE_WEBHOOK_SECRET", "Secreto del webhook", "Stripe > Developers > Webhooks"],
        ["STRIPE_PRICE_ID", "ID del precio PRO", "Stripe > Products > PRO"],
        ["RESEND_API_KEY", "API key de Resend", "Resend > API Keys"],
        ["ANTHROPIC_API_KEY", "API key de Claude", "Anthropic > Settings > Keys"],
    ]

    story.append(make_table(
        ["Variable", "Descripcion", "Donde obtenerla"],
        env_vars,
        col_widths=[165, 120, 215],
    ))

    story.append(spacer(6))
    story.append(Paragraph("Donde se configuran: .env.local (local) y Vercel > Settings > Environment Variables (produccion)", body_style))
    story.append(hr())

    # ─── 4. Flujos ────────────────────────────────────
    story.append(Paragraph("4. Flujos de la aplicacion", h1_style))

    story.append(Paragraph("4.1 Registro de usuario", h2_style))
    story.append(Paragraph("Landing > Waitlist (actual) > Registro > Supabase Auth > Onboarding (nombre + sector + workspace) > Dashboard", body_style))

    story.append(Paragraph("4.2 Flujo de un proyecto", h2_style))
    story.append(Paragraph("Crear proyecto > Configurar (cliente, NIF, IVA, IRPF) > Registrar cobros > Registrar gastos (manual o OCR) > Ver finanzas > Reportes", body_style))

    story.append(Paragraph("4.3 Flujo de pagos (Stripe)", h2_style))
    story.append(Paragraph("Usuario Free > Clic 'Actualizar a PRO' > Stripe Checkout > Pago > Webhook actualiza workspace > Factura automatica generada", body_style))

    story.append(Paragraph("4.4 Flujo de OCR", h2_style))
    story.append(Paragraph("Subir foto/PDF > API /api/ocr/extract > Rate limit (20/hora) > Claude Sonnet analiza > Extrae datos > Auto-rellena formulario > Usuario guarda", body_style))

    story.append(Paragraph("4.5 Flujo de reportes", h2_style))
    story.append(Paragraph("Ir a /reports > Seleccionar trimestre > Ver facturas declaradas > Exportar CSV > Enviar al gestor", body_style))

    story.append(hr())

    # ─── 5. Seguridad ────────────────────────────────
    story.append(Paragraph("5. Seguridad", h1_style))

    story.append(Paragraph("NUNCA compartir:", warn_style))
    never_share = [
        ["STRIPE_SECRET_KEY", "Permite hacer cobros en tu nombre"],
        ["ANTHROPIC_API_KEY", "Permite usar (y gastar) tu cuenta de IA"],
        ["DATABASE_URL / DIRECT_URL", "Contienen la contrasena de la base de datos"],
        ["STRIPE_WEBHOOK_SECRET", "Permite falsificar eventos de pago"],
        ["Vercel Token (vcp_...)", "Da acceso completo a tus deploys"],
        ["GitHub Token (ghp_...)", "Da acceso al codigo fuente"],
    ]
    story.append(make_table(["Credencial", "Riesgo si se filtra"], never_share, col_widths=[200, 300]))

    story.append(spacer(6))
    story.append(Paragraph("Se pueden compartir (publicas): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_APP_URL", body_style))

    story.append(spacer(6))
    story.append(Paragraph("Medidas implementadas: CSP + HSTS + X-Frame-Options, rate limiting OCR, validacion Zod cliente+servidor, Supabase Auth (bcrypt, httpOnly cookies), CSRF en server actions", body_style))

    story.append(hr())

    # ─── 6. Troubleshooting ──────────────────────────
    story.append(Paragraph("6. Que hacer si algo falla", h1_style))

    problems = [
        ["La app no carga", "Verifica deploy en Vercel. Redeploy: npx vercel --prod"],
        ["No pueden registrarse", "Verifica Supabase Auth settings + redirect URLs"],
        ["OCR no funciona", "Verifica ANTHROPIC_API_KEY + creditos disponibles"],
        ["Pagos no funcionan", "Verifica webhook en Stripe + STRIPE_WEBHOOK_SECRET"],
        ["Emails no llegan", "Verifica Resend dominio 'Verified' + RESEND_API_KEY"],
        ["Error de base de datos", "Verifica Supabase DB Health + DATABASE_URL"],
    ]
    story.append(make_table(["Problema", "Solucion rapida"], problems, col_widths=[120, 380]))

    story.append(hr())

    # ─── 7. Costes ───────────────────────────────────
    story.append(Paragraph("7. Costes mensuales actuales", h1_style))

    costs = [
        ["Dominio (Namecheap)", "~1 EUR/mes"],
        ["Vercel + Supabase + Resend + Stripe", "0 EUR (free tiers)"],
        ["Anthropic (OCR)", "~0.012 EUR por escaneo"],
        ["TOTAL ACTUAL", "~1 EUR/mes + uso de OCR"],
    ]
    story.append(make_table(["Servicio", "Coste"], costs, col_widths=[250, 250]))

    story.append(spacer(10))
    story.append(Paragraph("Proyeccion: con 50 usuarios PRO el MRR seria ~750 EUR/mes con costes de ~62 EUR/mes (margen 92%)", bold_style))

    story.append(hr())

    # ─── 8. Mantenimiento ────────────────────────────
    story.append(Paragraph("8. Mantenimiento rutinario", h1_style))

    story.append(Paragraph("Deploy de cambios:", h2_style))
    story.append(Paragraph("git add -A && git commit -m 'cambio' && npx vercel --prod && git push origin master", code_style))

    story.append(Paragraph("Migraciones de DB:", h2_style))
    story.append(Paragraph("Ir a Supabase SQL Editor > pegar SQL > Run", body_style))

    story.append(Paragraph("Regenerar Prisma:", h2_style))
    story.append(Paragraph("pnpm prisma generate", code_style))

    story.append(spacer(6))
    story.append(Paragraph("Renovaciones: dominio anual (~11 EUR), el resto no tiene renovacion.", body_style))

    story.append(hr())

    # ─── Footer ──────────────────────────────────────
    story.append(spacer(20))
    story.append(Paragraph("ProjectTrack - Manual del Propietario - Abril 2026", ParagraphStyle("Footer", fontSize=7, textColor=TEXT_MUTED, alignment=TA_CENTER)))
    story.append(Paragraph("Documento confidencial. No compartir fuera de la organizacion.", ParagraphStyle("Footer2", fontSize=6, textColor=TEXT_MUTED, alignment=TA_CENTER)))

    doc.build(story)
    print(f"PDF generado: {OUTPUT}")

if __name__ == "__main__":
    build_pdf()
