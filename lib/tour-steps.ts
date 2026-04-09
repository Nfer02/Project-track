export interface TourStep {
  target: string
  title: string
  description: string
  side: "top" | "bottom" | "left" | "right"
  desktopOnly?: boolean
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour-step="sidebar"]',
    title: "Menu principal",
    description:
      "Desde aqui accedes a todas las secciones: proyectos, facturas, gastos y reportes.",
    side: "right",
    desktopOnly: true,
  },
  {
    target: '[data-tour-step="stats-cards"]',
    title: "Resumen financiero",
    description:
      "Tus metricas clave de un vistazo: ingresos, gastos, beneficio neto y cobros pendientes.",
    side: "bottom",
  },
  {
    target: '[data-tour-step="income-expense-chart"]',
    title: "Ingresos vs Gastos",
    description:
      "Compara tus ingresos y gastos de los ultimos 6 meses para ver la tendencia.",
    side: "bottom",
  },
  {
    target: '[data-tour-step="fiscal-gauge"]',
    title: "Reserva fiscal",
    description:
      "Estimacion orientativa de lo que debes reservar para IVA e IRPF este trimestre.",
    side: "bottom",
  },
  {
    target: '[data-tour-step="new-project-btn"]',
    title: "Crea mas proyectos",
    description:
      "Cada proyecto agrupa sus facturas y gastos. Puedes tener varios activos a la vez.",
    side: "bottom",
  },
  {
    target: '[data-tour-step="reports-link"]',
    title: "Reportes",
    description:
      "Genera reportes trimestrales de ingresos, gastos e IVA para tu gestor.",
    side: "right",
    desktopOnly: true,
  },
  {
    target: '[data-tour-step="welcome-final"]',
    title: "Todo listo!",
    description:
      "Ya conoces lo esencial. Si necesitas ayuda, busca los iconos de interrogacion o ve a Soporte.",
    side: "bottom",
  },
]
