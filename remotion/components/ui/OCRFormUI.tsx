// remotion/components/ui/OCRFormUI.tsx
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { TypewriterText } from '../motion/TypewriterText'
import { ProgressBar } from '../motion/ProgressBar'
import { TicketImage } from './TicketImage'
import { ClaudeAIBadge } from './ClaudeAIBadge'
import { Sidebar } from './Sidebar'
import { DEMO_DATA } from '../../constants/data'

interface OCRFormUIProps {
  startFrame: number // Frame absoluto de inicio de la escena
}

export const OCRFormUI = ({ startFrame }: OCRFormUIProps) => {
  const frame = useCurrentFrame()
  const { ocr } = DEMO_DATA

  // Fases de la animación (frames relativos al startFrame)
  const F = (offset: number) => startFrame + offset

  // Ticket que cae al upload zone
  const ticketScale = spring({ frame, fps: FPS, from: 0, to: 1, delay: F(50), config: { damping: 14, stiffness: 180 } })
  const ticketOpacity = interpolate(frame, [F(50), F(65)], [0, 1], { extrapolateRight: 'clamp' })

  // Badge aparece al completar el análisis
  const badgeVisible = frame >= F(150)

  // Campos que se van rellenando
  const showProveedor    = frame >= F(150)
  const showNIF         = frame >= F(185)
  const showBase        = frame >= F(215)
  const showIVA         = frame >= F(245)
  const showTotal       = frame >= F(275)
  const showProyecto    = frame >= F(310)

  const FormField = ({
    label, value, show, flashFrame, mono = false,
  }: { label: string; value: string; show: boolean; flashFrame: number; mono?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium }}>
        {label}
      </label>
      <div style={{
        height: 38, borderRadius: 8, padding: '0 12px',
        border: `1px solid ${show && frame < flashFrame + 25 ? COLORS.green : COLORS.border}`,
        background: COLORS.bgCard,
        display: 'flex', alignItems: 'center',
        boxShadow: show && frame < flashFrame + 25 ? `0 0 0 3px ${COLORS.greenGlow}` : 'none',
        transition: 'none',
      }}>
        {show && (
          <TypewriterText
            text={value}
            startFrame={flashFrame}
            charsPerFrame={2}
            style={{ fontFamily: mono ? FONTS.mono : FONTS.body, fontSize: 14, color: COLORS.textPrimary }}
          />
        )}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLORS.bg }}>
      <Sidebar activeItem="Gastos / Compras" />
      <div style={{ flex: 1, display: 'flex', gap: 0 }}>
        {/* Panel izquierdo — ticket */}
        <div style={{
          width: '40%', padding: '40px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
          borderRight: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, margin: 0 }}>
              Sube una factura
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted, marginTop: 6 }}>
              PDF o foto para auto-rellenar
            </p>
          </div>

          {/* Upload zone con ticket */}
          <div style={{
            width: 300, height: 340,
            border: `2px dashed ${COLORS.accentBorder}`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: COLORS.accentGlow,
            position: 'relative', overflow: 'visible',
          }}>
            <div style={{
              transform: `scale(${ticketScale})`,
              opacity: ticketOpacity,
              position: 'absolute',
            }}>
              <TicketImage />
            </div>
            {frame < F(50) && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📎</div>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted }}>
                  Arrastra aquí o haz clic
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {frame >= F(80) && frame < F(170) && (
            <div style={{ width: '100%', maxWidth: 300 }}>
              <ProgressBar startFrame={F(80)} durationFrames={70} label="Analizando con IA…" color={COLORS.accent} />
            </div>
          )}

          {/* Claude AI Badge */}
          {badgeVisible && (
            <ClaudeAIBadge startFrame={F(150)} />
          )}
        </div>

        {/* Panel derecho — formulario */}
        <div style={{ flex: 1, padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'hidden' }}>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, margin: 0 }}>
            Nuevo gasto
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Proveedor *" value={ocr.proveedor} show={showProveedor} flashFrame={F(150)} />
            <FormField label="NIF del proveedor" value={ocr.nif} show={showNIF} flashFrame={F(185)} mono />
            <FormField label="Descripción" value={ocr.descripcion} show={showBase} flashFrame={F(215)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Base imponible (EUR)" value={`${ocr.baseImponible}€`} show={showBase} flashFrame={F(215)} mono />
              <FormField label="IVA incluido (EUR)" value={`${ocr.iva}€`} show={showIVA} flashFrame={F(245)} mono />
            </div>
            <FormField label="Total factura" value={`${ocr.total}€`} show={showTotal} flashFrame={F(275)} mono />
            {showProyecto && (
              <div>
                <label style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, fontWeight: FONT_WEIGHTS.medium }}>
                  Asignar a proyecto
                </label>
                <div style={{
                  marginTop: 4, padding: '10px 14px', borderRadius: 8,
                  background: COLORS.greenGlow, border: `1px solid ${COLORS.green}44`,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ color: COLORS.green, fontSize: 14 }}>✓</span>
                  <TypewriterText
                    text={ocr.proyecto}
                    startFrame={F(310)}
                    charsPerFrame={2.5}
                    style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.green, fontWeight: FONT_WEIGHTS.medium }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
