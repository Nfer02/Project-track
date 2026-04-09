// remotion/scenes/Scene07Pricing.tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'

const PricingCard = ({ plan, price, description, features, highlight, delay }: {
  plan: string; price: string; description: string; features: string[]; highlight: boolean; delay: number
}) => {
  const frame = useCurrentFrame()
  const translateY = spring({ frame, fps: FPS, from: 60, to: 0, delay, config: { damping: 20, stiffness: 140 } })
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, #1e3a5f, #1a2d4a)' : COLORS.bgCard,
      border: `2px solid ${highlight ? COLORS.accent : COLORS.border}`,
      borderRadius: 16, padding: '32px 36px', minWidth: 320,
      transform: `translateY(${translateY}px)`, opacity,
      boxShadow: highlight ? `0 0 40px rgba(59,130,246,0.2)` : 'none',
    }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textSecondary, marginBottom: 8 }}>{plan}</div>
      <div style={{ fontFamily: FONTS.display, fontSize: 48, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, lineHeight: 1 }}>
        {price}
        {price !== 'Gratis' && <span style={{ fontSize: 18, color: COLORS.textMuted }}>/mes</span>}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted, margin: '12px 0 20px' }}>{description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: COLORS.green, fontSize: 16 }}>✓</span>
            <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Scene07Pricing = () => {
  const frame = useCurrentFrame()
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={10} glowColor={COLORS.accent} glowOpacity={0.12} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 48,
      }}>
        <div style={{ opacity: titleOpacity, textAlign: 'center' }}>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 44, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, margin: 0 }}>
            Empieza gratis. Crece cuando quieras.
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <PricingCard
            plan="Starter"
            price="Gratis"
            description="Para empezar a tener el control"
            features={['Hasta 3 proyectos', 'Facturas básicas', 'Dashboard financiero', 'Soporte por email']}
            highlight={false}
            delay={20}
          />
          <PricingCard
            plan="PRO"
            price="14,99€"
            description="Para profesionales serios"
            features={['Proyectos ilimitados', 'OCR con IA ilimitado', 'Estimación fiscal trimestral', 'Exportar CSV', 'Soporte prioritario']}
            highlight={true}
            delay={45}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
