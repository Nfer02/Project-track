// remotion/components/charts/AnimatedBarChart.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { COLORS, FONTS } from '../../constants/theme'
import { DEMO_DATA } from '../../constants/data'

interface AnimatedBarChartProps {
  startFrame: number
  durationFrames?: number
}

export const AnimatedBarChart = ({ startFrame, durationFrames = 90 }: AnimatedBarChartProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame, [startFrame, startFrame + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }
  )

  const animatedData = DEMO_DATA.barChart.map(d => ({
    ...d,
    ingresos: Math.round(d.ingresos * progress),
    gastos: Math.round(d.gastos * progress),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={animatedData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: COLORS.textMuted, fontSize: 12, fontFamily: FONTS.body }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11, fontFamily: FONTS.mono }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
        <Bar dataKey="ingresos" name="Ingresos" fill={COLORS.green} radius={[4, 4, 0, 0]} maxBarSize={24} />
        <Bar dataKey="gastos"   name="Gastos"   fill={COLORS.red}   radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
