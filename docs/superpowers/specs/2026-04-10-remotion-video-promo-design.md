# Spec — Video Promocional ProjectTrack con Remotion

**Fecha:** 2026-04-10  
**Estado:** Aprobado  
**Referencia visual:** Introducing Luma Agents (youtube.com/watch?v=rYehPO_MwMI)

---

## Concepto

Un video de producto de 75 segundos, 1920×1080, 30fps, construido 100% en React + Remotion. Sin capturas de pantalla — el UI del dashboard se recrea como componentes React animados, idénticos a la app real.

**Inspiración Luma Agents adaptada a SaaS:**
- Palabras clave de la app en pill boxes animadas: `[Proyectos]` `[Ingresos]` `[OCR]` `[Dashboard]`
- Texto que se escribe solo (typewriter) sincronizado con el guion
- UI del dashboard que materializa desde un fondo oscuro con glow azul
- Transiciones de impacto — cortes energéticos, no fundidos lentos

---

## Stack técnico

| Herramienta | Uso |
|---|---|
| `remotion` v4 | Framework de composición React → MP4 |
| `@remotion/renderer` | Renderizado headless en Node.js |
| `@remotion/media-utils` | Utilidades de audio/timing |
| `recharts` | Gráficos del dashboard (misma lib que la app real) |
| `react` + TypeScript | Componentes de UI |
| `spring()`, `interpolate()` | Animaciones fluidas de Remotion |
| Plus Jakarta Sans + Inter + JetBrains Mono | Google Fonts (las mismas que la app) |

---

## Estructura del proyecto

```
remotion/
├── index.ts                    # Entry point — registra composiciones
├── Root.tsx                    # Raíz con todas las composiciones
├── compositions/
│   ├── MainVideo.tsx           # Composición principal (75s)
│   └── Reel.tsx                # Versión Reel 9:16 (30s) — posterior
├── scenes/
│   ├── Scene01Hook.tsx         # 0:00–0:07 — Preguntas typewriter
│   ├── Scene02Problem.tsx      # 0:07–0:20 — Excel caótico
│   ├── Scene03Twist.tsx        # 0:20–0:25 — "Hay otra forma"
│   ├── Scene04OCR.tsx          # 0:25–0:38 — OCR en acción ★
│   ├── Scene05Dashboard.tsx    # 0:38–0:52 — Dashboard completo
│   ├── Scene06Export.tsx       # 0:52–1:00 — Exportar CSV
│   ├── Scene07Pricing.tsx      # 1:00–1:05 — Planes
│   └── Scene08CTA.tsx          # 1:05–1:15 — CTA final
├── components/
│   ├── ui/
│   │   ├── DashboardUI.tsx     # Dashboard recreado (KPIs + gráficos)
│   │   ├── ProjectsUI.tsx      # Vista de proyectos
│   │   ├── OCRFormUI.tsx       # Formulario nuevo gasto con OCR
│   │   ├── ReportsUI.tsx       # Reportes trimestrales
│   │   ├── ExcelTableMock.tsx  # Simulación de hoja Excel caótica (Escena 2)
│   │   ├── TicketImage.tsx     # Factura/ticket SVG ficticio (Leroy Merlin style)
│   │   ├── ClaudeAIBadge.tsx   # Badge "Powered by Claude AI"
│   │   ├── Sidebar.tsx         # Sidebar de la app
│   │   └── KPICard.tsx         # Tarjeta KPI con counter animado
│   ├── charts/
│   │   ├── BarChart.tsx        # Ingresos vs Gastos (Recharts animado)
│   │   ├── DonutChart.tsx      # Gastos por categoría
│   │   └── LineChart.tsx       # Beneficio mensual
│   ├── motion/
│   │   ├── TypewriterText.tsx  # Texto que se escribe solo
│   │   ├── KeywordPill.tsx     # Pill box al estilo Luma
│   │   ├── CounterNumber.tsx   # Número que cuenta hacia arriba
│   │   ├── AnimatedCursor.tsx  # Cursor que se mueve en pantalla
│   │   ├── ProgressBar.tsx     # Barra de progreso "Procesando IA"
│   │   └── GlowBackground.tsx  # Fondo oscuro con glow azul radial
│   └── layout/
│       ├── AppFrame.tsx        # Marco de la app (ventana de browser)
│       └── SplitScreen.tsx     # Split screen para escena de giro
├── constants/
│   ├── theme.ts                # Colores, tipografía, spacing
│   ├── timing.ts               # Definición de frames por escena
│   └── data.ts                 # Datos demo del dashboard
└── hooks/
    └── useAnimatedValue.ts     # Hook para animaciones spring
```

