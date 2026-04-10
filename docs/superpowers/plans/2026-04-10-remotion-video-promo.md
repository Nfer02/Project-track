# Remotion Video Promo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un video promocional de 75s, 1920×1080, 30fps para ProjectTrack usando Remotion + React, con UI recreada nativamente (sin capturas de pantalla) y animaciones tipo Luma Agents.

**Architecture:** Cada escena es un componente React independiente compuesto en `MainVideo.tsx`. Los componentes de UI (`DashboardUI`, `OCRFormUI`) recrean fielmente la app real usando los mismos colores, tipografía y Recharts. Los componentes de animación (`TypewriterText`, `KeywordPill`, `CounterNumber`) se basan en `useCurrentFrame()` y `spring()` de Remotion.

**Tech Stack:** Remotion 4.x, React 19, TypeScript, Recharts (ya instalado), Plus Jakarta Sans + Inter + JetBrains Mono (Google Fonts)

**Spec:** `docs/superpowers/specs/2026-04-10-remotion-video-promo-design.md`

---

## File Map

```
remotion/
├── index.ts                          # Entry point Remotion
├── Root.tsx                          # Registro de composiciones
├── compositions/
│   └── MainVideo.tsx                 # Composición principal 75s
├── constants/
│   ├── theme.ts                      # Colores, fonts, spacing
│   ├── timing.ts                     # Frames por escena (30fps)
│   └── data.ts                       # Datos demo (sin datos reales)
├── components/
│   ├── motion/
│   │   ├── TypewriterText.tsx        # Texto carácter a carácter
│   │   ├── KeywordPill.tsx           # Pill box estilo Luma
│   │   ├── CounterNumber.tsx         # Número animado 0→N
│   │   ├── AnimatedCursor.tsx        # Cursor SVG animado
│   │   ├── ProgressBar.tsx           # Barra de progreso IA
│   │   └── GlowBackground.tsx        # Fondo oscuro + dot grid + glow
│   ├── ui/
│   │   ├── Sidebar.tsx               # Sidebar de la app
│   │   ├── AppFrame.tsx              # Marco de ventana con chrome bar
│   │   ├── KPICard.tsx               # Tarjeta KPI animada
│   │   ├── DashboardUI.tsx           # Dashboard completo (KPIs + charts)
│   │   ├── OCRFormUI.tsx             # Formulario nuevo gasto
│   │   ├── TicketImage.tsx           # Factura ficticia SVG
│   │   ├── ClaudeAIBadge.tsx         # Badge "Powered by Claude AI"
│   │   ├── ExcelTableMock.tsx        # Simulación Excel caótico
│   │   └── ReportsUI.tsx             # Vista reportes trimestrales
│   └── charts/
│       ├── AnimatedBarChart.tsx      # Barras que crecen (Recharts)
│       ├── AnimatedDonutChart.tsx    # Donut que se dibuja
│       └── AnimatedGauge.tsx         # Gauge reserva fiscal
└── scenes/
    ├── Scene01Hook.tsx               # 0–7s: Preguntas typewriter
    ├── Scene02Problem.tsx            # 7–20s: Excel caótico
    ├── Scene03Twist.tsx              # 20–25s: "Hay otra forma"
    ├── Scene04OCR.tsx                # 25–38s: OCR en acción ★
    ├── Scene05Dashboard.tsx          # 38–52s: Dashboard animado
    ├── Scene06Export.tsx             # 52–60s: Exportar CSV
    ├── Scene07Pricing.tsx            # 60–65s: Planes
    └── Scene08CTA.tsx                # 65–75s: CTA final
```

**Archivos a modificar:**
- `package.json` — añadir scripts `video:preview` y `video:render`
- `next.config.ts` — excluir `remotion/` del build de Next.js

---

## Task 1: Instalar Remotion y configurar proyecto

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `remotion/index.ts`
- Create: `remotion/Root.tsx`

- [ ] **Step 1: Instalar dependencias**

```bash
pnpm add remotion @remotion/cli @remotion/renderer
```

Espera output: `Done in Xs` sin errores.

- [ ] **Step 2: Añadir scripts a package.json**

Añadir dentro de `"scripts"`:
```json
"video:preview": "remotion studio remotion/index.ts",
"video:render": "remotion render remotion/index.ts MainVideo public/projecttrack-promo-v3.mp4 --codec h264"
```

- [ ] **Step 3: Excluir remotion del build de Next.js**

En `next.config.ts`, añadir dentro de `nextConfig`:
```ts
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = [...(config.externals || []), 'remotion']
  }
  return config
},
```

- [ ] **Step 4: Crear entry point**

```ts
// remotion/index.ts
import { registerRoot } from 'remotion'
import { Root } from './Root'
registerRoot(Root)
```

- [ ] **Step 5: Crear Root con composición placeholder**

```tsx
// remotion/Root.tsx
import { Composition } from 'remotion'
import { MainVideo } from './compositions/MainVideo'

export const Root = () => (
  <Composition
    id="MainVideo"
    component={MainVideo}
    durationInFrames={2250}
    fps={30}
    width={1920}
    height={1080}
  />
)
```

- [ ] **Step 6: Crear MainVideo placeholder**

```tsx
// remotion/compositions/MainVideo.tsx
import { AbsoluteFill } from 'remotion'

export const MainVideo = () => (
  <AbsoluteFill style={{ background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ color: 'white', fontSize: 48, fontFamily: 'Inter' }}>
      ProjectTrack Video — In Progress
    </span>
  </AbsoluteFill>
)
```

- [ ] **Step 7: Verificar que Remotion arranca**

```bash
pnpm video:preview
```

Esperado: abre http://localhost:3001 (o similar) con el canvas en negro y el texto placeholder. Si abre correctamente, Remotion está instalado.

