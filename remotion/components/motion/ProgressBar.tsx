// remotion/components/motion/ProgressBar.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS } from '../../constants/theme'

interface ProgressBarProps {
  startFrame: number
  durationFrames: number
  label?: string
  color?: string
}

export const ProgressBar = ({
  startFrame,
  durationFrames,
  label = 'Analizando con IA…',
  color = COLORS.accent,
}: ProgressBarProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{ opacity, width: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary }}>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: color }}>{Math.round(progress)}%</span>
      </div>
      <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: 3,
          boxShadow: `0 0 12px ${color}66`,
          transition: 'width 0s',
        }} />
      </div>
    </div>
  )
}
