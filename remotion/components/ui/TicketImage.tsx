// remotion/components/ui/TicketImage.tsx
import React from 'react'

export const TicketImage = ({ style }: { style?: React.CSSProperties }) => (
  <div style={{
    background: '#fff',
    borderRadius: 8,
    padding: '20px 24px',
    width: 260,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    fontFamily: 'Arial, sans-serif',
    color: '#1a1a1a',
    fontSize: 11,
    lineHeight: 1.6,
    ...style,
  }}>
    <div style={{ fontWeight: 700, fontSize: 14, textAlign: 'center', marginBottom: 4 }}>LEROY MERLIN</div>
    <div style={{ fontSize: 10, textAlign: 'center', color: '#666', marginBottom: 12 }}>A28543397 · Madrid</div>
    <div style={{ borderTop: '1px dashed #ccc', marginBottom: 10 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span>Cemento gris 25kg x4</span><span>38,40€</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span>Ladrillo macizo 21% x200</span><span>75,50€</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span>Yeso proyectable 10kg</span><span>47,23€</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
      <span>Pintura blanca 15L</span><span>37,53€</span>
    </div>
    <div style={{ borderTop: '1px dashed #ccc', marginBottom: 8 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Base imponible</span><span>204,13€</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>IVA 21%</span><span>42,87€</span>
    </div>
    <div style={{ borderTop: '2px solid #1a1a1a', marginTop: 6, marginBottom: 4 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
      <span>TOTAL</span><span>247,00€</span>
    </div>
    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#666' }}>05/04/2026 · 14:32h</div>
  </div>
)
