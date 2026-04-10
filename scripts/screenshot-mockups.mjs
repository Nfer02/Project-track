/**
 * screenshot-mockups.mjs
 * Convierte los HTML mockups del video promo en PNG 1920x1080
 * Uso: node scripts/screenshot-mockups.mjs
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const mockupsDir = path.join(root, 'public', 'mockups')
const outputDir = path.join(root, 'docs', 'screenshots')

// Orden para el video — pitch slides primero, luego mockups detallados
const files = [
  // Secuencia del video
  { file: 'pitch-00-intro.html',           name: '00-intro' },
  { file: 'pitch-01-problem.html',         name: '01-problema' },
  { file: 'pitch-02-projects.html',        name: '02-proyectos' },
  { file: 'pitch-03-income-expenses.html', name: '03-ingresos-gastos' },
  { file: 'pitch-04-ocr.html',             name: '04-ocr-ia' },
  { file: 'pitch-05-dashboard.html',       name: '05-dashboard' },
  { file: 'pitch-06-cierre.html',          name: '06-cierre-cta' },
  // Mockups detallados (para zoom / close-up)
  { file: '01-projects.html',              name: 'detail-01-proyectos' },
  { file: '02-income-expenses.html',       name: 'detail-02-ingresos-gastos' },
  { file: '03-ocr-ai.html',               name: 'detail-03-ocr' },
  { file: '04-dashboard.html',            name: 'detail-04-dashboard' },
]

async function captureScreenshots() {
  // Crear carpeta de salida si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log('Iniciando navegador...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  })

  const page = await browser.newPage()

  let success = 0
  let errors = 0

  for (const { file, name } of files) {
    const filePath = path.join(mockupsDir, file)
    const outputPath = path.join(outputDir, `${name}.png`)

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ No encontrado: ${file}`)
      errors++
      continue
    }

    try {
      const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`
      await page.goto(fileUrl, { waitUntil: 'networkidle0' })

      // Esperar 500ms para que terminen las animaciones CSS
      await new Promise(resolve => setTimeout(resolve, 500))

      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      })

      const sizeKB = Math.round(fs.statSync(outputPath).size / 1024)
      console.log(`  ✓ ${name}.png (${sizeKB} KB)`)
      success++
    } catch (err) {
      console.error(`  ✗ Error en ${file}:`, err.message)
      errors++
    }
  }

  await browser.close()

  console.log(`\n Completado: ${success} capturas OK, ${errors} errores`)
  console.log(` Carpeta: docs/screenshots/`)
}

captureScreenshots().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
