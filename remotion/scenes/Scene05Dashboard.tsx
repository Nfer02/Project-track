// remotion/scenes/Scene05Dashboard.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { AppFrame } from '../components/ui/AppFrame'
import { DashboardUI } from '../components/ui/DashboardUI'
import { KeywordPill } from '../components/motion/KeywordPill'
import { SCENES } from '../constants/timing'

export const Scene05Dashboard = () => {
  const frame = useCurrentFrame()

  const overlayOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor={COLORS.accent} glowOpacity={0.1} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        padding: '40px 60px',
      }}>
        <div style={{ opacity: overlayOpacity, textAlign: 'center', marginBottom: 4 }}>
          <KeywordPill startFrame={20} color="blue">
            <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold }}>
              Tu negocio. De un vistazo.
            </span>
          </KeywordPill>
        </div>
        <AppFrame startFrame={0} width={1500} height={820}>
          <DashboardUI startFrame={SCENES.dashboard.start} />
        </AppFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
