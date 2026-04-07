import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Preguntas frecuentes — ProjectTrack",
  description:
    "Respuestas a las dudas más comunes sobre ProjectTrack: gestión de proyectos, control de gastos, OCR, estimación fiscal y más.",
}

const FAQ_CATEGORIES = [
  {
    title: "General",
    items: [
      {
        question: "¿Qué es ProjectTrack?",
        answer:
          "ProjectTrack es una herramienta de gestión de proyectos y control financiero para autónomos y pequeñas empresas en España. Te permite organizar tus proyectos, registrar ingresos y gastos, repartir costes entre obras, y tener siempre claro cuánto reservar para Hacienda cada trimestre. No es un programa de facturación oficial: es el complemento perfecto para llevar el control real de tu negocio.",
      },
      {
        question: "¿Para qué tipo de negocios sirve?",
        answer:
          "Para cualquier profesional o negocio que trabaje por proyectos: reformas y construcción, instalaciones eléctricas o de fontanería, diseño gráfico y web, arquitectura, fotografía y vídeo, consultoría, desarrollo de software, jardinería, eventos, interiorismo, formación, y muchos más. También para particulares que quieren controlar los gastos de proyectos personales, reformas en casa, o cualquier actividad que implique presupuesto y gastos. Si tienes clientes, presupuestos y gastos asociados a cada trabajo, ProjectTrack te va a ayudar.",
      },
      {
        question: "¿Necesito conocimientos de contabilidad?",
        answer:
          "No. ProjectTrack está pensado para personas que no son contables. La app calcula automáticamente las estimaciones de IVA e IRPF, te muestra gráficos claros y te avisa cuando se acerca la fecha de presentación trimestral. Tú solo registras lo que cobras y lo que gastas.",
      },
      {
        question: "¿ProjectTrack sustituye a mi programa de facturación?",
        answer:
          "No. ProjectTrack no es un sistema de facturación oficial (no emite facturas con validez legal ni cumple VeriFactu). Es una herramienta de gestión interna para que tengas el control de tus proyectos, ingresos y gastos. Si usas Quipu, Billin u otro programa para facturar, ProjectTrack lo complementa dándote la visión por proyecto que esas herramientas no ofrecen.",
      },
    ],
  },
  {
    title: "Proyectos",
    items: [
      {
        question: "¿Cómo funciona la gestión de proyectos?",
        answer:
          "Creas un proyecto con el nombre del trabajo, el cliente, el valor del contrato, el presupuesto de materiales y las fechas. Cada proyecto tiene su propio IVA y retención IRPF configurables. A partir de ahí, registras los cobros que recibes del cliente y los gastos asociados. El dashboard del proyecto te muestra en tiempo real cuánto has cobrado, cuánto has gastado, tu ganancia real y el margen de beneficio.",
      },
      {
        question: "¿Puedo ver la rentabilidad de cada proyecto por separado?",
        answer:
          "Sí. Cada proyecto tiene su propia página de finanzas con gráficos de cobros vs gastos, distribución de gastos por categoría (material, herramientas, subcontrata...), progreso de cobro del contrato, y estimación fiscal específica del proyecto.",
      },
      {
        question: "¿Qué pasa cuando un proyecto termina?",
        answer:
          "Puedes marcarlo como 'Completado'. El proyecto sigue visible con todo su historial financiero, pero ya no aparece como activo en el dashboard. Puedes consultarlo en cualquier momento.",
      },
    ],
  },
  {
    title: "Ingresos y cobros",
    items: [
      {
        question: "¿Cómo registro los cobros de mis clientes?",
        answer:
          "Dentro de cada proyecto, haces clic en 'Nueva factura' (registro de cobro) y anotas el importe con la base imponible. La app calcula automáticamente el IVA y la retención IRPF según la configuración del proyecto. Puedes marcar cada cobro como pendiente, pagado o vencido.",
      },
      {
        question: "¿Se detectan automáticamente las facturas vencidas?",
        answer:
          "Sí. Si un cobro tiene fecha de vencimiento y esa fecha ha pasado sin estar marcado como pagado, ProjectTrack lo marca automáticamente como vencido. Aparece en rojo en el dashboard y en la lista de facturas.",
      },
      {
        question: "¿Puedo configurar diferentes tipos de IVA?",
        answer:
          "Sí. Cada proyecto puede tener su propio tipo de IVA (21% general, 10% reducido para reformas de vivienda, 4% superreducido, o exento). También puedes configurar la retención de IRPF (0%, 7% para nuevos autónomos, o 15% general). Cada vez que registras un cobro, el desglose fiscal se calcula automáticamente.",
      },
    ],
  },
  {
    title: "Gastos y compras",
    items: [
      {
        question: "¿Cómo registro un gasto?",
        answer:
          "Tienes dos opciones. Desde el menú 'Gastos / Compras' para registrar un gasto general, o desde dentro de un proyecto con el botón 'Nuevo gasto' para asignarlo directamente a ese proyecto. En ambos casos puedes subir una foto o PDF del ticket para que la IA extraiga los datos automáticamente.",
      },
      {
        question: "¿Cómo funciona el reparto de gastos entre proyectos?",
        answer:
          "Cuando compras material para varias obras en una sola factura, puedes repartir el importe entre los proyectos que corresponda. Por ejemplo: compras 1.000 euros en material, asignas 600 euros al Proyecto A y 400 euros al Proyecto B. Puedes indicar los importes a mano o usar el botón 'Repartir equitativamente'. El gasto aparece una sola vez en tu registro general de gastos, pero cada proyecto muestra solo su parte.",
      },
      {
        question: "¿Qué son los gastos generales?",
        answer:
          "Son gastos del negocio que no van asociados a ningún proyecto en particular: teléfono, seguro, herramientas de uso general, gasolina, etc. Cuando registras un gasto y no lo asignas a ningún proyecto (o lo asignas solo parcialmente), la parte sin asignar se contabiliza como gasto general. Aparece en el dashboard como una categoría separada.",
      },
      {
        question: "¿Qué categorías de gastos hay disponibles?",
        answer:
          "Al registrarte, seleccionas tu sector (reformas, diseño, instalaciones, etc.) y las categorías se adaptan a tu actividad. Las categorías estándar son: Material, Herramientas, Mano de obra / Subcontrata, Transporte, Alquiler, Suministros (luz, agua, teléfono) y Otros. Las categorías te ayudan a saber en qué gastas más en cada proyecto a través de los gráficos del dashboard.",
      },
    ],
  },
  {
    title: "OCR inteligente",
    items: [
      {
        question: "¿Cómo funciona el escaneo de facturas con IA?",
        answer:
          "Al crear un gasto (o un cobro), puedes subir una foto o un PDF del ticket o factura. La inteligencia artificial analiza el documento y extrae automáticamente el proveedor, la base imponible, el IVA, el total, la fecha y la descripción. Los campos del formulario se rellenan solos. Tú solo revisas que esté todo correcto y guardas.",
      },
      {
        question: "¿Qué formatos acepta?",
        answer:
          "PDF, JPEG, PNG y WEBP. El tamaño máximo es de 10 MB por archivo. Funciona con tickets de caja, facturas formales, albaranes y cualquier documento con datos legibles.",
      },
      {
        question: "¿El OCR extrae el desglose de IVA?",
        answer:
          "Sí. La IA extrae la base imponible, el porcentaje de IVA (21%, 10%, etc.) y el importe del IVA por separado. Esto es importante porque el IVA soportado en tus compras se resta del IVA repercutido en tus cobros para calcular lo que debes pagar a Hacienda.",
      },
    ],
  },
  {
    title: "Dashboard y gráficos",
    items: [
      {
        question: "¿Qué información muestra el dashboard general?",
        answer:
          "Ingresos cobrados del mes, gastos pagados, beneficio neto, proyectos activos, gastos generales, facturas pendientes y vencidas. Además incluye gráficos de ingresos vs gastos mensual, distribución de gastos por categoría, beneficio mensual (bruto y neto tras impuestos), y un indicador de reserva fiscal trimestral.",
      },
      {
        question: "¿Los cálculos del dashboard usan datos reales o estimados?",
        answer:
          "Los datos de ingresos y gastos solo cuentan lo que realmente se ha cobrado y pagado (estado 'Pagado'). Las facturas pendientes por cobrar no se incluyen en el beneficio porque no son dinero que hayas recibido todavía. La estimación fiscal sí incluye todo lo declarado del trimestre para darte una previsión de lo que tendrás que pagar a Hacienda.",
      },
      {
        question: "¿Qué es la reserva fiscal?",
        answer:
          "Es una estimación de cuánto dinero deberías tener apartado para pagar los impuestos trimestrales: el IVA (modelo 303) y el pago fraccionado del IRPF (modelo 130). ProjectTrack calcula el IVA repercutido menos el IVA soportado, más el 20% del beneficio neto. Es una estimación orientativa, siempre debes consultar con tu asesor fiscal para el cálculo definitivo.",
      },
    ],
  },
  {
    title: "Control financiero interno",
    items: [
      {
        question: "¿Qué significa 'Incluir en declaración trimestral'?",
        answer:
          "Es un control que puedes activar o desactivar en cada proyecto y en cada factura. Cuando está activado, ese ingreso o gasto se incluye en los cálculos de la estimación fiscal y en los reportes que entregas a tu gestor. Cuando está desactivado, el registro sigue visible en tu gestión interna pero no aparece en la estimación fiscal ni en los informes para el contador.",
      },
      {
        question: "¿Para qué sirve tener registros no incluidos en la declaración?",
        answer:
          "Hay situaciones legítimas donde un autónomo necesita llevar un control interno de trabajos o gastos que no se van a incluir en una declaración concreta. Por ejemplo: trabajos de cortesía o favores profesionales donde no hay cobro, gastos personales que inicialmente se confunden con profesionales y luego se descartan, o presupuestos en fase de negociación que aún no se han formalizado. Esta función te permite tener una foto completa de tu actividad real sin que afecte a los cálculos fiscales.",
      },
      {
        question: "¿Los registros no declarados aparecen en algún informe?",
        answer:
          "No. Los reportes trimestrales para el contador solo incluyen los registros marcados como 'Incluir en declaración'. En el dashboard y los gráficos sí aparecen (con un indicador visual) porque forman parte de tu realidad financiera, pero la estimación fiscal los excluye completamente.",
      },
    ],
  },
  {
    title: "Reportes y exportación",
    items: [
      {
        question: "¿Puedo generar informes para mi gestor o contador?",
        answer:
          "Sí. En la sección de Reportes puedes seleccionar un trimestre y ver todos los ingresos y gastos declarados de ese período. Puedes exportar la información en formato CSV, listo para enviar a tu gestor o importar en cualquier programa de contabilidad.",
      },
      {
        question: "¿Los gastos repartidos entre proyectos aparecen duplicados en el informe?",
        answer:
          "No. Un gasto aparece una sola vez en el informe trimestral con su importe total, independientemente de a cuántos proyectos esté asignado. El reparto entre proyectos es solo para tu gestión interna.",
      },
    ],
  },
  {
    title: "Planes y cuenta",
    items: [
      {
        question: "¿Puedo probar ProjectTrack gratis?",
        answer:
          "Sí. El plan Starter es gratuito para siempre e incluye hasta 3 proyectos, 20 registros al mes, control de gastos y dashboard financiero. No necesitas tarjeta de crédito para registrarte.",
      },
      {
        question: "¿Qué incluye el plan PRO?",
        answer:
          "Proyectos ilimitados, registros ilimitados, OCR inteligente (escaneo de tickets con IA), reparto de gastos entre proyectos, dashboard financiero avanzado con gráficos, estimación fiscal automática (IVA + IRPF), reportes para el contador, y hasta 5 usuarios. Todo por 14,99 euros al mes.",
      },
      {
        question: "¿Puedo cancelar en cualquier momento?",
        answer:
          "Sí. No hay permanencia. Puedes cancelar tu suscripción PRO en cualquier momento desde la sección de Facturación. Seguirás teniendo acceso a las funciones PRO hasta el final del período pagado. Después, tu cuenta pasa al plan Starter gratuito: tus datos se conservan, pero quedarás limitado a 3 proyectos activos y 20 registros al mes. Los proyectos que excedan el límite quedan en modo solo lectura hasta que vuelvas a PRO o los archives.",
      },
      {
        question: "¿Puedo dar acceso a mi gestor o a un empleado?",
        answer:
          "Sí. Desde la sección de Colaboradores puedes invitar a personas por email con diferentes roles. Tu gestor puede acceder a los reportes y ver la información que necesita para la declaración.",
      },
    ],
  },
  {
    title: "Seguridad y datos",
    items: [
      {
        question: "¿Mis datos están seguros?",
        answer:
          "Sí. Tus datos se almacenan cifrados en servidores europeos (Frankfurt, Alemania). Solo tú y las personas que invites tienen acceso a tu información. Cumplimos con el Reglamento General de Protección de Datos (RGPD).",
      },
      {
        question: "¿Puedo exportar todos mis datos?",
        answer:
          "Sí. Desde la sección de Reportes puedes exportar tus ingresos y gastos en formato CSV. Tus datos son tuyos y siempre puedes llevártelos.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Preguntas frecuentes</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Todo lo que necesitas saber sobre ProjectTrack. Si no encuentras tu respuesta, escríbenos.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h2 className="text-lg font-semibold mb-4 text-primary">{category.title}</h2>
              <div className="rounded-xl border divide-y">
                {category.items.map((item) => (
                  <details key={item.question} className="group">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium hover:bg-muted/30 transition-colors">
                      {item.question}
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0 ml-4" />
                    </summary>
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center rounded-xl border bg-card p-8">
          <h3 className="text-lg font-semibold mb-2">¿Tienes más preguntas?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Escríbenos y te respondemos lo antes posible.
          </p>
          <a
            href="mailto:soporte@projecttrack.es"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            soporte@projecttrack.es
          </a>
        </div>
      </div>
    </div>
  )
}