---

## Paleta de colores (exacta — igual que la app)

```ts
export const COLORS = {
  bg: '#0a0f1a',           // Fondo oscuro principal
  bgCard: '#111827',       // Fondo de tarjetas
  bgCardHover: '#1f2937',
  accent: '#3b82f6',       // Azul primario
  accentGlow: 'rgba(59,130,246,0.15)',  // Glow azul
  green: '#10b981',        // Ingresos / positivo
  greenGlow: 'rgba(16,185,129,0.2)',
  amber: '#f59e0b',        // Alertas / pendiente
  red: '#ef4444',          // Gastos negativos
  purple: '#8b5cf6',       // Accent secundario
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  border: '#1f2937',
  borderAccent: 'rgba(59,130,246,0.3)',
}
```

---

## Tipografía

```ts
export const FONTS = {
  display: 'Plus Jakarta Sans',   // Titulares — weight 700/800
  body: 'Inter',                  // Texto general — weight 400/600
  mono: 'JetBrains Mono',        // KPIs numéricos — weight 600
}
```

---

## Timing (frames a 30fps)

| Escena | Inicio | Fin | Frames | Segundos |
|---|---|---|---|---|
| Hook (preguntas) | 0 | 210 | 210 | 0–7s |
| Problema (Excel) | 210 | 600 | 390 | 7–20s |
| Giro ("Hay otra forma") | 600 | 750 | 150 | 20–25s |
| OCR en acción ★ | 750 | 1140 | 390 | 25–38s |
| Dashboard | 1140 | 1560 | 420 | 38–52s |
| Exportar CSV | 1560 | 1800 | 240 | 52–60s |
| Precio | 1800 | 1950 | 150 | 60–65s |
| CTA final | 1950 | 2250 | 300 | 65–75s |
| **TOTAL** | | | **2250** | **75s** |

Overlap de transición entre escenas: **15 frames** (0.5s) de fade cruzado.

---

## Escenas — Diseño detallado

### Escena 1: Hook (0–7s)
**Fondo:** `#0a0f1a` con dot grid estático y glow radial azul muy sutil al centro.

**Animación:**
1. `frame 0–30`: Fade in del fondo
2. `frame 30–80`: Primera pregunta en TypewriterText: `"¿Cuánto has ganado en este proyecto?"`
3. `frame 80–140`: Segunda pregunta con KeywordPill alrededor de "ganado": `"¿Cuánto [queda por cobrar]?"`
4. `frame 140–210`: Tercera pregunta: `"¿Cuánto te [costó]?"` — pausa de silencio

**Componentes:** `TypewriterText`, `KeywordPill`, `GlowBackground`

---

### Escena 2: Problema (7–20s)
**Visual:** Simulación de hoja de Excel caótica en React — tabla con filas desorganizadas, fórmulas `=SUMA()`, celdas con `#¡REF!`, valores que no cuadran.

**Animación:**
1. Filas de la tabla aparecen en stagger descendente (cada 8 frames)
2. Celdas `#¡REF!` parpadean en glitch loop (CSS animation keyframes)
3. `frame 450`: Texto "Fin de trimestre." aparece en fade muy lento — fuente light, blanco roto
4. `frame 520`: Texto "Y nunca tienes el control real." aparece debajo

**Componentes:** `ExcelTableMock`, `TypewriterText`

---

### Escena 3: El Giro (20–25s)
**Visual:** Split screen con spring animation. Izquierda: Excel que se "encoge" hacia la izquierda. Derecha: Dashboard de ProjectTrack que "entra" desde la derecha con glow.

**Centro:** Texto grande `"Hay otra forma."` — Plus Jakarta Sans 96px bold, shimmer effect dorado→azul.

**Animación:**
1. `spring({ frame, fps: 30, config: { damping: 20 } })` para el split
2. Glow radial del dashboard que crece desde el centro
3. Shimmer CSS animation sobre el texto

**Componentes:** `SplitScreen`, `DashboardUI` (preview), `GlowBackground`

---

### Escena 4: OCR en Acción ★ (25–38s)
**LA ESCENA MÁS IMPORTANTE.** Formulario "Nuevo gasto" recreado fielmente.