- [ ] **Step 8: Commit**

```bash
git add remotion/ package.json next.config.ts pnpm-lock.yaml
git commit -m "feat(video): setup Remotion con composición placeholder"
```

---

## Task 2: Constantes de tema, timing y datos demo

**Files:**
- Create: `remotion/constants/theme.ts`
- Create: `remotion/constants/timing.ts`
- Create: `remotion/constants/data.ts`

- [ ] **Step 1: Crear theme.ts**

```ts
// remotion/constants/theme.ts
export const COLORS = {
  bg: '#0a0f1a',
  bgCard: '#111827',
  bgCardHover: '#1f2937',
  bgCardBorder: '#1f2937',
  accent: '#3b82f6',
  accentGlow: 'rgba(59,130,246,0.15)',
  accentBorder: 'rgba(59,130,246,0.3)',
  green: '#10b981',
  greenLight: '#34d399',
  greenGlow: 'rgba(16,185,129,0.2)',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  red: '#ef4444',
  purple: '#8b5cf6',
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  border: '#1f2937',
} as const

export const FONTS = {
  display: '"Plus Jakarta Sans", sans-serif',
  body: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const

export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const
```

- [ ] **Step 2: Crear timing.ts**

```ts
// remotion/constants/timing.ts
// Todos los tiempos en frames a 30fps
export const FPS = 30
export const DURATION_FRAMES = 2250 // 75 segundos

// Inicio de cada escena (frame absoluto)
export const SCENES = {
  hook:      { start: 0,    end: 210  }, // 0–7s
  problem:   { start: 210,  end: 600  }, // 7–20s
  twist:     { start: 600,  end: 750  }, // 20–25s
  ocr:       { start: 750,  end: 1140 }, // 25–38s
  dashboard: { start: 1140, end: 1560 }, // 38–52s
  export:    { start: 1560, end: 1800 }, // 52–60s
  pricing:   { start: 1800, end: 1950 }, // 60–65s
  cta:       { start: 1950, end: 2250 }, // 65–75s
} as const

export const TRANSITION_FRAMES = 15 // 0.5s overlap entre escenas
```

- [ ] **Step 3: Crear data.ts**

```ts
// remotion/constants/data.ts
// Datos de demo — 100% ficticios, sin datos reales de clientes

export const DEMO_DATA = {
  workspace: 'Estudio Martín',
  kpis: {
    ingresos: 15000,
    gastos: 6320,
    beneficioNeto: 12430,
    proyectosActivos: 4,
    cobrosPendientes: 8,
    cobrosVencidos: 0,
  },
  proyectos: [
    { id: '#P-001', nombre: 'Reforma terraza ático', cliente: 'J. Ortega Blanco', valor: 15600, margen: 49, estado: 'Activo' as const },
    { id: '#P-002', nombre: 'Diseño web portfolio', cliente: 'L. Méndez Fotografía', valor: 2800, margen: 100, estado: 'Completado' as const },
    { id: '#P-003', nombre: 'Reforma local comercial', cliente: 'A. Beltrán Caile SL', valor: 32000, margen: 52, estado: 'Activo' as const },
    { id: '#P-004', nombre: 'Diseño interior oficina', cliente: 'Estudio Arq. Vega', valor: 24000, margen: 55, estado: 'Activo' as const },
  ],
  barChart: [
    { mes: 'Nov', ingresos: 11500, gastos: 4050 },
    { mes: 'Dic', ingresos: 8200,  gastos: 2100 },
    { mes: 'Ene', ingresos: 9800,  gastos: 3200 },
    { mes: 'Feb', ingresos: 13400, gastos: 5100 },
    { mes: 'Mar', ingresos: 12000, gastos: 4800 },
    { mes: 'Abr', ingresos: 15000, gastos: 6320 },
  ],
  donutChart: [
    { name: 'Material',        value: 39990, color: '#3b82f6' },
    { name: 'Mano de obra',    value: 12000, color: '#8b5cf6' },
    { name: 'Herramientas',    value: 9090,  color: '#10b981' },
    { name: 'Transporte',      value: 600,   color: '#f59e0b' },
    { name: 'Suministros',     value: 600,   color: '#6b7280' },
  ],
  ocr: {
    proveedor: 'Leroy Merlin',
    nif: 'A28543397',
    descripcion: 'Cemento, ladrillos, yeso, pintura',
    baseImponible: 204.13,
    iva: 42.87,
    total: 247.00,
    fecha: '05/04/2026',
    proyecto: 'Reforma terraza ático',
  },
  fiscal: {
    trimestre: 'T2 2026 (Abr–Jun)',
    ivaPagar: 9783,
    irpf: 12460,
    totalReservar: 22243,
    ingresosDec: 70800,
    gastosDec: 8500,
    beneficioNeto: 62300,
  },
  facturas: [
    { id: '#F-019', proyecto: 'Rehabilitación fachada', importe: 15000, estado: 'Pendiente' as const },
    { id: '#F-014', proyecto: 'Reforma local comercial', importe: 6400,  estado: 'Pendiente' as const },
    { id: '#F-023', proyecto: 'Reforma terraza ático',   importe: 5200,  estado: 'Pendiente' as const },
  ],
} as const
```

- [ ] **Step 4: Commit**

```bash
git add remotion/constants/
git commit -m "feat(video): constantes de tema, timing y datos demo"
```

---

## Task 3: Componentes de animación base

**Files:**
- Create: `remotion/components/motion/GlowBackground.tsx`
- Create: `remotion/components/motion/TypewriterText.tsx`
- Create: `remotion/components/motion/KeywordPill.tsx`
- Create: `remotion/components/motion/CounterNumber.tsx`
- Create: `remotion/components/motion/ProgressBar.tsx`
- Create: `remotion/components/motion/AnimatedCursor.tsx`

