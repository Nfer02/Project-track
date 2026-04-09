// remotion/components/charts/AnimatedGauge.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

interface AnimatedGaugeProps {
  value: number
  maxValue: number
  startFrame: number
  durationFrames?: number
  label?: string
  color?: string
}

export const AnimatedGauge = ({
  value, maxValue, startFrame, durationFrames = 70,
  label = 'Total a reservar', color = COLORS.accent,
}: AnimatedGaugeProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame, [startFrame, startFrame + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2) }
  )
  const currentValue = Math.round(value * progress)
  const angle = progress * 180 // 0° a 180° (semicírculo)

  const cx = 90, cy = 90, r = 70
  const startRad = Math.PI
  const endRad = Math.PI - (angle * Math.PI) / 180
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = angle > 180 ? 1 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={180} height={100} viewBox="0 0 180 100">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={COLORS.border} strokeWidth={12} fill="none" strokeLinecap="round" />
        {progress > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            stroke={color} strokeWidth={12} fill="none" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
        )}
      </svg>
      <div style={{ textAlign: 'center', marginTop: -24 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary }}>
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(currentValue)}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted }}>{label}</div>
      </div>
    </div>
  )
}
