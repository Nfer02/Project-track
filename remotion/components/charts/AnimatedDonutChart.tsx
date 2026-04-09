// remotion/components/charts/AnimatedDonutChart.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { DEMO_DATA } from '../../constants/data'

interface AnimatedDonutChartProps {
  startFrame: number
  durationFrames?: number
}

export const AnimatedDonutChart = ({ startFrame, durationFrames = 80 }: AnimatedDonutChartProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame, [startFrame, startFrame + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2) }
  )

  const total = DEMO_DATA.donutChart.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={DEMO_DATA.donutChart}
            cx="50%" cy="50%"
            innerRadius={54} outerRadius={80}
            startAngle={90} endAngle={90 - 360 * progress}
            dataKey="value" strokeWidth={0}
          >
            {DEMO_DATA.donutChart.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', textAlign: 'center',
      }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary }}>
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(total * progress))}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textMuted }}>total gastos</div>
      </div>
    </div>
  )
}
