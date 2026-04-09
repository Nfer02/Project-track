// remotion/components/motion/CounterNumber.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS } from '../../constants/theme'
import { CSSProperties } from 'react'

interface CounterNumberProps {
  targetValue: number
  startFrame: number
  durationFrames?: number
  currency?: boolean
  suffix?: string
  style?: CSSProperties
}

export const CounterNumber = ({
  targetValue,
  startFrame,
  durationFrames = 60,
  currency = true,
  suffix = '',
  style,
}: CounterNumberProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, targetValue],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }
  )

  const formatted = currency
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(progress))
    : Math.round(progress).toString()

  return (
    <span style={{ fontFamily: FONTS.mono, color: COLORS.textPrimary, ...style }}>
      {formatted}{suffix}
    </span>
  )
}