- [ ] **Step 1: GlowBackground**

```tsx
// remotion/components/motion/GlowBackground.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS } from '../../constants/theme'

interface GlowBackgroundProps {
  glowColor?: string
  glowOpacity?: number
  showDotGrid?: boolean
  fadeInFrames?: number
}

export const GlowBackground = ({
  glowColor = COLORS.accent,
  glowOpacity = 0.12,
  showDotGrid = true,
  fadeInFrames = 30,
}: GlowBackgroundProps) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity }}>
      {showDotGrid && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${COLORS.textMuted}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      )}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 900,
        background: `radial-gradient(circle, ${glowColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: TypewriterText**

```tsx
// remotion/components/motion/TypewriterText.tsx
import { useCurrentFrame } from 'remotion'
import { CSSProperties } from 'react'

interface TypewriterTextProps {
  text: string
  startFrame: number
  charsPerFrame?: number
  style?: CSSProperties
  cursorChar?: string
  showCursor?: boolean
}

export const TypewriterText = ({
  text,
  startFrame,
  charsPerFrame = 1.5,
  style,
  cursorChar = '|',
  showCursor = true,
}: TypewriterTextProps) => {
  const frame = useCurrentFrame()
  const elapsed = Math.max(0, frame - startFrame)
  const charsToShow = Math.min(text.length, Math.floor(elapsed * charsPerFrame))
  const isComplete = charsToShow >= text.length
  const showingCursor = showCursor && !isComplete && elapsed >= 0

  return (
    <span style={style}>
      {text.slice(0, charsToShow)}
      {showingCursor && (
        <span style={{ opacity: Math.floor(elapsed / 8) % 2 === 0 ? 1 : 0 }}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 3: KeywordPill**

```tsx
// remotion/components/motion/KeywordPill.tsx
import { useCurrentFrame, interpolate, spring } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS } from '../../constants/theme'
import { CSSProperties, ReactNode } from 'react'

interface KeywordPillProps {
  children: ReactNode
  startFrame: number
  color?: 'blue' | 'green' | 'amber' | 'purple'
  style?: CSSProperties
}

const COLOR_MAP = {
  blue:   { border: COLORS.accent,  bg: COLORS.accentGlow,  text: '#93c5fd' },
  green:  { border: COLORS.green,   bg: COLORS.greenGlow,   text: '#6ee7b7' },
  amber:  { border: COLORS.amber,   bg: 'rgba(245,158,11,0.12)', text: '#fcd34d' },
  purple: { border: COLORS.purple,  bg: 'rgba(139,92,246,0.12)', text: '#c4b5fd' },
}

export const KeywordPill = ({
  children,
  startFrame,
  color = 'blue',
  style,
}: KeywordPillProps) => {
  const frame = useCurrentFrame()
  const { border, bg, text } = COLOR_MAP[color]

  const scale = spring({ frame, fps: FPS, from: 0.7, to: 1, delay: startFrame, config: { damping: 14, stiffness: 180 } })
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <span style={{
      display: 'inline-block',
      border: `1.5px solid ${border}`,
      background: bg,
      color: text,
      borderRadius: 6,
      padding: '2px 10px',
      transform: `scale(${scale})`,
      opacity,
      ...style,
    }}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: CounterNumber**

```tsx
// remotion/components/motion/CounterNumber.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS } from '../../constants/theme'
import { CSSProperties } from 'react'

interface CounterNumberProps {
  targetValue: number
  startFrame: number
  durationFrames?: number
  currency?: boolean
  suffix?: string
  style?: CSSProperties
}

export const CounterNumber = ({
  targetValue,
  startFrame,
  durationFrames = 60,
  currency = true,
  suffix = '',
  style,
}: CounterNumberProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, targetValue],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }
  )

  const formatted = currency
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round(progress))
    : Math.round(progress).toString()

  return (
    <span style={{ fontFamily: FONTS.mono, color: COLORS.textPrimary, ...style }}>
      {formatted}{suffix}
    </span>
  )
}
```

- [ ] **Step 5: ProgressBar**

```tsx
// remotion/components/motion/ProgressBar.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS } from '../../constants/theme'

interface ProgressBarProps {
  startFrame: number
  durationFrames: number
  label?: string
  color?: string
}

export const ProgressBar = ({
  startFrame,
  durationFrames,
  label = 'Analizando con IA…',
  color = COLORS.accent,
}: ProgressBarProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{ opacity, width: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary }}>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: color }}>{Math.round(progress)}%</span>
      </div>
      <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: 3,
          boxShadow: `0 0 12px ${color}66`,
          transition: 'width 0s',
        }} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: AnimatedCursor**

```tsx
// remotion/components/motion/AnimatedCursor.tsx
import { useCurrentFrame, interpolate } from 'remotion'

interface Point { x: number; y: number }

interface AnimatedCursorProps {
  from: Point
  to: Point
  moveStartFrame: number
  moveDurationFrames: number
  clickFrame?: number
}

export const AnimatedCursor = ({
  from, to, moveStartFrame, moveDurationFrames, clickFrame,
}: AnimatedCursorProps) => {
  const frame = useCurrentFrame()

  const x = interpolate(
    frame, [moveStartFrame, moveStartFrame + moveDurationFrames], [from.x, to.x],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
  )
  const y = interpolate(
    frame, [moveStartFrame, moveStartFrame + moveDurationFrames], [from.y, to.y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
  )
  const scale = clickFrame
    ? interpolate(frame, [clickFrame, clickFrame + 6, clickFrame + 12], [1, 0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${scale})`,
      pointerEvents: 'none', zIndex: 100,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 4L13 24L17 17L24 13L4 4Z" fill="white" stroke="#0a0f1a" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add remotion/components/motion/
git commit -m "feat(video): componentes de animación base (typewriter, pill, counter, progress, cursor)"
```

---

## Task 4: Componentes UI — Sidebar, AppFrame, KPICard

**Files:**
- Create: `remotion/components/ui/Sidebar.tsx`
- Create: `remotion/components/ui/AppFrame.tsx`
- Create: `remotion/components/ui/KPICard.tsx`

- [ ] **Step 1: Sidebar**

```tsx
// remotion/components/ui/Sidebar.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

interface SidebarItem {
  label: string
  active?: boolean
  icon: string
}

const ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: '⊞', active: false },
  { label: 'Proyectos', icon: '◫', active: false },
  { label: 'Facturas emitidas', icon: '≡', active: false },
  { label: 'Gastos / Compras', icon: '⊕', active: false },
  { label: 'Reportes', icon: '◈', active: false },
]

interface SidebarProps {
  activeItem?: string
}

export const Sidebar = ({ activeItem = 'Dashboard' }: SidebarProps) => (
  <div style={{
    width: 220, height: '100%',
    background: '#060c18',
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex', flexDirection: 'column',
    padding: '0 0 24px 0',
    flexShrink: 0,
  }}>
    {/* Workspace */}
    <div style={{
      padding: '20px 16px',
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32,
        background: `linear-gradient(135deg, ${COLORS.accent}, #2563eb)`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: 'white', fontWeight: FONT_WEIGHTS.bold,
        fontFamily: FONTS.display,
      }}>P</div>
      <span style={{ fontFamily: FONTS.display, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, fontSize: 15 }}>
        Estudio Martín
      </span>
    </div>
    {/* Nav items */}
    <div style={{ padding: '12px 8px', flex: 1 }}>
      {ITEMS.map(({ label, icon, active: defaultActive }) => {
        const isActive = label === activeItem
        return (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, marginBottom: 2,
            background: isActive ? `${COLORS.accent}18` : 'transparent',
            color: isActive ? COLORS.accent : COLORS.textSecondary,
            fontFamily: FONTS.body, fontSize: 14,
            fontWeight: isActive ? FONT_WEIGHTS.medium : FONT_WEIGHTS.regular,
          }}>
            <span style={{ fontSize: 16, opacity: 0.8 }}>{icon}</span>
            {label}
          </div>
        )
      })}
    </div>
    {/* User */}
    <div style={{
      padding: '12px 16px',
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: `linear-gradient(135deg, #374151, #1f2937)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.body,
      }}>DM</div>
      <div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textPrimary, fontWeight: FONT_WEIGHTS.medium }}>Daniel Martín</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textMuted }}>Estudio Martín</div>
      </div>
    </div>
  </div>
)
```

- [ ] **Step 2: AppFrame**

```tsx
// remotion/components/ui/AppFrame.tsx
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS } from '../../constants/theme'
import { ReactNode } from 'react'

interface AppFrameProps {
  children: ReactNode
  startFrame?: number
  width?: number
  height?: number
}

export const AppFrame = ({ children, startFrame = 0, width = 1600, height = 900 }: AppFrameProps) => {
  const frame = useCurrentFrame()

  const scale = spring({ frame, fps: FPS, from: 0.93, to: 1, delay: startFrame, config: { damping: 22, stiffness: 160 } })
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: 'clamp' })
  const glowOpacity = interpolate(frame, [startFrame, startFrame + 40], [0, 0.6], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      width, height,
      borderRadius: 16,
      overflow: 'hidden',
      transform: `scale(${scale})`,
      opacity,
      boxShadow: `0 0 80px rgba(59,130,246,${glowOpacity * 0.4}), 0 40px 80px rgba(0,0,0,0.6)`,
      border: `1px solid ${COLORS.accentBorder}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Chrome bar */}
      <div style={{
        height: 38,
        background: '#060c18',
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 14px', gap: 8, flexShrink: 0,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
        <div style={{
          flex: 1, marginLeft: 12, height: 22,
          background: COLORS.bgCard, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: '"Inter", sans-serif' }}>
            project-track-ruby.vercel.app
          </span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: KPICard**

```tsx
// remotion/components/ui/KPICard.tsx
import { useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { CounterNumber } from '../motion/CounterNumber'

interface KPICardProps {
  label: string
  value: number
  description?: string
  color?: string
  currency?: boolean
  startFrame?: number
  delayFrames?: number
}

export const KPICard = ({
  label, value, description, color = COLORS.green,
  currency = true, startFrame = 0, delayFrames = 0,
}: KPICardProps) => {
  const frame = useCurrentFrame()
  const delay = startFrame + delayFrames

  const translateY = spring({ frame, fps: FPS, from: 30, to: 0, delay, config: { damping: 20, stiffness: 160 } })
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      transform: `translateY(${translateY}px)`,
      opacity,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted,
        fontWeight: FONT_WEIGHTS.medium, textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: FONT_WEIGHTS.extrabold, color }}>
        <CounterNumber
          targetValue={value}
          startFrame={delay + 10}
          durationFrames={50}
          currency={currency}
          style={{ fontSize: 28, color }}
        />
      </div>
      {description && (
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted }}>{description}</div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add remotion/components/ui/Sidebar.tsx remotion/components/ui/AppFrame.tsx remotion/components/ui/KPICard.tsx
git commit -m "feat(video): componentes UI Sidebar, AppFrame y KPICard"
```

---

## Task 5: Gráficos animados para el Dashboard

**Files:**
- Create: `remotion/components/charts/AnimatedBarChart.tsx`
- Create: `remotion/components/charts/AnimatedDonutChart.tsx`
- Create: `remotion/components/charts/AnimatedGauge.tsx`

- [ ] **Step 1: AnimatedBarChart**

```tsx
// remotion/components/charts/AnimatedBarChart.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
```

- [ ] **Step 2: AnimatedDonutChart**

```tsx
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
```

- [ ] **Step 3: AnimatedGauge**

```tsx
// remotion/components/charts/AnimatedGauge.tsx
import { useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

interface AnimatedGaugeProps {
  value: number
  maxValue: number
  startFrame: number
  durationFrames?: number
  label?: string
  color?: string
}

export const AnimatedGauge = ({
  value, maxValue, startFrame, durationFrames = 70,
  label = 'Total a reservar', color = COLORS.accent,
}: AnimatedGaugeProps) => {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame, [startFrame, startFrame + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2) }
  )
  const currentValue = Math.round(value * progress)
  const angle = progress * 180 // 0° a 180° (semicírculo)

  const cx = 90, cy = 90, r = 70
  const startRad = Math.PI
  const endRad = Math.PI - (angle * Math.PI) / 180
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = angle > 180 ? 1 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={180} height={100} viewBox="0 0 180 100">
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={COLORS.border} strokeWidth={12} fill="none" strokeLinecap="round" />
        {progress > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            stroke={color} strokeWidth={12} fill="none" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
        )}
      </svg>
      <div style={{ textAlign: 'center', marginTop: -24 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary }}>
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(currentValue)}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted }}>{label}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add remotion/components/charts/
git commit -m "feat(video): gráficos animados (barras, donut, gauge)"
```

---

## Task 6: DashboardUI completo

**Files:**
- Create: `remotion/components/ui/DashboardUI.tsx`

- [ ] **Step 1: Crear DashboardUI**

```tsx
// remotion/components/ui/DashboardUI.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { Sidebar } from './Sidebar'
import { KPICard } from './KPICard'
import { AnimatedBarChart } from '../charts/AnimatedBarChart'
import { AnimatedDonutChart } from '../charts/AnimatedDonutChart'
import { AnimatedGauge } from '../charts/AnimatedGauge'
import { DEMO_DATA } from '../../constants/data'

interface DashboardUIProps {
  startFrame?: number
}

export const DashboardUI = ({ startFrame = 0 }: DashboardUIProps) => {
  const { kpis, fiscal } = DEMO_DATA

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLORS.bg }}>
      <Sidebar activeItem="Dashboard" />
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted, margin: '4px 0 0' }}>
              Resumen financiero — Estudio Martín
            </p>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <KPICard label="Ingresos del mes" value={kpis.ingresos} description="Facturas cobradas" color={COLORS.green} startFrame={startFrame} delayFrames={0} />
          <KPICard label="Gastos del mes" value={kpis.gastos} description="Sin asignar a proyectos" color={COLORS.red} startFrame={startFrame} delayFrames={15} />
          <KPICard label="Beneficio neto" value={kpis.beneficioNeto} description="Ingresos sin gastos" color={COLORS.green} startFrame={startFrame} delayFrames={30} />
          <KPICard label="Proyectos activos" value={kpis.proyectosActivos} description="En curso" color={COLORS.accent} currency={false} startFrame={startFrame} delayFrames={45} />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {/* Bar chart */}
          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4 }}>
              Ingresos vs Gastos
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 16 }}>Últimos 6 meses</div>
            <div style={{ height: 180 }}>
              <AnimatedBarChart startFrame={startFrame + 60} durationFrames={90} />
            </div>
          </div>

          {/* Donut + Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4 }}>
                Gastos por categoría
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatedDonutChart startFrame={startFrame + 80} durationFrames={80} />
              </div>
            </div>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary, marginBottom: 4, alignSelf: 'flex-start' }}>
                Reserva fiscal
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 8, alignSelf: 'flex-start' }}>T2 2026</div>
              <AnimatedGauge
                value={fiscal.totalReservar}
                maxValue={fiscal.ingresosDec}
                startFrame={startFrame + 100}
                durationFrames={70}
                label="Total a reservar"
                color={COLORS.accent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/components/ui/DashboardUI.tsx
git commit -m "feat(video): DashboardUI completo con KPIs y gráficos animados"
```

---

## Task 7: OCR Form UI — TicketImage, ClaudeAIBadge, OCRFormUI

**Files:**
- Create: `remotion/components/ui/TicketImage.tsx`
- Create: `remotion/components/ui/ClaudeAIBadge.tsx`
- Create: `remotion/components/ui/OCRFormUI.tsx`

- [ ] **Step 1: TicketImage — factura ficticia SVG**

```tsx
// remotion/components/ui/TicketImage.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

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
```

- [ ] **Step 2: ClaudeAIBadge**

```tsx
// remotion/components/ui/ClaudeAIBadge.tsx
import { useCurrentFrame, spring } from 'remotion'
import { FPS } from '../../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'

export const ClaudeAIBadge = ({ startFrame }: { startFrame: number }) => {
  const frame = useCurrentFrame()
  const scale = spring({ frame, fps: FPS, from: 0, to: 1, delay: startFrame, config: { damping: 12, stiffness: 200 } })

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
      border: '1px solid rgba(139,92,246,0.4)',
      borderRadius: 20, padding: '6px 14px',
      transform: `scale(${scale})`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: 'white', fontWeight: FONT_WEIGHTS.bold,
      }}>✦</div>
      <span style={{ fontFamily: FONTS.body, fontSize: 13, color: '#c4b5fd', fontWeight: FONT_WEIGHTS.medium }}>
        Powered by Claude AI
      </span>
    </div>
  )
}
```

- [ ] **Step 3: OCRFormUI**

```tsx
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

// Frames relativos al inicio de la escena OCR (frame 750 absoluto)
// Los startFrame aquí son relativos — se suman en la escena
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

  const fieldFlash = (showFrom: number) =>
    interpolate(frame, [showFrom, showFrom + 8, showFrom + 20], [0, 1, 0], { extrapolateRight: 'clamp' })

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
```

- [ ] **Step 4: Commit**

```bash
git add remotion/components/ui/TicketImage.tsx remotion/components/ui/ClaudeAIBadge.tsx remotion/components/ui/OCRFormUI.tsx
git commit -m "feat(video): OCRFormUI con ticket animado, progreso IA y campos autorellenados"
```

---

## Task 8: Escenas 1, 2 y 3

**Files:**
- Create: `remotion/scenes/Scene01Hook.tsx`
- Create: `remotion/scenes/Scene02Problem.tsx`
- Create: `remotion/scenes/Scene03Twist.tsx`
- Create: `remotion/components/ui/ExcelTableMock.tsx`

- [ ] **Step 1: ExcelTableMock**

```tsx
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
```

- [ ] **Step 2: Scene01Hook**

```tsx
// remotion/scenes/Scene01Hook.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { SCENES } from '../constants/timing'
import { GlowBackground } from '../components/motion/GlowBackground'
import { TypewriterText } from '../components/motion/TypewriterText'
import { KeywordPill } from '../components/motion/KeywordPill'

export const Scene01Hook = () => {
  const frame = useCurrentFrame()
  // Frames relativos a esta escena (empieza en frame 0 aquí)
  const q1Start = 20
  const q2Start = 80
  const q3Start = 145

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={20} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32,
        padding: '0 200px',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Pregunta 1 */}
          <div style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary, lineHeight: 1.2 }}>
            <TypewriterText text="¿Cuánto has ganado en este proyecto?" startFrame={q1Start} charsPerFrame={2} />
          </div>
          {/* Pregunta 2 con pill */}
          {frame >= q2Start - 5 && (
            <div style={{ fontFamily: FONTS.display, fontSize: 44, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textSecondary, lineHeight: 1.2 }}>
              <TypewriterText text="¿Cuánto " startFrame={q2Start} charsPerFrame={2.5} />
              <KeywordPill startFrame={q2Start + 28} color="blue">queda por cobrar</KeywordPill>
              <TypewriterText text="?" startFrame={q2Start + 80} charsPerFrame={3} />
            </div>
          )}
          {/* Pregunta 3 */}
          {frame >= q3Start - 5 && (
            <div style={{ fontFamily: FONTS.display, fontSize: 44, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textMuted, lineHeight: 1.2 }}>
              <TypewriterText text="¿Cuánto te " startFrame={q3Start} charsPerFrame={2.5} />
              <KeywordPill startFrame={q3Start + 36} color="amber">costó</KeywordPill>
              <TypewriterText text="?" startFrame={q3Start + 70} charsPerFrame={3} />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 3: Scene02Problem**

```tsx
// remotion/scenes/Scene02Problem.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { TypewriterText } from '../components/motion/TypewriterText'
import { ExcelTableMock } from '../components/ui/ExcelTableMock'

export const Scene02Problem = () => {
  const frame = useCurrentFrame()

  const tableOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const text1Opacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' })
  const text2Opacity = interpolate(frame, [250, 265], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor="#374151" glowOpacity={0.08} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 120px', gap: 48,
      }}>
        <div style={{ opacity: tableOpacity, width: '100%', maxWidth: 800 }}>
          <ExcelTableMock startFrame={10} />
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ opacity: text1Opacity, fontFamily: FONTS.display, fontSize: 40, fontWeight: FONT_WEIGHTS.bold, color: '#d4c5a9' }}>
            "Fin de trimestre."
          </div>
          <div style={{ opacity: text2Opacity, fontFamily: FONTS.body, fontSize: 28, color: COLORS.textSecondary }}>
            Y nunca tienes el control real de tu negocio.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 4: Scene03Twist**

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add remotion/scenes/Scene01Hook.tsx remotion/scenes/Scene02Problem.tsx remotion/scenes/Scene03Twist.tsx remotion/components/ui/ExcelTableMock.tsx
git commit -m "feat(video): escenas Hook, Problema y Giro"
```

---

## Task 9: Escena 4 — OCR (la más importante)

**Files:**
- Create: `remotion/scenes/Scene04OCR.tsx`

- [ ] **Step 1: Crear Scene04OCR**

```tsx
// remotion/scenes/Scene04OCR.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { AppFrame } from '../components/ui/AppFrame'
import { OCRFormUI } from '../components/ui/OCRFormUI'
import { KeywordPill } from '../components/motion/KeywordPill'
import { SCENES } from '../constants/timing'

export const Scene04OCR = () => {
  const frame = useCurrentFrame()

  // AppFrame materializa en los primeros 30 frames
  const appOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })

  // Texto overlay aparece tarde
  const overlayOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={20} glowColor={COLORS.green} glowOpacity={0.08} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        padding: '40px 60px',
      }}>
        {/* Texto superior */}
        <div style={{ opacity: overlayOpacity, textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textPrimary }}>
            Sube la foto.{' '}
          </span>
          <KeywordPill startFrame={30} color="green">
            <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold }}>
              La IA hace el resto.
            </span>
          </KeywordPill>
        </div>

        {/* App Frame con el formulario OCR */}
        <div style={{ opacity: appOpacity, width: '100%' }}>
          <AppFrame startFrame={0} width={1500} height={820}>
            {/* OCRFormUI recibe el frame absoluto de inicio de la escena */}
            <OCRFormUI startFrame={SCENES.ocr.start} />
          </AppFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Verificar en Remotion Studio**

