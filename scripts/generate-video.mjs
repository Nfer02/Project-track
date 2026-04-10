/**
 * generate-video.mjs
 * Genera el video promocional de ProjectTrack automáticamente.
 *
 * Produce:
 *   public/projecttrack-promo-v2.mp4   — 16:9  1920x1080  ~75 seg
 *   public/projecttrack-promo-reel.mp4 — 9:16  1080x1920  ~30 seg
 *
 * Uso: node scripts/generate-video.mjs
 */

import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpegFluent from 'fluent-ffmpeg'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

const FFMPEG = ffmpegInstaller.path
ffmpegFluent.setFfmpegPath(FFMPEG)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root      = path.resolve(__dirname, '..')
const shots     = path.join(root, 'docs', 'screenshots')
const tmp       = path.join(root, 'docs', 'video-tmp')
const out       = path.join(root, 'public')
const font      = 'C\\:/Windows/Fonts/arialbd.ttf'   // ffmpeg usa forward+escaped colon

// ── colores de la paleta ──────────────────────────────────────────────────────
const COLOR_ACCENT  = '0x3B5BDB'   // azul pizarra
const COLOR_WHITE   = '0xFFFFFF'
const COLOR_DARK    = '0x0A0F1A@0.75'
const COLOR_GREEN   = '0x2F9E44'

// ── definición de escenas 16:9 ────────────────────────────────────────────────
// dur: duración en segundos de la escena (antes del overlap de transición)
// img: nombre del PNG en docs/screenshots
// zoom: dirección del Ken Burns  'in' | 'out' | 'none'
// lines: array de textos a mostrar (cada uno aparece 0.8s después del anterior)
//        format: { text, size, color, bold, y_offset, appear_at }
const SCENES_16_9 = [
  {
    dur: 5,
    img: '00-intro.png',
    zoom: 'in',
    lines: []
  },
  {
    dur: 7,
    img: '01-problema.png',
    zoom: 'none',
    lines: [
      { text: 'Cuanto has ganado en este proyecto?', size: 58, color: COLOR_WHITE, y_offset: 0, appear_at: 0.5 },
      { text: 'Nunca tienes el numero exacto.',      size: 52, color: '0xCCCCCC',  y_offset: 70, appear_at: 2.0 },
    ]
  },
  {
    dur: 7,
    img: '01-problema.png',
    zoom: 'out',
    lines: [
      { text: 'Proyectos en la cabeza. Gastos en Excel.', size: 56, color: COLOR_WHITE,  y_offset: 0,  appear_at: 0.5 },
      { text: 'Hay una forma mejor.',                     size: 72, color: COLOR_ACCENT, y_offset: 80, appear_at: 2.5 },
    ]
  },
  {
    dur: 8,
    img: '04-ocr-ia.png',
    zoom: 'in',
    lines: [
      { text: 'Sube la foto.',        size: 68, color: COLOR_WHITE,  y_offset: 0,  appear_at: 0.5 },
      { text: 'La IA hace el resto.', size: 68, color: COLOR_ACCENT, y_offset: 80, appear_at: 1.8 },
    ]
  },
  {
    dur: 7,
    img: 'detail-03-ocr.png',
    zoom: 'in',
    lines: [
      { text: 'Extrae NIF, IVA e importe automaticamente.', size: 54, color: COLOR_WHITE, y_offset: 0, appear_at: 0.8 },
    ]
  },
  {
    dur: 8,
    img: 'detail-04-dashboard.png',
    zoom: 'out',
    lines: [
      { text: 'Tu negocio. De un vistazo.',             size: 68, color: COLOR_WHITE, y_offset: 0,  appear_at: 0.5 },
      { text: 'Ingresos, gastos y margen por proyecto.', size: 50, color: COLOR_WHITE, y_offset: 80, appear_at: 2.0 },
    ]
  },
  {
    dur: 7,
    img: '03-ingresos-gastos.png',
    zoom: 'in',
    lines: [
      { text: 'Exporta. Envia. Listo.',              size: 68, color: COLOR_WHITE, y_offset: 0,  appear_at: 0.5 },
      { text: 'Tu gestor lo tiene todo organizado.', size: 50, color: COLOR_WHITE, y_offset: 80, appear_at: 2.0 },
    ]
  },
  {
    dur: 8,
    img: '05-dashboard.png',
    zoom: 'none',
    lines: [
      { text: 'Para profesionales que trabajan por proyectos.', size: 52, color: COLOR_WHITE, y_offset: -40, appear_at: 0.5 },
      { text: 'Starter — gratis  |  PRO — 14,99 EUR/mes.',     size: 52, color: COLOR_GREEN, y_offset: 40,  appear_at: 1.8 },
    ]
  },
  {
    dur: 10,
    img: '06-cierre-cta.png',
    zoom: 'in',
    lines: [
      { text: 'Empieza gratis hoy.',              size: 72, color: COLOR_WHITE,  y_offset: -40, appear_at: 0.5 },
      { text: 'project-track-ruby.vercel.app',    size: 52, color: COLOR_ACCENT, y_offset: 50,  appear_at: 1.8 },
      { text: 'Sin tarjeta. Sin complicaciones.', size: 44, color: '0xCCCCCC',   y_offset: 130, appear_at: 3.0 },
    ]
  },
]

