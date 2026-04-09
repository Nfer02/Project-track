// remotion/scenes/Scene01Hook.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { TypewriterText } from '../components/motion/TypewriterText'
import { KeywordPill } from '../components/motion/KeywordPill'

export const Scene01Hook = () => {
  const frame = useCurrentFrame()
  // Frames relativos a esta escena (empieza en frame 0 aquí)
  const q1Start = 20
  const q2Start = 80
  const q3Start = 145

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={20} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32,
        padding: '0 200px',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Pregunta 1 */}
          <div style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, lineHeight: 1.2 }}>
            <TypewriterText text="¿Cuánto has ganado en este proyecto?" startFrame={q1Start} charsPerFrame={2} />
          </div>
          {/* Pregunta 2 con pill */}
          {frame >= q2Start - 5 && (
            <div style={{ fontFamily: FONTS.display, fontSize: 44, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textSecondary, lineHeight: 1.2 }}>
              <TypewriterText text="¿Cuánto " startFrame={q2Start} charsPerFrame={2.5} />
              <KeywordPill startFrame={q2Start + 28} color="blue">queda por cobrar</KeywordPill>
              <TypewriterText text="?" startFrame={q2Start + 80} charsPerFrame={3} />
            </div>
          )}
          {/* Pregunta 3 */}
          {frame >= q3Start - 5 && (
            <div style={{ fontFamily: FONTS.display, fontSize: 44, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textMuted, lineHeight: 1.2 }}>
              <TypewriterText text="¿Cuánto te " startFrame={q3Start} charsPerFrame={2.5} />
              <KeywordPill startFrame={q3Start + 36} color="amber">costó</KeywordPill>
              <TypewriterText text="?" startFrame={q3Start + 70} charsPerFrame={3} />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
