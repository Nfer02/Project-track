// remotion/scenes/Scene08CTA.tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { TypewriterText } from '../components/motion/TypewriterText'
import { PTLogo } from '../components/ui/PTLogo'

export const Scene08CTA = () => {
  const frame = useCurrentFrame()
  const totalFrames = 300

  // Logo
  const logoScale = spring({ frame, fps: FPS, from: 0.8, to: 1, delay: 20, config: { damping: 20, stiffness: 150 } })
  const logoOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' })

  // URL
  const urlOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: 'clamp' })

  // Tagline
  const taglineOpacity = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: 'clamp' })

  // Fade a negro final
  const fadeToBlack = interpolate(frame, [totalFrames - 60, totalFrames], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor={COLORS.accent} glowOpacity={0.15} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32,
      }}>
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, display: 'flex', alignItems: 'center', gap: 24 }}>
          <PTLogo size={90} />
          <span style={{ fontFamily: FONTS.display, fontSize: 64, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, letterSpacing: '-1px' }}>
            ProjectTrack
          </span>
        </div>

        {/* URL */}
        <div style={{ opacity: urlOpacity }}>
          <span style={{
            fontFamily: FONTS.mono, fontSize: 32, fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.accent,
          }}>
            <TypewriterText text="projecttrack.app" startFrame={80} charsPerFrame={1.8} showCursor={false} />
          </span>
        </div>

        {/* Taglines */}
        <div style={{ opacity: taglineOpacity, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 26, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium }}>
            Sin tarjeta. Sin complicaciones.
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 22, color: COLORS.textMuted }}>
            Solo tú con el control de tu negocio.
          </div>
        </div>
      </AbsoluteFill>

      {/* Fade a negro */}
      <AbsoluteFill style={{ background: '#000', opacity: fadeToBlack, pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}
