#!/usr/bin/env python3
"""Genera PDF con respuestas tipo para soporte de ProjectTrack."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

PRIMARY = HexColor("#3b82f6")
WHITE = HexColor("#f9fafb")
MUTED = HexColor("#94a3b8")
BORDER = HexColor("#334155")
DARK = HexColor("#111827")

OUTPUT = r"C:\Users\ASUS\Desktop\ProjectTrack-Respuestas-Soporte.pdf"

def build():
    doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=20*mm, bottomMargin=15*mm)

    title = ParagraphStyle("T", fontSize=20, leading=26, textColor=PRIMARY, fontName="Helvetica-Bold", spaceAfter=4)
    sub = ParagraphStyle("S", fontSize=10, leading=14, textColor=MUTED, fontName="Helvetica")
    cat = ParagraphStyle("C", fontSize=13, leading=17, textColor=PRIMARY, fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=6)
    q = ParagraphStyle("Q", fontSize=9, leading=13, textColor=WHITE, fontName="Helvetica-Bold", spaceBefore=8)
    a = ParagraphStyle("A", fontSize=8.5, leading=13, textColor=MUTED, fontName="Helvetica", leftIndent=10, spaceAfter=6)
    note = ParagraphStyle("N", fontSize=7.5, leading=11, textColor=HexColor("#475569"), fontName="Helvetica-Oblique")

    def hr():
        return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=8, spaceBefore=8)

    s = []

    s.append(Paragraph("Respuestas tipo para soporte", title))
    s.append(Paragraph("ProjectTrack — Copia y pega desde aqui al panel de admin", sub))
    s.append(Spacer(1, 10))
    s.append(hr())

    # ACCESO
    s.append(Paragraph("ACCESO A MI CUENTA", cat))

    s.append(Paragraph("No puedo iniciar sesion / contraseña incorrecta", q))
    s.append(Paragraph("Hola, gracias por contactarnos. Puedes restablecer tu contraseña desde la página de inicio de sesión haciendo clic en '¿Olvidaste tu contraseña?'. Te enviaremos un enlace a tu email para crear una nueva contraseña. Si sigues teniendo problemas, responde a este mensaje y te ayudamos.", a))

    s.append(Paragraph("No me llega el email de confirmacion", q))
    s.append(Paragraph("Hola, revisa la carpeta de spam o correo no deseado de tu bandeja de entrada. El email se envía desde noreply@projecttrack.app. Si después de revisar spam no lo encuentras, responde a este mensaje con el email que usaste para registrarte y lo verificamos manualmente.", a))

    s.append(Paragraph("Quiero cambiar mi email", q))
    s.append(Paragraph("Hola, actualmente el cambio de email se gestiona desde tu perfil en la aplicación. Ve a tu nombre (abajo del menú lateral) > Mi perfil. Si necesitas ayuda adicional, no dudes en escribirnos.", a))

    s.append(hr())

    # ERROR
    s.append(Paragraph("ERROR EN LA APLICACION", cat))

    s.append(Paragraph("Me sale un error al crear/editar un proyecto o gasto", q))
    s.append(Paragraph("Hola, sentimos el inconveniente. ¿Podrías indicarnos exactamente qué estabas haciendo cuando apareció el error? Si es posible, envíanos una captura de pantalla. Estamos revisando el problema y te informaremos cuando esté resuelto.", a))

    s.append(Paragraph("La pagina no carga o se queda en blanco", q))
    s.append(Paragraph("Hola, prueba lo siguiente: 1) Recarga la página con Ctrl+F5 (borrar caché). 2) Prueba en una ventana de incógnito. 3) Si el problema persiste, indícanos qué navegador y dispositivo usas para investigarlo.", a))

    s.append(Paragraph("El OCR no extrae los datos correctamente", q))
    s.append(Paragraph("Hola, el escaneo con IA funciona mejor con fotos nítidas y bien iluminadas. Asegúrate de que el ticket o factura se vea completo y legible en la imagen. Si la calidad de la foto es buena y sigue sin funcionar, envíanos la imagen y lo revisamos.", a))

    s.append(hr())

    # DUDA
    s.append(Paragraph("DUDA DE USO", cat))

    s.append(Paragraph("Como reparto un gasto entre varios proyectos", q))
    s.append(Paragraph("Hola, al crear un gasto desde el menú 'Gastos / Compras', verás una sección 'Asignar a proyectos' donde puedes añadir varios proyectos e indicar el importe o porcentaje que corresponde a cada uno. También puedes usar el botón 'Repartir equitativamente' para dividir el gasto a partes iguales. Para más detalle, consulta nuestras preguntas frecuentes en projecttrack.app/faq.", a))

    s.append(Paragraph("Que significa 'Incluir en declaracion trimestral'", q))
    s.append(Paragraph("Hola, esta opción controla si un ingreso o gasto se incluye en la estimación fiscal y en los reportes que entregas a tu gestor. Si lo desactivas, el registro sigue visible en tu gestión interna pero no aparece en los cálculos de IVA/IRPF ni en los informes para el contador. Más información en projecttrack.app/faq.", a))

    s.append(Paragraph("Como exporto los datos para mi gestor", q))
    s.append(Paragraph("Hola, ve a la sección 'Reportes' en el menú lateral. Ahí puedes seleccionar el trimestre y exportar en formato CSV todos los ingresos y gastos declarados. Ese archivo se lo puedes enviar directamente a tu gestor.", a))

    s.append(hr())

    # FACTURACION
    s.append(Paragraph("FACTURACION Y PLAN", cat))

    s.append(Paragraph("Quiero cancelar mi suscripcion PRO", q))
    s.append(Paragraph("Hola, puedes cancelar tu suscripción en cualquier momento desde el menú 'Mi plan' en la aplicación. Seguirás teniendo acceso a las funciones PRO hasta el final del período que ya has pagado. Después, tu cuenta pasará al plan gratuito conservando todos tus datos.", a))

    s.append(Paragraph("Quiero un reembolso", q))
    s.append(Paragraph("Hola, de acuerdo con nuestros términos de servicio, dispones de 14 días desde la contratación para solicitar el desistimiento. Si estás dentro de ese plazo, responde a este mensaje y gestionamos el reembolso. Si han pasado más de 14 días, la suscripción se cancela para el siguiente período pero no se reembolsa el actual.", a))

    s.append(Paragraph("No se que plan tengo", q))
    s.append(Paragraph("Hola, puedes ver tu plan actual en el menú 'Mi plan' de la aplicación. Ahí verás si estás en el plan Starter (gratuito) o en el plan PRO, junto con los detalles de tu suscripción.", a))

    s.append(hr())

    # SUGERENCIA
    s.append(Paragraph("SUGERENCIA", cat))

    s.append(Paragraph("Respuesta generica para sugerencias", q))
    s.append(Paragraph("Hola, muchas gracias por tu sugerencia. La hemos registrado y la tendremos en cuenta para futuras mejoras de ProjectTrack. Valoramos mucho el feedback de nuestros usuarios porque nos ayuda a crear un producto mejor. Si tienes más ideas, no dudes en compartirlas.", a))

    s.append(hr())

    # OTRO
    s.append(Paragraph("OTRO", cat))

    s.append(Paragraph("Respuesta generica para consultas no categorizadas", q))
    s.append(Paragraph("Hola, gracias por contactarnos. Hemos recibido tu consulta y la estamos revisando. Te responderemos lo antes posible. Si necesitas ayuda inmediata, te recomendamos consultar nuestras preguntas frecuentes en projecttrack.app/faq.", a))

    s.append(Paragraph("Quiero eliminar mi cuenta y todos mis datos", q))
    s.append(Paragraph("Hola, puedes eliminar tu cuenta desde la aplicación: ve a tu nombre > Mi perfil > Eliminar cuenta. Se te pedirá escribir 'ELIMINAR' para confirmar. Esta acción es irreversible y se borrarán todos tus datos. Si necesitas exportar tus datos antes, hazlo desde la sección de Reportes.", a))

    s.append(Spacer(1, 20))
    s.append(hr())
    s.append(Paragraph("ProjectTrack — Respuestas tipo para soporte — Abril 2026", ParagraphStyle("F", fontSize=7, textColor=MUTED, alignment=TA_CENTER)))
    s.append(Paragraph("Copia y pega estas respuestas en el campo de respuesta del panel de admin (/admin)", ParagraphStyle("F2", fontSize=6, textColor=MUTED, alignment=TA_CENTER)))

    doc.build(s)
    print(f"PDF generado: {OUTPUT}")

if __name__ == "__main__":
    build()
