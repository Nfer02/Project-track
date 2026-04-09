// remotion/components/ui/ExcelTableMock.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { FONTS } from '../../constants/theme'

const ROWS = [
  ['Proyecto A', '=SUMA(C2:C8)', '#¡REF!', '???'],
  ['Proyecto B', '4500', '=B3*0.21', '#¡VALOR!'],
  ['Gasto gasolinera', '---', '=IF(B4>0,"ok","ko")', '67'],
  ['Factura proveed...', '2300', '#¡REF!', '=B5-C5'],
  ['Proyecto C', '=SUMA()', '483', '#¡DIV/0!'],
  ['TOTAL???', '=SUMA(B2:B6)', '---', '???'],
]

export const ExcelTableMock = ({ startFrame = 0 }: { startFrame?: number }) => {
  const frame = useCurrentFrame()

  return (
    <div style={{
      background: '#1d1d1d',
      border: '1px solid #333',
      borderRadius: 4,
      overflow: 'hidden',
      fontFamily: 'Consolas, monospace',
      fontSize: 13,
      width: '100%',
    }}>
      {/* Header bar */}
      <div style={{ background: '#2d7d4f', color: '#fff', padding: '6px 12px', fontSize: 12, fontFamily: FONTS.body }}>
        📊 finanzas_q2_definitivo_FINAL_v3.xlsx
      </div>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr', background: '#2a2a2a', borderBottom: '1px solid #444' }}>
        {['', 'B — Facturado', 'C — IVA', 'D — Cobrado'].map((h, i) => (
          <div key={i} style={{ padding: '6px 10px', color: '#999', fontSize: 12, borderRight: '1px solid #333' }}>{h}</div>
        ))}
      </div>
      {/* Rows */}
      {ROWS.map((row, ri) => {
        const rowOpacity = interpolate(frame, [startFrame + ri * 12, startFrame + ri * 12 + 10], [0, 1], { extrapolateRight: 'clamp' })
        return (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr', borderBottom: '1px solid #2a2a2a', opacity: rowOpacity }}>
            {row.map((cell, ci) => (
              <div key={ci} style={{
                padding: '7px 10px',
                color: cell.startsWith('#¡') ? '#ef4444' : cell.startsWith('=') ? '#60a5fa' : '#e2e8f0',
                borderRight: '1px solid #2a2a2a',
                background: cell.startsWith('#¡') ? 'rgba(239,68,68,0.08)' : 'transparent',
              }}>{cell}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