```bash
pnpm video:preview
```

Navegar a la escena 4 (frame 750–1140) y verificar que el ticket cae, la barra de progreso se anima y los campos se rellenan uno a uno. Si algo no se ve, ajustar los offsets en `OCRFormUI`.

- [ ] **Step 3: Commit**

```bash
git add remotion/scenes/Scene04OCR.tsx
git commit -m "feat(video): Scene04OCR — formulario OCR con animaciones campo a campo"
```

---

## Task 10: Escena 5 — Dashboard

**Files:**
- Create: `remotion/scenes/Scene05Dashboard.tsx`

- [ ] **Step 1: Crear Scene05Dashboard**

```tsx
// remotion/scenes/Scene05Dashboard.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { AppFrame } from '../components/ui/AppFrame'
import { DashboardUI } from '../components/ui/DashboardUI'
import { KeywordPill } from '../components/motion/KeywordPill'
import { SCENES } from '../constants/timing'

export const Scene05Dashboard = () => {
  const frame = useCurrentFrame()

  const overlayOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      <GlowBackground fadeInFrames={15} glowColor={COLORS.accent} glowOpacity={0.1} />
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        padding: '40px 60px',
      }}>
        <div style={{ opacity: overlayOpacity, textAlign: 'center', marginBottom: 4 }}>
          <KeywordPill startFrame={20} color="blue">
            <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: FONT_WEIGHTS.bold }}>
              Tu negocio. De un vistazo.
            </span>
          </KeywordPill>
        </div>
        <AppFrame startFrame={0} width={1500} height={820}>
          <DashboardUI startFrame={SCENES.dashboard.start} />
        </AppFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add remotion/scenes/Scene05Dashboard.tsx
git commit -m "feat(video): Scene05Dashboard — dashboard completo con contadores y gráficos animados"
```