**Layout:**
- Izquierda (40%): Imagen de un ticket/factura (Leroy Merlin, estilo real) que "cae" al área de upload
- Derecha (60%): Formulario con campos vacíos que se van rellenando

**Animación frame a frame:**
1. `frame 750–800`: Upload zone visible con borde dashed animado
2. `frame 800–840`: Ticket image que cae con spring bounce al upload zone
3. `frame 840–900`: Progress bar "Analizando con IA…" — fill de 0 a 100%
4. `frame 900`: Badge "Powered by Claude AI" — pop-in con spring bounce
5. `frame 900–930`: Campo "Proveedor" → typewriter: `"Leroy Merlin"`
6. `frame 930–960`: Campo "NIF" → typewriter: `"A28543397"` + highlight verde flash
7. `frame 960–990`: Campo "Base imponible" → counter: `0 → 204.13€`
8. `frame 990–1020`: Campo "IVA (21%)" → counter: `0 → 42.87€`
9. `frame 1020–1050`: Campo "Total" → counter: `0 → 247.00€` + animación check verde
10. `frame 1050–1140`: "Asignar a proyectos" → `"Reforma terraza ático"` aparece

**Componentes:** `OCRFormUI`, `TypewriterText`, `CounterNumber`, `ProgressBar`, `TicketImage`, `ClaudeAIBadge`

---

### Escena 5: Dashboard (38–52s)
**Visual:** Dashboard financiero completo recreado. AppFrame (ventana de browser) que materializa con glow.

**Layout fiel a la app real:**
- Row KPIs: Ingresos / Gastos / Beneficio neto / Proyectos activos
- Gráfico barras: Ingresos vs Gastos (últimos 6 meses)
- Donut: Gastos por categoría
- Gauge: Reserva fiscal

**Animación:**
1. `frame 1140–1200`: AppFrame materializa (scale 0.95→1.0 + opacity 0→1 + glow azul)
2. `frame 1200–1260`: KPI cards entran en stagger (translateY 30→0, cada 15f)
3. `frame 1260–1350`: Counters de KPIs: `0 → 15.000€`, `0 → 6.320€`, `0 → 12.430€`
4. `frame 1350–1440`: Barras del gráfico crecen desde la base (spring stagger por barra)
5. `frame 1440–1500`: Donut se dibuja (stroke-dasharray de 0 a valor final)
6. `frame 1500–1560`: Gauge de reserva fiscal — aguja gira, número cuenta
7. Texto overlay: `"Tu negocio. De un vistazo."` — slide up + fade in

**Componentes:** `AppFrame`, `DashboardUI`, `KPICard`, `CounterNumber`, `BarChart`, `DonutChart`, `GaugeFiscal`

---

### Escena 6: Exportar CSV (52–60s)
**Visual:** Vista Reportes con tabla de ingresos/gastos. Cursor animado se mueve al botón.

**Animación:**
1. `frame 1560–1620`: ReportsUI entra con slide desde abajo
2. `frame 1620–1680`: `AnimatedCursor` se mueve desde centro al botón "Exportar CSV"
3. `frame 1680`: Click — botón hace micro-scale 0.95→1.0
4. `frame 1700–1760`: ProgressBar de descarga animada
5. `frame 1760`: Icono CSV hace pop-in con spring bounce
6. Texto: `"Exporta. Envía. Listo."` con KeywordPills

**Componentes:** `ReportsUI`, `AnimatedCursor`, `ProgressBar`

---

### Escena 7: Precio (60–65s)
**Visual:** Fondo oscuro con glow. Dos tarjetas de precio flotantes.

**Animación:**
1. Tarjeta Starter: slide-up desde abajo (spring)
2. Tarjeta PRO: slide-up con 10 frame delay
3. KeywordPill alrededor de "14,99€/mes"

---

### Escena 8: CTA Final (65–75s)
**Visual:** Logo centrado, URL que se escribe sola, tagline.

**Animación:**
1. Logo ProjectTrack — fade in + scale 0.9→1.0
2. `"projecttrack.app"` — TypewriterText completo
3. `"Sin tarjeta. Sin complicaciones."` — fade in lento
4. `frame 2220–2250`: Fade a negro total

---

## Componentes clave — Especificaciones

### `TypewriterText`
```tsx
// Escribe texto letra a letra sincronizado con frame de Remotion
// Props: text, startFrame, charsPerFrame (default: 1), style
const TypewriterText = ({ text, startFrame, charsPerFrame = 1 }) => {
  const frame = useCurrentFrame()
  const chars = Math.floor((frame - startFrame) * charsPerFrame)
  return <span>{text.slice(0, chars)}</span>
}
```

