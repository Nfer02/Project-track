// remotion/components/ui/ClaudeAIBadge.tsx
import { useCurrentFrame, spring } from 'remotion'
import { FPS } from '../../constants/timing'
import { FONTS, FONT_WEIGHTS } from '../../constants/theme'

export const ClaudeAIBadge = ({ startFrame }: { startFrame: number }) => {
  const frame = useCurrentFrame()
  const scale = spring({ frame, fps: FPS, from: 0, to: 1, delay: startFrame, config: { damping: 12, stiffness: 200 } })

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
      border: '1px solid rgba(139,92,246,0.4)',
      borderRadius: 20, padding: '6px 14px',
      transform: `scale(${scale})`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: 'white', fontWeight: FONT_WEIGHTS.bold,
      }}>✦</div>
      <span style={{ fontFamily: FONTS.body, fontSize: 13, color: '#c4b5fd', fontWeight: FONT_WEIGHTS.medium }}>
        Powered by Claude AI
      </span>
    </div>
  )
}
