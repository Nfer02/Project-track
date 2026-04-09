// remotion/components/ui/AppFrame.tsx
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS } from '../../constants/theme'
import { ReactNode } from 'react'

interface AppFrameProps {
  children: ReactNode
  startFrame?: number
  width?: number
  height?: number
}

export const AppFrame = ({ children, startFrame = 0, width = 1600, height = 900 }: AppFrameProps) => {
  const frame = useCurrentFrame()

  const scale = spring({ frame, fps: FPS, from: 0.93, to: 1, delay: startFrame, config: { damping: 22, stiffness: 160 } })
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: 'clamp' })
  const glowOpacity = interpolate(frame, [startFrame, startFrame + 40], [0, 0.6], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      width, height,
      borderRadius: 16,
      overflow: 'hidden',
      transform: `scale(${scale})`,
      opacity,
      boxShadow: `0 0 80px rgba(59,130,246,${glowOpacity * 0.4}), 0 40px 80px rgba(0,0,0,0.6)`,
      border: `1px solid ${COLORS.accentBorder}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Chrome bar */}
      <div style={{
        height: 38,
        background: '#060c18',
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 14px', gap: 8, flexShrink: 0,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
        <div style={{
          flex: 1, marginLeft: 12, height: 22,
          background: COLORS.bgCard, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: '"Inter", sans-serif' }}>
            project-track-ruby.vercel.app
          </span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
