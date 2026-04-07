#!/usr/bin/env python3
"""Genera el PDF del análisis financiero de ProjectTrack."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
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
VIOLET = HexColor("#8b5cf6")
WHITE = HexColor("#ffffff")
DARK_BG = HexColor("#111827")

OUTPUT = r"C:\Users\ASUS\Desktop\ProjectTrack-Analisis-Financiero.pdf"

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=20*mm,
        rightMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=15*mm,
    )

    # Styles
    title_style = ParagraphStyle("Title", fontSize=22, leading=28, textColor=PRIMARY, fontName="Helvetica-Bold", spaceAfter=4)
    subtitle_style = ParagraphStyle("Subtitle", fontSize=10, leading=14, textColor=TEXT_MUTED, fontName="Helvetica")
    h1_style = ParagraphStyle("H1", fontSize=14, leading=18, textColor=PRIMARY, fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=8)
    h2_style = ParagraphStyle("H2", fontSize=11, leading=15, textColor=WHITE, fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=6)
    body_style = ParagraphStyle("Body", fontSize=9, leading=13, textColor=TEXT_MUTED, fontName="Helvetica")
    bold_style = ParagraphStyle("Bold", fontSize=9, leading=13, textColor=WHITE, fontName="Helvetica-Bold")
    note_style = ParagraphStyle("Note", fontSize=8, leading=11, textColor=TEXT_MUTED, fontName="Helvetica-Oblique", leftIndent=10)
    green_style = ParagraphStyle("Green", fontSize=10, leading=14, textColor=GREEN, fontName="Helvetica-Bold")

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
            ("FONTSIZE", (0, 0), (-1, 0), 8),
            ("FONTSIZE", (0, 1), (-1, -1), 8),
            ("TEXTCOLOR", (0, 1), (-1, -1), TEXT_MUTED),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [DARK_BG, HexColor("#0f172a")]),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]
        t.setStyle(TableStyle(style))
        return t

    story = []

    # ─── Cover ────────────────────────────────────────
    story.append(spacer(40))
    story.append(Paragraph("ProjectTrack", title_style))
    story.append(Paragraph("Analisis Financiero SaaS", ParagraphStyle("Sub", fontSize=16, leading=20, textColor=WHITE, fontName="Helvetica-Bold")))
    story.append(spacer(10))
    story.append(Paragraph("Fecha: 6 de abril de 2026", subtitle_style))
    story.append(Paragraph("Modelo de negocio: Freemium (Starter gratuito + PRO 14,99 EUR/mes)", subtitle_style))
    story.append(spacer(20))
    story.append(hr())

    # ─── 1. Costes fijos ──────────────────────────────
    story.append(Paragraph("1. Costes fijos mensuales (Infraestructura)", h1_style))

    story.append(make_table(
        ["Servicio", "Plan actual", "Limite gratuito", "Plan pago", "Precio"],
        [
            ["Vercel", "Hobby (gratis)", "100 GB BW", "Pro", "20 USD/mo"],
            ["Supabase", "Free", "500 MB DB, 1 GB storage", "Pro", "25 USD/mo"],
            ["Stripe", "Sin cuota", "N/A", "Por transaccion", "1,5% + 0,25 EUR"],
            ["Claude AI", "Pago por uso", "N/A", "Por tokens", "Ver seccion 2"],
            ["Resend", "Free", "3.000 emails/mes", "Pro", "20 USD/mo"],
            ["Dominio .es", "N/A", "N/A", "Anual", "~15 EUR/ano"],
        ],
        col_widths=[60, 65, 90, 60, 65],
    ))

    story.append(spacer(8))
    story.append(Paragraph("Coste fijo mensual ACTUAL:", h2_style))
    story.append(make_table(
        ["Concepto", "Coste EUR/mes"],
        [
            ["Vercel + Supabase + Stripe + Resend", "0,00"],
            ["Dominio .es", "1,25"],
            ["TOTAL", "1,25 EUR/mes"],
        ],
        col_widths=[200, 140],
    ))

    story.append(hr())

    # ─── 2. Coste OCR ────────────────────────────────
    story.append(Paragraph("2. Coste OCR por escaneo", h1_style))
    story.append(Paragraph("Modelo actual: claude-sonnet-4-5 (optimizado)", h2_style))

    story.append(make_table(
        ["Componente", "Tokens", "Coste USD"],
        [
            ["Input (imagen + prompt)", "~2.910", "0,00873"],
            ["Output (JSON)", "~250", "0,00375"],
            ["Total por escaneo", "", "0,01248 USD (~0,012 EUR)"],
        ],
        col_widths=[150, 80, 110],
    ))

    story.append(spacer(6))
    story.append(Paragraph("20 escaneos/mes por usuario PRO = ~0,23 EUR/mes", body_style))

    story.append(hr())

    # ─── 3. Costes variables ──────────────────────────
    story.append(Paragraph("3. Costes variables por usuario", h1_style))

    story.append(make_table(
        ["Recurso", "Starter", "PRO"],
        [
            ["DB Supabase", "~5 MB (0,00 EUR)", "~10 MB (0,00 EUR)"],
            ["Storage", "~10 MB (0,00 EUR)", "~50 MB (0,00 EUR)"],
            ["Emails", "~2/mes (0,00 EUR)", "~5/mes (0,00 EUR)"],
            ["OCR (Sonnet)", "No incluido", "20 scans = 0,23 EUR"],
            ["TOTAL", "0,00 EUR/mes", "~0,23 EUR/mes"],
        ],
        col_widths=[120, 110, 110],
    ))

    story.append(hr())

    # ─── 4. Modelo de ingresos ────────────────────────
    story.append(Paragraph("4. Modelo de ingresos", h1_style))

    story.append(make_table(
        ["Concepto", "Importe"],
        [
            ["Precio PRO", "14,99 EUR/mes"],
            ["Comision Stripe (1,5% + 0,25 EUR)", "-0,47 EUR"],
            ["Ingreso neto por pago", "14,52 EUR"],
            ["Coste OCR por usuario", "-0,23 EUR"],
            ["Margen bruto por usuario PRO", "14,29 EUR/mes (95,3%)"],
        ],
        col_widths=[200, 140],
    ))

    story.append(spacer(6))
    story.append(Paragraph("Margen bruto: 95,3%", green_style))

    story.append(hr())

    # ─── 5. Proyecciones ─────────────────────────────
    story.append(Paragraph("5. Proyecciones de crecimiento (12 meses)", h1_style))

    story.append(Paragraph("Parametros: 50 registros/mes inicial, +10% mensual, 5% conversion, 5% churn", body_style))
    story.append(spacer(6))

    story.append(make_table(
        ["Mes", "Registros", "Free", "PRO", "Ingresos", "Costes", "Beneficio", "Acumulado"],
        [
            ["1", "50", "48", "2", "29 EUR", "2 EUR", "27 EUR", "27 EUR"],
            ["2", "55", "101", "5", "73 EUR", "3 EUR", "69 EUR", "96 EUR"],
            ["3", "61", "157", "8", "116 EUR", "4 EUR", "112 EUR", "208 EUR"],
            ["4", "67", "217", "11", "160 EUR", "5 EUR", "154 EUR", "363 EUR"],
            ["5", "73", "281", "14", "203 EUR", "7 EUR", "197 EUR", "559 EUR"],
            ["6", "81", "352", "18", "261 EUR", "8 EUR", "253 EUR", "813 EUR"],
            ["7", "89", "429", "22", "319 EUR", "10 EUR", "310 EUR", "1.122 EUR"],
            ["8", "97", "512", "27", "392 EUR", "34 EUR", "358 EUR", "1.480 EUR"],
            ["9", "107", "603", "32", "465 EUR", "36 EUR", "428 EUR", "1.908 EUR"],
            ["10", "118", "703", "38", "552 EUR", "57 EUR", "495 EUR", "2.403 EUR"],
            ["11", "130", "812", "44", "639 EUR", "59 EUR", "579 EUR", "2.982 EUR"],
            ["12", "143", "930", "51", "741 EUR", "62 EUR", "678 EUR", "3.661 EUR"],
        ],
        col_widths=[25, 45, 35, 30, 55, 45, 50, 55],
    ))

    story.append(spacer(10))
    story.append(Paragraph("Resumen anual", h2_style))
    story.append(make_table(
        ["Metrica", "Valor"],
        [
            ["Total usuarios registrados (mes 12)", "~981"],
            ["Usuarios PRO activos (mes 12)", "~51"],
            ["Ingresos brutos anuales", "~3.949 EUR"],
            ["Costes totales anuales", "~289 EUR"],
            ["Beneficio neto anual", "~3.660 EUR"],
            ["Margen neto", "~92,7%"],
        ],
        col_widths=[200, 140],
    ))

    story.append(hr())

    # ─── 6. Break-even ────────────────────────────────
    story.append(Paragraph("6. Punto de equilibrio (Break-even)", h1_style))

    story.append(make_table(
        ["Escenario", "Costes fijos", "PRO necesarios", "Mes"],
        [
            ["Minimo (solo dominio)", "1,25 EUR/mes", "1 usuario", "Mes 1"],
            ["Supabase + Resend Pro", "42,75 EUR/mes", "4 usuarios", "Mes 3"],
            ["Todos los servicios", "61,25 EUR/mes", "5 usuarios", "Mes 3-4"],
        ],
        col_widths=[110, 80, 75, 75],
    ))

    story.append(spacer(8))
    story.append(Paragraph("El break-even es muy rapido gracias a los margenes del 95% y la infraestructura serverless con tiers gratuitos.", note_style))

    story.append(hr())

    # ─── 7. Optimizaciones ────────────────────────────
    story.append(Paragraph("7. Optimizaciones aplicadas", h1_style))

    story.append(make_table(
        ["Optimizacion", "Ahorro", "Estado"],
        [
            ["OCR: Opus 4.5 a Sonnet 4.5", "40% menos por escaneo", "Aplicado"],
            ["Cache de resultados OCR", "Evita escaneos duplicados", "Implementado"],
            ["Maximizar free tiers", "Retrasar upgrades 2-3 meses", "Activo"],
            ["Prompt caching (futuro)", "~5% adicional en input", "Pendiente"],
            ["Batch API (futuro)", "50% si se acepta latencia", "No recomendado"],
        ],
        col_widths=[130, 120, 90],
    ))

    story.append(hr())

    # ─── 8. Conclusion ───────────────────────────────
    story.append(Paragraph("8. Conclusion", h1_style))

    conclusions = [
        "Costes de arranque casi nulos: 1,25 EUR/mes (solo dominio)",
        "Break-even ultra rapido: 1 usuario PRO cubre los costes minimos",
        "Margenes altisimos: >95% de margen bruto por usuario PRO",
        "Escalabilidad eficiente: costes variables < 3% del ingreso por usuario",
        "Riesgo bajo: infraestructura serverless + free tiers",
    ]
    for c in conclusions:
        story.append(Paragraph(f"  {c}", bold_style))
        story.append(spacer(3))

    story.append(spacer(20))
    story.append(Paragraph("ProjectTrack - Analisis Financiero - Abril 2026", ParagraphStyle("Footer", fontSize=7, textColor=TEXT_MUTED, alignment=TA_CENTER)))

    # Build
    doc.build(story)
    print(f"PDF generado: {OUTPUT}")

if __name__ == "__main__":
    build_pdf()