---

## Task 11: Escenas 6, 7 y 8

**Files:**
- Create: `remotion/components/ui/ReportsUI.tsx`
- Create: `remotion/scenes/Scene06Export.tsx`
- Create: `remotion/scenes/Scene07Pricing.tsx`
- Create: `remotion/scenes/Scene08CTA.tsx`

- [ ] **Step 1: ReportsUI**

```tsx
// remotion/components/ui/ReportsUI.tsx
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/theme'
import { Sidebar } from './Sidebar'
import { DEMO_DATA } from '../../constants/data'

export const ReportsUI = () => {
  const { fiscal, facturas } = DEMO_DATA
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLORS.bg }}>
      <Sidebar activeItem="Reportes" />
      <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, margin: 0 }}>
              Reportes trimestrales
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted, margin: '4px 0 0' }}>
              Resumen informativo para preparar la declaración trimestral
            </p>
          </div>
          {/* Exportar CSV button */}
          <div id="export-btn" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: COLORS.accent, color: 'white',
            border: 'none', borderRadius: 8, padding: '10px 18px',
            fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold,
            cursor: 'pointer',
          }}>
            ↓ Exportar CSV
          </div>
        </div>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total ingresos declarados', value: `${fiscal.ingresosDec.toLocaleString('es-ES')}€`, color: COLORS.green },
            { label: 'Total gastos declarados', value: `${fiscal.gastosDec.toLocaleString('es-ES')}€`, color: COLORS.red },
            { label: 'Beneficio neto', value: `${fiscal.beneficioNeto.toLocaleString('es-ES')}€`, color: COLORS.accent },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: FONT_WEIGHTS.bold, color }}>{value}</div>
            </div>
          ))}
        </div>
        {/* Tabla de ingresos */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: 'hidden', flex: 1 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONTS.body, fontSize: 14, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.textPrimary }}>
            Ingresos registrados
          </div>
          {facturas.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`, gap: 16 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted, width: 60 }}>{f.id}</span>
              <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textPrimary, flex: 1 }}>{f.proyecto}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.green, fontWeight: FONT_WEIGHTS.semibold }}>{f.importe.toLocaleString('es-ES')}€</span>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: FONT_WEIGHTS.medium,
                background: f.estado === 'Pendiente' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                color: f.estado === 'Pendiente' ? COLORS.amber : COLORS.green,
              }}>{f.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Scene06Export**

```tsx
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
```

- [ ] **Step 3: Scene07Pricing**

```tsx
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
```

- [ ] **Step 4: Scene08CTA**

```tsx
// remotion/scenes/Scene08CTA.tsx
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from 'remotion'
import { FPS } from '../constants/timing'
import { COLORS, FONTS, FONT_WEIGHTS } from '../constants/theme'
import { GlowBackground } from '../components/motion/GlowBackground'
import { TypewriterText } from '../components/motion/TypewriterText'

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
        <div style={{ transform: `scale(${logoScale})`, opacity: logoOpacity, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 72, height: 72,
            background: `linear-gradient(135deg, ${COLORS.accent}, #2563eb)`,
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: 'white', fontWeight: FONT_WEIGHTS.extrabold,
            boxShadow: `0 0 40px rgba(59,130,246,0.4)`,
            fontFamily: FONTS.display,
          }}>P</div>
          <span style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary }}>
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
```

- [ ] **Step 5: Commit**

```bash
git add remotion/components/ui/ReportsUI.tsx remotion/scenes/Scene06Export.tsx remotion/scenes/Scene07Pricing.tsx remotion/scenes/Scene08CTA.tsx
git commit -m "feat(video): escenas Export, Pricing y CTA final"
```

---

## Task 12: Composición principal MainVideo

**Files:**
- Modify: `remotion/compositions/MainVideo.tsx`

- [ ] **Step 1: Ensamblar MainVideo con todas las escenas**

```tsx
// remotion/compositions/MainVideo.tsx
import { AbsoluteFill, Sequence } from 'remotion'
import { SCENES, TRANSITION_FRAMES } from '../constants/timing'
import { Scene01Hook }      from '../scenes/Scene01Hook'
import { Scene02Problem }   from '../scenes/Scene02Problem'
import { Scene03Twist }     from '../scenes/Scene03Twist'
import { Scene04OCR }       from '../scenes/Scene04OCR'
import { Scene05Dashboard } from '../scenes/Scene05Dashboard'
import { Scene06Export }    from '../scenes/Scene06Export'
import { Scene07Pricing }   from '../scenes/Scene07Pricing'
import { Scene08CTA }       from '../scenes/Scene08CTA'

