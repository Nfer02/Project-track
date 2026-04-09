// remotion/components/ui/ReportsUI.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { Sidebar } from './Sidebar'
import { DEMO_DATA } from '../../constants/data'

export const ReportsUI = () => {
  const { fiscal, facturas } = DEMO_DATA
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLORS.bg }}>
      <Sidebar activeItem="Reportes" />
      <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, margin: 0 }}>
              Reportes trimestrales
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted, margin: '4px 0 0' }}>
              Resumen informativo para preparar la declaración trimestral
            </p>
          </div>
          {/* Exportar CSV button */}
          <div id="export-btn" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: COLORS.accent, color: 'white',
            border: 'none', borderRadius: 8, padding: '10px 18px',
            fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold,
            cursor: 'pointer',
          }}>
            ↓ Exportar CSV
          </div>
        </div>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total ingresos declarados', value: `${fiscal.ingresosDec.toLocaleString('es-ES')}€`, color: COLORS.green },
            { label: 'Total gastos declarados', value: `${fiscal.gastosDec.toLocaleString('es-ES')}€`, color: COLORS.red },
            { label: 'Beneficio neto', value: `${fiscal.beneficioNeto.toLocaleString('es-ES')}€`, color: COLORS.accent },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: FONT_WEIGHTS.bold, color }}>{value}</div>
            </div>
          ))}
        </div>
        {/* Tabla de ingresos */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: 'hidden', flex: 1 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary }}>
            Ingresos registrados
          </div>
          {facturas.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`, gap: 16 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted, width: 60 }}>{f.id}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textPrimary, flex: 1 }}>{f.proyecto}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.green, fontWeight: FONT_WEIGHTS.semibold }}>{f.importe.toLocaleString('es-ES')}€</span>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: FONT_WEIGHTS.medium,
                background: f.estado === 'Pendiente' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                color: f.estado === 'Pendiente' ? COLORS.amber : COLORS.green,
              }}>{f.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
