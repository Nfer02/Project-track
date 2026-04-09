// remotion/components/ui/PTLogo.tsx
// Logo isométrico de ProjectTrack (extraído de components/app/logo.tsx)
import { CSSProperties } from 'react'

interface PTLogoProps {
  size?: number
  style?: CSSProperties
}

export const PTLogo = ({ size = 48, style }: PTLogoProps) => {
  const height = Math.round(size * (300 / 260))
  const id = 'ptlogo-video'

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 260 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 16px rgba(59,130,246,0.35))', ...style }}
      aria-label="ProjectTrack logo"
    >
      <defs>
        <linearGradient id={`fTop-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`fRight-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={`fLeft-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id={`gArrow-${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Columna izquierda */}
      <polygon points="30,100 90,65 90,250 30,285" fill={`url(#fLeft-${id})`} />
      <polygon points="90,65 130,85 130,270 90,250" fill={`url(#fRight-${id})`} />
      <polygon points="30,100 90,65 130,85 70,120" fill={`url(#fTop-${id})`} />

      {/* Arco de la P */}
      <polygon points="90,65 165,30 195,45 130,85" fill={`url(#fTop-${id})`} />
      <polygon points="195,45 195,115 130,155 130,85" fill={`url(#fRight-${id})`} />
      <polygon points="165,30 195,45 195,115 165,100" fill={`url(#fRight-${id})`} opacity="0.85" />

      {/* Bloque inferior del arco */}
      <polygon points="90,135 165,100 195,115 130,155" fill={`url(#fTop-${id})`} opacity="0.75" />
      <polygon points="130,85 130,155 90,135 90,65" fill="#0c1629" opacity="0.5" />

      {/* Cara exterior derecha */}
      <polygon points="195,45 195,115 165,100 165,30" fill={`url(#fRight-${id})`} opacity="0.9" />

      {/* Escalón base */}
      <polygon points="30,245 50,235 50,270 30,285" fill={`url(#fLeft-${id})`} opacity="0.6" />
      <polygon points="30,245 50,235 90,250 70,262" fill={`url(#fTop-${id})`} opacity="0.4" />

      {/* Flecha verde de crecimiento */}
      <line x1="180" y1="85" x2="175" y2="65" stroke={`url(#gArrow-${id})`} strokeWidth="5" strokeLinecap="round" />
      <polyline points="169,72 174,60 181,70" fill="none" stroke={`url(#gArrow-${id})`} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Brillos */}
      <polygon points="30,100 90,65 130,85 70,120" fill="white" opacity="0.06" />
      <polygon points="90,65 165,30 195,45 130,85" fill="white" opacity="0.08" />

      {/* Bordes iluminados */}
      <line x1="30" y1="100" x2="90" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="90" y1="65" x2="165" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="165" y1="30" x2="195" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
    </svg>
  )
}
