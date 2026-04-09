// remotion/scenes/Scene04OCR.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { AppFrame } from '../components/ui/AppFrame'
import { OCRFormUI } from '../components/ui/OCRFormUI'
import { KeywordPill } from '../components/motion/KeywordPill'
import { SCENES } from '../constants/timing'

export const Scene04OCR = () => {
  const frame = useCurrentFrame()

  // AppFrame materializa en los primeros 30 frames
  const appOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })

  // Texto overlay aparece tarde
  const overlayOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={20} glowColor={COLORS.green} glowOpacity={0.08} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        padding: '40px 60px',
      }}>
        {/* Texto superior */}
        <div style={{ opacity: overlayOpacity, textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary }}>
            Sube la foto.{' '}
          </span>
          <KeywordPill startFrame={30} color="green">
            <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold }}>
              La IA hace el resto.
            </span>
          </KeywordPill>
        </div>

        {/* App Frame con el formulario OCR */}
        <div style={{ opacity: appOpacity, width: '100%' }}>
          <AppFrame startFrame={0} width={1500} height={820}>
            {/* startFrame=0 porque dentro de Sequence los frames son relativos */}
            <OCRFormUI startFrame={0} />
          </AppFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