// Helper: duración de una escena
const dur = (scene: keyof typeof SCENES) =>
  SCENES[scene].end - SCENES[scene].start + TRANSITION_FRAMES

export const MainVideo = () => (
  <AbsoluteFill style={{ background: '#0a0f1a' }}>
    <Sequence from={SCENES.hook.start}      durationInFrames={dur('hook')}>
      <Scene01Hook />
    </Sequence>
    <Sequence from={SCENES.problem.start}   durationInFrames={dur('problem')}>
      <Scene02Problem />
    </Sequence>
    <Sequence from={SCENES.twist.start}     durationInFrames={dur('twist')}>
      <Scene03Twist />
    </Sequence>
    <Sequence from={SCENES.ocr.start}       durationInFrames={dur('ocr')}>
      <Scene04OCR />
    </Sequence>
    <Sequence from={SCENES.dashboard.start} durationInFrames={dur('dashboard')}>
      <Scene05Dashboard />
    </Sequence>
    <Sequence from={SCENES.export.start}    durationInFrames={dur('export')}>
      <Scene06Export />
    </Sequence>
    <Sequence from={SCENES.pricing.start}   durationInFrames={dur('pricing')}>
      <Scene07Pricing />
    </Sequence>
    <Sequence from={SCENES.cta.start}       durationInFrames={dur('cta')}>
      <Scene08CTA />
    </Sequence>
  </AbsoluteFill>
)
```

- [ ] **Step 2: Revisar composición completa en Remotion Studio**

```bash
pnpm video:preview
```

Ver el video completo de principio a fin. Ajustar cualquier timing que se vea forzado. El video debe fluir de forma natural sin cortes bruscos.

- [ ] **Step 3: Commit**

```bash
git add remotion/compositions/MainVideo.tsx
git commit -m "feat(video): composición MainVideo completa — 75s en 8 escenas"
```

---

## Task 13: Cargar fuentes de Google Fonts

**Files:**
- Create: `remotion/hooks/useFonts.ts`
- Modify: `remotion/compositions/MainVideo.tsx`

- [ ] **Step 1: Hook de fuentes**

```ts
// remotion/hooks/useFonts.ts
import { useEffect } from 'react'

