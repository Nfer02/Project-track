// remotion/components/motion/KeywordPill.tsx
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS } from '../../constants/theme'
import { CSSProperties, ReactNode } from 'react'

interface KeywordPillProps {
  children: ReactNode
  startFrame: number
  color?: 'blue' | 'green' | 'amber' | 'purple'
  style?: CSSProperties
}

const COLOR_MAP = {
  blue:   { border: COLORS.accent,  bg: COLORS.accentGlow,  text: '#93c5fd' },
  green:  { border: COLORS.green,   bg: COLORS.greenGlow,   text: '#6ee7b7' },
  amber:  { border: COLORS.amber,   bg: 'rgba(245,158,11,0.12)', text: '#fcd34d' },
  purple: { border: COLORS.purple,  bg: 'rgba(139,92,246,0.12)', text: '#c4b5fd' },
}

export const KeywordPill = ({
  children,
  startFrame,
  color = 'blue',
  style,
}: KeywordPillProps) => {
  const frame = useCurrentFrame()
  const { border, bg, text } = COLOR_MAP[color]

  const scale = spring({ frame, fps: FPS, from: 0.7, to: 1, delay: startFrame, config: { damping: 14, stiffness: 180 } })
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <span style={{
      display: 'inline-block',
      border: `1.5px solid ${border}`,
      background: bg,
      color: text,
      borderRadius: 6,
      padding: '2px 10px',
      transform: `scale(${scale})`,
      opacity,
      ...style,
    }}>
      {children}
    </span>
  )
}
