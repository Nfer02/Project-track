// remotion/components/motion/GlowBackground.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS } from '../../constants/theme'

interface GlowBackgroundProps {
  glowColor?: string
  glowOpacity?: number
  showDotGrid?: boolean
  fadeInFrames?: number
}

export const GlowBackground = ({
  glowColor = COLORS.accent,
  glowOpacity = 0.12,
  showDotGrid = true,
  fadeInFrames = 30,
}: GlowBackgroundProps) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      {showDotGrid && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${COLORS.textMuted}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      )}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 900,
        background: `radial-gradient(circle, ${glowColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  )
}