const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
]

export const useFonts = () => {
  useEffect(() => {
    FONT_URLS.forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      document.head.appendChild(link)
    })
  }, [])
}
```

- [ ] **Step 2: Usar hook en MainVideo**

Añadir al inicio de `MainVideo`:
```tsx
import { useFonts } from '../hooks/useFonts'

export const MainVideo = () => {
  useFonts()
  return ( /* ... resto igual ... */ )
}
```

- [ ] **Step 3: Commit**

```bash
git add remotion/hooks/useFonts.ts remotion/compositions/MainVideo.tsx
git commit -m "feat(video): cargar Plus Jakarta Sans, Inter y JetBrains Mono desde Google Fonts"
```

---

## Task 14: Render final y verificación

**Files:**
- No new files — solo ejecutar el render

- [ ] **Step 1: Render del video**

```bash
pnpm video:render
```

Esperado: `public/projecttrack-promo-v3.mp4` generado. El proceso tarda varios minutos.

- [ ] **Step 2: Verificar el video**

Abrir `public/projecttrack-promo-v3.mp4` con VLC o el navegador. Verificar:
- [ ] Duración: ~75 segundos
- [ ] Resolución: 1920×1080
- [ ] Scene 1: Las 3 preguntas se escriben solas
- [ ] Scene 3: "Hay otra forma." con gradient text
- [ ] Scene 4: Ticket cae, progreso IA, campos se rellenan, badge Claude AI
- [ ] Scene 5: KPI counters animan, barras crecen, donut se dibuja
- [ ] Scene 8: URL se escribe, fade a negro

- [ ] **Step 3: Commit final**

```bash
git add public/projecttrack-promo-v3.mp4
git commit -m "feat(video): video promocional v3 renderizado — 75s 1920x1080 React/Remotion"
```

---

## Self-Review

**Spec coverage:**
- ✅ Setup Remotion → Task 1
- ✅ Constantes (theme, timing, data) → Task 2
- ✅ Componentes motion base (typewriter, pill, counter, progress, cursor) → Task 3
- ✅ AppFrame, Sidebar, KPICard → Task 4
- ✅ Gráficos animados (barras, donut, gauge) → Task 5
- ✅ DashboardUI completo → Task 6
- ✅ OCRFormUI (ticket, badge, campos auto) → Task 7
- ✅ Escenas 1, 2, 3 → Task 8
- ✅ Escena 4 OCR ★ → Task 9
- ✅ Escena 5 Dashboard → Task 10
- ✅ Escenas 6, 7, 8 → Task 11
- ✅ MainVideo composición → Task 12
- ✅ Fuentes Google Fonts → Task 13
- ✅ Render final → Task 14
- ✅ Privacidad (email no expuesto, datos ficticios) → data.ts
- ✅ Estilo Luma (typewriter, keyword pills, glow backgrounds) → componentes motion

**Tipos consistentes:**
- `startFrame` es siempre el frame absoluto en las escenas, frame relativo en componentes de motion — consistente en todos los usos
- `SCENES.ocr.start` = 750 se pasa a `OCRFormUI` correctamente
- `CounterNumber`, `TypewriterText`, `KeywordPill` — firmas de props consistentes en todos los usos
