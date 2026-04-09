// remotion/scenes/Scene02Problem.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { ExcelTableMock } from '../components/ui/ExcelTableMock'

export const Scene02Problem = () => {
  const frame = useCurrentFrame()

  const tableOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const text1Opacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' })
  const text2Opacity = interpolate(frame, [250, 265], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor="#374151" glowOpacity={0.08} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 120px', gap: 48,
      }}>
        <div style={{ opacity: tableOpacity, width: '100%', maxWidth: 800 }}>
          <ExcelTableMock startFrame={10} />
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ opacity: text1Opacity, fontFamily: FONTS.display, fontSize: 40, fontWeight: FONT_WEIGHTS.bold, color: '#d4c5a9' }}>
            "Fin de trimestre."
          </div>
          <div style={{ opacity: text2Opacity, fontFamily: FONTS.body, fontSize: 28, color: COLORS.textSecondary }}>
            Y nunca tienes el control real de tu negocio.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
