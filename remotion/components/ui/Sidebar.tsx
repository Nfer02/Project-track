// remotion/components/ui/Sidebar.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

interface SidebarItem {
  label: string
  active?: boolean
  icon: string
}

const ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: '⊞', active: false },
  { label: 'Proyectos', icon: '◫', active: false },
  { label: 'Facturas emitidas', icon: '≡', active: false },
  { label: 'Gastos / Compras', icon: '⊕', active: false },
  { label: 'Reportes', icon: '◈', active: false },
]

interface SidebarProps {
  activeItem?: string
}

export const Sidebar = ({ activeItem = 'Dashboard' }: SidebarProps) => (
  <div style={{
    width: 220, height: '100%',
    background: '#060c18',
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex', flexDirection: 'column',
    padding: '0 0 24px 0',
    flexShrink: 0,
  }}>
    {/* Workspace */}
    <div style={{
      padding: '20px 16px',
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32,
        background: `linear-gradient(135deg, ${COLORS.accent}, #2563eb)`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: 'white', fontWeight: FONT_WEIGHTS.bold,
        fontFamily: FONTS.display,
      }}>P</div>
      <span style={{ fontFamily: FONTS.display, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, fontSize: 15 }}>
        Estudio Martín
      </span>
    </div>
    {/* Nav items */}
    <div style={{ padding: '12px 8px', flex: 1 }}>
      {ITEMS.map(({ label, icon, active: defaultActive }) => {
        const isActive = label === activeItem
        return (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, marginBottom: 2,
            background: isActive ? `${COLORS.accent}18` : 'transparent',
            color: isActive ? COLORS.accent : COLORS.textSecondary,
            fontFamily: FONTS.body, fontSize: 14,
            fontWeight: isActive ? FONT_WEIGHTS.medium : FONT_WEIGHTS.regular,
          }}>
            <span style={{ fontSize: 16, opacity: 0.8 }}>{icon}</span>
            {label}
          </div>
        )
      })}
    </div>
    {/* User */}
    <div style={{
      padding: '12px 16px',
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: `linear-gradient(135deg, #374151, #1f2937)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.body,
      }}>DM</div>
      <div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textPrimary, fontWeight: FONT_WEIGHTS.medium }}>Daniel Martín</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textMuted }}>Estudio Martín</div>
      </div>
    </div>
  </div>
)
