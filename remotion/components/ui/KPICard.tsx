// remotion/components/ui/KPICard.tsx
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { CounterNumber } from '../motion/CounterNumber'

interface KPICardProps {
  label: string
  value: number
  description?: string
  color?: string
  currency?: boolean
  startFrame?: number
  delayFrames?: number
}

export const KPICard = ({
  label, value, description, color = COLORS.green,
  currency = true, startFrame = 0, delayFrames = 0,
}: KPICardProps) => {
  const frame = useCurrentFrame()
  const delay = startFrame + delayFrames

  const translateY = spring({ frame, fps: FPS, from: 30, to: 0, delay, config: { damping: 20, stiffness: 160 } })
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      transform: `translateY(${translateY}px)`,
      opacity,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted,
        fontWeight: FONT_WEIGHTS.medium, textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: FONT_WEIGHTS.extrabold, color }}>
        <CounterNumber
          targetValue={value}
          startFrame={delay + 10}
          durationFrames={50}
          currency={currency}
          style={{ fontSize: 28, color }}
        />
      </div>
      {description && (
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted }}>{description}</div>
      )}
    </div>
  )
}