### `KeywordPill`
```tsx
// Palabra envuelta en pill box con borde animado (estilo Luma)
// Borde que "se dibuja" con stroke-dasharray animation
// Props: children, color ('blue' | 'green' | 'amber'), startFrame
```

### `CounterNumber`
```tsx
// Número que cuenta de 0 a targetValue con spring easing
// Formatea con Intl.NumberFormat para euros
// Props: targetValue, startFrame, duration, currency
```

### `AnimatedCursor`
```tsx
// SVG cursor que interpola entre posiciones
// interpolate() para x e y de origen a destino
// Click animation: scale 0.8 → 1.0 con spring
```

### `GlowBackground`
```tsx
// Fondo #0a0f1a con dot grid y radial gradient glow
// El glow puede ser azul (#3b82f6) o verde (#10b981)
// Intensidad animable vía prop
```

### `AppFrame`
```tsx
// Ventana de browser (chrome bar + body)
// Scale y opacity animados en la entrada
// Box shadow con glow azul animado
```

### `KPICard`
```tsx
// Tarjeta KPI fiel a la app real
// Props: label, value (counter animado), delta, icon, color
```

---

## Datos demo del dashboard (sin datos reales de clientes)

```ts
export const DEMO_DATA = {
  kpis: {
    ingresos: 15000,
    gastos: 6320,
    beneficio: 12430,
    proyectos: 4,
    cobros_pendientes: 8,
  },
  proyectos: [
    { nombre: 'Reforma terraza ático', cliente: 'J. Ortega', valor: 15600, margen: 49 },
    { nombre: 'Diseño web portfolio', cliente: 'L. Méndez', valor: 2800, margen: 100 },
    { nombre: 'Reforma local comercial', cliente: 'A. Beltrán', valor: 32000, margen: 52 },
    { nombre: 'Diseño interior oficina', cliente: 'Estudio Vega', valor: 24000, margen: 55 },
  ],
  ocr: {
    proveedor: 'Leroy Merlin',
    nif: 'A28543397',
    base: 204.13,
    iva: 42.87,
    total: 247.00,
    fecha: '05/04/2026',
    proyecto: 'Reforma terraza ático',
  },
  fiscal: {
    iva_repercutido: 11568,
    iva_soportado: 1785,
    iva_pagar: 9783,
    irpf_base: 62300,
    pago_fraccionado: 12460,
    total_reservar: 22243,
  }
}
```

---

## Output files

| Archivo | Formato | Uso |
|---|---|---|
| `public/projecttrack-promo-v3.mp4` | H.264 1920×1080 30fps | Landing page / YouTube |
| `public/projecttrack-promo-reel-v2.mp4` | H.264 1080×1920 30fps | Instagram / TikTok (posterior) |

---

## Consideraciones de privacidad

- El email `nelsonfernandez1002@gmail.com` NO aparece en ningún frame
- Todos los datos son ficticios (del objeto `DEMO_DATA`)
- Nombres de clientes son nombres inventados
- NIFs son ficticios pero con formato válido

---

## Instalación de Remotion

```bash
pnpm add remotion @remotion/cli @remotion/renderer
pnpm add @remotion/media-utils
```

Remotion corre en un puerto separado del Next.js. El script de renderizado se añade a `package.json`:

```json
{
  "scripts": {
    "video:preview": "remotion studio remotion/index.ts",
    "video:render": "remotion render remotion/index.ts MainVideo public/projecttrack-promo-v3.mp4"
  }
}
```

---

## Orden de implementación

1. Setup Remotion + estructura de carpetas
2. `theme.ts` + `timing.ts` + `data.ts` (constantes)
3. Componentes motion base: `TypewriterText`, `KeywordPill`, `CounterNumber`, `GlowBackground`
4. `Scene01Hook` — la más simple, valida que Remotion funciona
5. `OCRFormUI` + `Scene04OCR` — la escena más importante, primero
6. `DashboardUI` con charts + `Scene05Dashboard`
7. `Scene02Problem` (Excel mock)
8. `Scene03Twist` (split screen)
9. `Scene06Export`, `Scene07Pricing`, `Scene08CTA`
10. `MainVideo.tsx` — composición completa con transiciones
11. Render final + verificación