// ── helpers ───────────────────────────────────────────────────────────────────

function zoompanFilter(direction, w, h, dur, fps = 25) {
  const frames = dur * fps
  const maxZoom = 1.12
  if (direction === 'in') {
    return `zoompan=z='min(zoom+${(maxZoom-1)/frames},${maxZoom})':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${w}x${h}:fps=${fps}`
  } else if (direction === 'out') {
    return `zoompan=z='if(eq(on\\,1)\\,${maxZoom}\\,max(1.001\\,zoom-${(maxZoom-1)/frames}))':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${w}x${h}:fps=${fps}`
  } else {
    return `zoompan=z='1.001':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${w}x${h}:fps=${fps}`
  }
}

function drawtextFilter(line, yBase, dur) {
  const { text, size, color, y_offset = 0, appear_at = 0 } = line
  const hexColor = color.replace('0x', '').replace('#', '')
  const safeText = text.replace(/'/g, "\\'").replace(/:/g, '\\:')
  const yPos = `(h-${yBase}+${y_offset})`
  const enable = `between(t\\,${appear_at}\\,${dur})`

  return [
    // sombra
    `drawtext=fontfile='${font}':text='${safeText}':fontsize=${size}:fontcolor=black@0.6:x=(w-text_w)/2+2:y=${yPos}+2:shadowx=0:shadowy=0:enable='${enable}'`,
    // texto principal
    `drawtext=fontfile='${font}':text='${safeText}':fontsize=${size}:fontcolor=${hexColor}:x=(w-text_w)/2:y=${yPos}:enable='${enable}'`
  ].join(',')
}

function ffmpegRun(args) {
  const cmd = `"${FFMPEG}" ${args}`
  execSync(cmd, { stdio: 'pipe' })
}

// ── generar segmentos individuales ────────────────────────────────────────────

async function buildSegment(scene, index, w, h, suffix = '') {
  const imgPath = path.join(shots, scene.img).replace(/\\/g, '/')
  const segPath = path.join(tmp, `seg_${String(index).padStart(2,'0')}${suffix}.mp4`).replace(/\\/g, '/')
  const fps     = 25
  const dur     = scene.dur

  // Construir filtro base: escalar + zoompan
  let vf = `scale=${w*2}:${h*2},${zoompanFilter(scene.zoom, w, h, dur, fps)}`

  // Añadir overlays de texto
  const yBase = 160
  for (const line of scene.lines) {
    vf += `,${drawtextFilter(line, yBase, dur)}`
  }

  // Fundido de entrada y salida
  vf += `,fade=t=in:st=0:d=0.5,fade=t=out:st=${dur - 0.5}:d=0.5`

  const args = [
    '-loop 1',
    `-i "${imgPath}"`,
    `-t ${dur}`,
    `-vf "${vf}"`,
    `-c:v libx264`,
    `-preset fast`,
    `-crf 20`,
    `-pix_fmt yuv420p`,
    `-r ${fps}`,
    `-an`,
    `-y`,
    `"${segPath}"`
  ].join(' ')

  ffmpegRun(args)
  return segPath
}

// ── concatenar segmentos via ffconcat ────────────────────────────────────────

async function concatSegments(segments, outputPath) {
  const concatFile = path.join(tmp, 'concat.txt')
  // Usar solo el nombre de archivo (rutas relativas al directorio del concat)
  const lines = segments.map(s => `file '${path.basename(s)}'`).join('\n')
  fs.writeFileSync(concatFile, lines)

  // ffconcat resuelve rutas relativas al directorio del archivo concat
  const args = [
    `-f concat -safe 0`,
    `-i "${concatFile.replace(/\\/g, '/')}"`,
    `-c:v libx264`,
    `-preset fast`,
    `-crf 20`,
    `-pix_fmt yuv420p`,
    `-r 25`,
    `-an`,
    `-y`,
    `"${outputPath}"`
  ].join(' ')

  ffmpegRun(args)
}

// ── generar audio silencioso placeholder ─────────────────────────────────────

function addSilentAudio(videoPath, outputPath, duration) {
  const args = [
    `-i "${videoPath}"`,
    `-f lavfi -i aevalsrc=0:c=stereo:s=44100`,
    `-t ${duration}`,
    `-shortest`,
    `-c:v copy`,
    `-c:a aac`,
    `-b:a 192k`,
    `-y`,
    `"${outputPath}"`
  ].join(' ')
  ffmpegRun(args)
}

// ── reencuadrar 16:9 → 9:16 ──────────────────────────────────────────────────

function cropToVertical(inputPath, outputPath) {
  // Para cada frame: recortar el centro 608x1080 y escalar a 1080x1920
  // Seleccionamos la zona central de interés de cada escena
  const args = [
    `-i "${inputPath}"`,
    `-vf "crop=608:1080:656:0,scale=1080:1920:flags=lanczos"`,
    `-c:v libx264`,
    `-preset fast`,
    `-crf 22`,
    `-pix_fmt yuv420p`,
    `-c:a copy`,
    `-y`,
    `"${outputPath}"`
  ].join(' ')
  ffmpegRun(args)
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n ProjectTrack — Generador de Video Promocional')
  console.log('═'.repeat(50))

  // Crear carpeta temporal
  fs.mkdirSync(tmp, { recursive: true })

  // 1. Generar segmentos 16:9
  console.log('\n[1/5] Generando segmentos de escenas (1920x1080)...')
  const segments = []
  for (let i = 0; i < SCENES_16_9.length; i++) {
    const scene = SCENES_16_9[i]
    process.stdout.write(`  Escena ${i+1}/${SCENES_16_9.length}: ${scene.img}...`)
    const seg = await buildSegment(scene, i, 1920, 1080)
    segments.push(seg)
    console.log(' ok')
  }

  // 2. Concatenar segmentos
  console.log('\n[2/5] Concatenando escenas...')
  const rawVideoPath = path.join(tmp, 'raw_16_9.mp4').replace(/\\/g, '/')
  await concatSegments(segments, rawVideoPath)
  console.log('  Concatenacion ok')

  // 3. Añadir audio silencioso
  console.log('\n[3/5] Añadiendo pista de audio (silencio placeholder)...')
  const totalDur = SCENES_16_9.reduce((sum, s) => sum + s.dur, 0)
  const promo16_9 = path.join(out, 'projecttrack-promo-v2.mp4').replace(/\\/g, '/')
  addSilentAudio(rawVideoPath, promo16_9, totalDur)
  console.log(`  Video 16:9 → public/projecttrack-promo-v2.mp4`)

  // 4. Generar versión vertical 9:16 (30 seg = primeras 3 escenas + ocr + dashboard + cierre)
  console.log('\n[4/5] Generando versión Reel 9:16 (30 seg)...')
  // Usar escenas comprimidas para el reel
  const SCENES_REEL = [
    { dur: 4,  img: '01-problema.png',      zoom: 'none',
      lines: [{ text: 'Cuanto ganas realmente por proyecto?', size: 60, color: COLOR_WHITE, y_offset: 0, appear_at: 0.3 }] },
    { dur: 6,  img: '04-ocr-ia.png',        zoom: 'in',
      lines: [{ text: 'La IA lee tus facturas sola.', size: 64, color: COLOR_WHITE, y_offset: 0, appear_at: 0.5 }] },
    { dur: 6,  img: 'detail-04-dashboard.png', zoom: 'out',
      lines: [{ text: 'Control total de tu negocio.', size: 64, color: COLOR_WHITE, y_offset: 0, appear_at: 0.5 }] },
    { dur: 6,  img: '05-dashboard.png',     zoom: 'in',
      lines: [
        { text: 'Starter — gratis.',  size: 60, color: COLOR_GREEN, y_offset: -40, appear_at: 0.5 },
        { text: 'PRO — 14,99€/mes.', size: 60, color: COLOR_WHITE, y_offset: 40,  appear_at: 1.5 },
      ]
    },
    { dur: 8,  img: '06-cierre-cta.png',    zoom: 'in',
      lines: [
        { text: 'El enlace esta en la bio.',             size: 60, color: COLOR_WHITE,  y_offset: -40, appear_at: 0.5 },
        { text: 'Empieza gratis hoy.',                   size: 60, color: COLOR_ACCENT, y_offset: 40,  appear_at: 2.0 },
      ]
    },
  ]

  // Generar segmentos reel en 1080x1920 (recortando centro)
  const reelSegments = []
  for (let i = 0; i < SCENES_REEL.length; i++) {
    const scene = SCENES_REEL[i]
    process.stdout.write(`  Reel escena ${i+1}/${SCENES_REEL.length}...`)
    // Primero en 1920x1080
    const tmpScene = { ...scene }
    const segHD = await buildSegment(tmpScene, i, 1920, 1080, '_reel')
    // Recortar a 9:16
    const segV = path.join(tmp, `reel_v_${String(i).padStart(2,'0')}.mp4`).replace(/\\/g, '/')
    cropToVertical(segHD, segV)
    reelSegments.push(segV)
    console.log(' ok')
  }

  // Concatenar reel
  const rawReelPath = path.join(tmp, 'raw_reel.mp4').replace(/\\/g, '/')
  await concatSegments(reelSegments, rawReelPath)

  const reelTotalDur = SCENES_REEL.reduce((sum, s) => sum + s.dur, 0)
  const promo_reel = path.join(out, 'projecttrack-promo-reel.mp4').replace(/\\/g, '/')
  addSilentAudio(rawReelPath, promo_reel, reelTotalDur)
  console.log('  Video 9:16 → public/projecttrack-promo-reel.mp4')

  // 5. Limpiar temporales
  console.log('\n[5/5] Limpiando archivos temporales...')
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log('  Listo.')

  // Resumen final
  const size16_9 = Math.round(fs.statSync(promo16_9.replace(/\//g, '\\')).size / 1024)
  const sizeReel = Math.round(fs.statSync(promo_reel.replace(/\//g, '\\')).size / 1024)

  console.log('\n' + '═'.repeat(50))
  console.log(' VIDEOS GENERADOS:')
  console.log(`   projecttrack-promo-v2.mp4  (${size16_9} KB)  — 16:9 LinkedIn/YouTube`)
  console.log(`   projecttrack-promo-reel.mp4 (${sizeReel} KB) — 9:16 Instagram/TikTok`)
  console.log('\n NOTA: Los videos tienen audio silencioso.')
  console.log('   Añade música con DaVinci Resolve o CapCut:')
  console.log('   Recomendado: Uppbeat > Corporate > Uplifting > 110-130 BPM')
  console.log('═'.repeat(50) + '\n')
}

main().catch(err => {
  console.error('\n Error:', err.message)
  if (err.stderr) console.error(err.stderr.toString())
  process.exit(1)
})
