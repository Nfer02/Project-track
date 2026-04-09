// remotion/scenes/Scene03Twist.tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { ExcelTableMock } from '../components/ui/ExcelTableMock'
import { DashboardUI } from '../components/ui/DashboardUI'

export const Scene03Twist = () => {
  const frame = useCurrentFrame()

  // Excel se va a la izquierda
  const excelX = interpolate(frame, [0, 60], [0, -200], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) })
  const excelOpacity = interpolate(frame, [0, 60], [0.6, 0], { extrapolateRight: 'clamp' })

  // Dashboard entra desde la derecha
  const dashX = spring({ frame, fps: FPS, from: 300, to: 0, delay: 20, config: { damping: 22, stiffness: 120 } })
  const dashOpacity = interpolate(frame, [20, 50], [0, 0.15], { extrapolateRight: 'clamp' })

  // Texto central
  const textScale = spring({ frame, fps: FPS, from: 0.8, to: 1, delay: 30, config: { damping: 18, stiffness: 150 } })
  const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={10} />
      {/* Excel saliendo */}
      <div style={{
        position: 'absolute', left: 80 + excelX, top: '50%',
        transform: 'translateY(-50%)', opacity: excelOpacity, width: 500,
      }}>
        <ExcelTableMock />
      </div>
      {/* Dashboard preview borroso de fondo */}
      <div style={{
        position: 'absolute', right: 0 + dashX, top: 0,
        width: '55%', height: '100%', opacity: dashOpacity,
        filter: 'blur(2px)',
      }}>
        <DashboardUI startFrame={999} />
      </div>
      {/* Texto central */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center',
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          zIndex: 10,
        }}>
          <div style={{
            fontFamily: FONTS.display, fontSize: 96, fontWeight: FONT_WEIGHTS.extrabold,
            color: COLORS.textPrimary, lineHeight: 1.1,
            textShadow: '0 0 60px rgba(59,130,246,0.4)',
            background: 'linear-gradient(135deg, #f9fafb 30%, #93c5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Hay otra forma.
          </div>
          <div style={{
            fontFamily: FONTS.body, fontSize: 22, color: COLORS.textMuted,
            marginTop: 16, fontWeight: FONT_WEIGHTS.regular,
          }}>
            Presentamos ProjectTrack.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
