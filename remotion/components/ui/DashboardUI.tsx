// remotion/components/ui/DashboardUI.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { Sidebar } from './Sidebar'
import { KPICard } from './KPICard'
import { AnimatedBarChart } from '../charts/AnimatedBarChart'
import { AnimatedDonutChart } from '../charts/AnimatedDonutChart'
import { AnimatedGauge } from '../charts/AnimatedGauge'
import { DEMO_DATA } from '../../constants/data'

interface DashboardUIProps {
  startFrame?: number
}

export const DashboardUI = ({ startFrame = 0 }: DashboardUIProps) => {
  const { kpis, fiscal } = DEMO_DATA

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLORS.bg }}>
      <Sidebar activeItem="Dashboard" />
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted, margin: '4px 0 0' }}>
              Resumen financiero — Estudio Martín
            </p>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <KPICard label="Ingresos del mes" value={kpis.ingresos} description="Facturas cobradas" color={COLORS.green} startFrame={startFrame} delayFrames={0} />
          <KPICard label="Gastos del mes" value={kpis.gastos} description="Sin asignar a proyectos" color={COLORS.red} startFrame={startFrame} delayFrames={15} />
          <KPICard label="Beneficio neto" value={kpis.beneficioNeto} description="Ingresos sin gastos" color={COLORS.green} startFrame={startFrame} delayFrames={30} />
          <KPICard label="Proyectos activos" value={kpis.proyectosActivos} description="En curso" color={COLORS.accent} currency={false} startFrame={startFrame} delayFrames={45} />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {/* Bar chart */}
          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4 }}>
              Ingresos vs Gastos
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 16 }}>Últimos 6 meses</div>
            <div style={{ height: 180 }}>
              <AnimatedBarChart startFrame={startFrame + 60} durationFrames={90} />
            </div>
          </div>

          {/* Donut + Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4 }}>
                Gastos por categoría
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatedDonutChart startFrame={startFrame + 80} durationFrames={80} />
              </div>
            </div>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4, alignSelf: 'flex-start' }}>
                Reserva fiscal
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 8, alignSelf: 'flex-start' }}>T2 2026</div>
              <AnimatedGauge
                value={fiscal.totalReservar}
                maxValue={fiscal.ingresosDec}
                startFrame={startFrame + 100}
                durationFrames={70}
                label="Total a reservar"
                color={COLORS.accent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
