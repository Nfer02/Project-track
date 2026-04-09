// remotion/scenes/Scene06Export.tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { AppFrame } from '../components/ui/AppFrame'
import { ReportsUI } from '../components/ui/ReportsUI'
import { AnimatedCursor } from '../components/motion/AnimatedCursor'
import { ProgressBar } from '../components/motion/ProgressBar'
import { KeywordPill } from '../components/motion/KeywordPill'

export const Scene06Export = () => {
  const frame = useCurrentFrame()

  // Cursor se mueve al botón Exportar CSV (posición aproximada en el frame)
  const cursorStart = 40
  const cursorEnd = 110
  const clickFrame = 120
  const downloadStart = 135

  const overlayOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' })

  // Escala del botón al hacer click
  const btnScale = spring({ frame, fps: FPS, from: 1, to: 0.95, delay: clickFrame, config: { damping: 10, stiffness: 300 } })

  // Icono CSV pop-in
  const csvScale = spring({ frame, fps: FPS, from: 0, to: 1, delay: downloadStart + 45, config: { damping: 12, stiffness: 200 } })
  const csvOpacity = interpolate(frame, [downloadStart + 45, downloadStart + 60], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor={COLORS.purple} glowOpacity={0.08} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        padding: '40px 60px',
      }}>
        <div style={{ opacity: overlayOpacity, textAlign: 'center', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary }}>Exporta.</span>
          <KeywordPill startFrame={20} color="purple">
            <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold }}>Envía.</span>
          </KeywordPill>
          <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary }}>Listo.</span>
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          <AppFrame startFrame={0} width={1500} height={760}>
            <ReportsUI />
          </AppFrame>
          {/* Cursor animado */}
          {frame >= cursorStart && frame < downloadStart + 80 && (
            <AnimatedCursor
              from={{ x: 700, y: 400 }}
              to={{ x: 1285, y: 68 }}
              moveStartFrame={cursorStart}
              moveDurationFrames={cursorEnd - cursorStart}
              clickFrame={clickFrame}
            />
          )}
          {/* Progress bar de descarga */}
          {frame >= downloadStart && frame < downloadStart + 55 && (
            <div style={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)', width: 400 }}>
              <ProgressBar startFrame={downloadStart} durationFrames={50} label="Generando CSV…" color={COLORS.purple} />
            </div>
          )}
          {/* CSV Badge */}
          {frame >= downloadStart + 45 && (
            <div style={{
              position: 'absolute', bottom: -50, left: '50%', transform: `translateX(-50%) scale(${csvScale})`,
              opacity: csvOpacity, display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 10, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 28 }}>📊</span>
              <div>
                <div style={{ fontFamily: FONTS.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, fontSize: 14 }}>
                  reporte_T2_2026.csv
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted }}>Listo para tu gestor</div>
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
