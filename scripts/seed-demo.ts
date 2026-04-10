/**
 * Script para poblar la base de datos con datos demo realistas.
 * Borra todos los datos existentes (excepto User, Workspace, WorkspaceMember, Waitlist)
 * y crea proyectos, facturas e gastos ficticios para capturas y demo.
 *
 * Ejecutar: npx tsx scripts/seed-demo.ts
 */

import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { readFileSync } from "fs"
import { resolve } from "path"

// Load .env.local manually (no dotenv dependency)
const envPath = resolve(__dirname, "../.env.local")
const envContent = readFileSync(envPath, "utf-8")
for (const line of envContent.split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eqIdx = trimmed.indexOf("=")
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  let val = trimmed.slice(eqIdx + 1).trim()
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  if (!process.env[key]) process.env[key] = val
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!
if (!connectionString) {
  console.error("DIRECT_URL / DATABASE_URL no definida")
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// ─── Helpers ──────────────────────────────────────────────────────────────

function date(y: number, m: number, d: number) {
  return new Date(y, m - 1, d)
}

function cuid() {
  return `demo_${Math.random().toString(36).slice(2, 15)}${Date.now().toString(36)}`
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("🧹 Limpiando datos existentes...")

  // Borrar en orden de dependencias
  await prisma.expenseAllocation.deleteMany()
  await prisma.invoiceFile.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.project.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.betaFeedback.deleteMany()
  await prisma.supportTicket.deleteMany()

  console.log("✅ Datos limpiados")

  // Obtener el workspace del usuario
  const workspace = await prisma.workspace.findFirst({
    include: { members: { include: { user: true } } },
  })

  if (!workspace) {
    console.error("No se encontró ningún workspace")
    process.exit(1)
  }

  console.log(`📦 Workspace: ${workspace.name} (${workspace.id})`)

  // Actualizar workspace para demo
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      name: "Estudio Martín",
      plan: "PRO",
      sector: "reformas",
    },
  })

  // Actualizar nombre del usuario
  const owner = workspace.members.find((m) => m.role === "OWNER")
  if (owner?.userId) {
    await prisma.user.update({
      where: { id: owner.userId },
      data: { name: "Daniel Martín" },
    })
  }

  const wId = workspace.id

  console.log("📐 Creando proyectos...")

  // ─── Proyectos ────────────────────────────────────────────────────────

  const projects = [
    {
      id: cuid(), workspaceId: wId, name: "Reforma integral cocina", clientName: "María López García", clientNif: "12345678A",
      description: "Reforma completa de cocina en vivienda unifamiliar. Incluye demolición, fontanería, electricidad, alicatado y mobiliario.",
      status: "COMPLETED" as const, projectValue: 18500, budget: 12000, currency: "EUR",
      startDate: date(2025, 10, 5), endDate: date(2026, 1, 20), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Reforma baño principal", clientName: "Carlos Ruiz Sánchez", clientNif: "23456789B",
      description: "Sustitución de bañera por plato de ducha, nuevo alicatado y cambio de sanitarios.",
      status: "COMPLETED" as const, projectValue: 8200, budget: 5500, currency: "EUR",
      startDate: date(2025, 11, 1), endDate: date(2025, 12, 15), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Diseño interior oficina", clientName: "Estudio Arq. Vega SL", clientNif: "B12345678",
      description: "Diseño y ejecución de reforma integral de oficina de 120m². Espacio abierto, sala de reuniones y zona de descanso.",
      status: "ACTIVE" as const, projectValue: 24000, budget: 15000, currency: "EUR",
      startDate: date(2026, 2, 1), endDate: date(2026, 6, 30), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Instalación eléctrica nave", clientName: "Logística Norte SL", clientNif: "B23456789",
      description: "Instalación eléctrica completa de nave industrial de 800m². Cuadro general, iluminación LED y tomas de fuerza.",
      status: "COMPLETED" as const, projectValue: 12800, budget: 8200, currency: "EUR",
      startDate: date(2025, 12, 1), endDate: date(2026, 2, 15), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Reforma local comercial", clientName: "Ana Beltrán Café SL", clientNif: "B34567890",
      description: "Acondicionamiento de local para cafetería. Obra civil, instalaciones, decoración y mobiliario a medida.",
      status: "ACTIVE" as const, projectValue: 32000, budget: 20000, currency: "EUR",
      startDate: date(2026, 3, 1), endDate: date(2026, 7, 31), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Pintura y acabados vivienda", clientName: "Pedro Jiménez Torres", clientNif: "45678901C",
      description: "Pintura completa de vivienda de 90m² y reparación de acabados en paredes y techos.",
      status: "COMPLETED" as const, projectValue: 4500, budget: 2800, currency: "EUR",
      startDate: date(2026, 1, 10), endDate: date(2026, 2, 5), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Rehabilitación fachada edificio", clientName: "Comunidad Prop. Sol 12", clientNif: "H12345678",
      description: "Rehabilitación de fachada principal, impermeabilización y pintura. Edificio de 5 plantas.",
      status: "ACTIVE" as const, projectValue: 45000, budget: 28000, currency: "EUR",
      startDate: date(2026, 4, 1), endDate: date(2026, 9, 30), isDeclared: true, vatRate: 10, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Diseño web portfolio", clientName: "Laura Méndez Fotografía", clientNif: "56789012D",
      description: "Diseño y desarrollo de página web portfolio para fotógrafa profesional.",
      status: "COMPLETED" as const, projectValue: 2800, budget: 800, currency: "EUR",
      startDate: date(2026, 1, 15), endDate: date(2026, 2, 28), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Reforma terraza ático", clientName: "Javier Ortega Blanco", clientNif: "67890123E",
      description: "Reforma completa de terraza de 40m². Nuevo pavimento, jardineras, pérgola e iluminación exterior.",
      status: "ACTIVE" as const, projectValue: 15600, budget: 9500, currency: "EUR",
      startDate: date(2026, 3, 10), endDate: date(2026, 5, 31), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
    {
      id: cuid(), workspaceId: wId, name: "Consultoría energética hotel", clientName: "Hotel Mirador SL", clientNif: "B45678901",
      description: "Auditoría energética y propuesta de mejoras de eficiencia para hotel boutique de 30 habitaciones.",
      status: "ARCHIVED" as const, projectValue: 6000, budget: 1200, currency: "EUR",
      startDate: date(2025, 9, 1), endDate: date(2025, 10, 15), isDeclared: true, vatRate: 21, irpfRate: 15,
    },
  ]

  for (const p of projects) {
    await prisma.project.create({ data: p })
  }

  console.log(`✅ ${projects.length} proyectos creados`)
  console.log("💰 Creando facturas emitidas...")

  // ─── Facturas emitidas (INCOME) ───────────────────────────────────────

  const incomes: Array<{
    id: string; type: "INCOME"; workspaceId: string; projectId: string; number: string
    description?: string; counterpartNif?: string; amount: number; currency: string
    vatAmount?: number; issueDate: Date; dueDate?: Date; paidDate?: Date
    status: "PAID" | "PENDING" | "OVERDUE"; isDeclared: boolean; paymentMethod?: string
  }> = []

  let fNum = 1
  function fNumber() { return `F-${String(fNum++).padStart(3, "0")}` }

  // Proyecto 1 - Reforma cocina (COMPLETED, 18500€) — 3 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[0].id, number: fNumber(), description: "Anticipo reforma cocina", counterpartNif: "12345678A", amount: 5550, currency: "EUR", vatAmount: 1165.50, issueDate: date(2025, 10, 5), dueDate: date(2025, 10, 20), paidDate: date(2025, 10, 18), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[0].id, number: fNumber(), description: "Segundo pago reforma cocina", counterpartNif: "12345678A", amount: 7400, currency: "EUR", vatAmount: 1554, issueDate: date(2025, 11, 15), dueDate: date(2025, 12, 1), paidDate: date(2025, 11, 28), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[0].id, number: fNumber(), description: "Pago final reforma cocina", counterpartNif: "12345678A", amount: 5550, currency: "EUR", vatAmount: 1165.50, issueDate: date(2026, 1, 20), dueDate: date(2026, 2, 5), paidDate: date(2026, 1, 30), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
  )

  // Proyecto 2 - Reforma baño (COMPLETED, 8200€) — 2 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[1].id, number: fNumber(), description: "Anticipo reforma baño", counterpartNif: "23456789B", amount: 4100, currency: "EUR", vatAmount: 861, issueDate: date(2025, 11, 1), dueDate: date(2025, 11, 15), paidDate: date(2025, 11, 12), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[1].id, number: fNumber(), description: "Pago final reforma baño", counterpartNif: "23456789B", amount: 4100, currency: "EUR", vatAmount: 861, issueDate: date(2025, 12, 15), dueDate: date(2025, 12, 30), paidDate: date(2025, 12, 22), status: "PAID", isDeclared: true, paymentMethod: "efectivo" },
  )

  // Proyecto 3 - Diseño oficina (ACTIVE, 24000€) — 3 cobros, 1 pendiente
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[2].id, number: fNumber(), description: "Anticipo diseño oficina", counterpartNif: "B12345678", amount: 8000, currency: "EUR", vatAmount: 1680, issueDate: date(2026, 2, 1), dueDate: date(2026, 2, 15), paidDate: date(2026, 2, 10), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[2].id, number: fNumber(), description: "Segundo pago diseño oficina", counterpartNif: "B12345678", amount: 8000, currency: "EUR", vatAmount: 1680, issueDate: date(2026, 3, 15), dueDate: date(2026, 4, 1), paidDate: date(2026, 3, 28), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[2].id, number: fNumber(), description: "Pago final diseño oficina", counterpartNif: "B12345678", amount: 8000, currency: "EUR", vatAmount: 1680, issueDate: date(2026, 5, 1), dueDate: date(2026, 5, 15), status: "PENDING", isDeclared: true },
  )

  // Proyecto 4 - Instalación eléctrica (COMPLETED, 12800€) — 2 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[3].id, number: fNumber(), description: "Anticipo instalación eléctrica", counterpartNif: "B23456789", amount: 6400, currency: "EUR", vatAmount: 1344, issueDate: date(2025, 12, 1), dueDate: date(2025, 12, 15), paidDate: date(2025, 12, 10), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[3].id, number: fNumber(), description: "Pago final instalación eléctrica", counterpartNif: "B23456789", amount: 6400, currency: "EUR", vatAmount: 1344, issueDate: date(2026, 2, 15), dueDate: date(2026, 3, 1), paidDate: date(2026, 2, 25), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
  )

  // Proyecto 5 - Local comercial (ACTIVE, 32000€) — 4 cobros, 2 pendientes, 1 vencida
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[4].id, number: fNumber(), description: "Anticipo local comercial", counterpartNif: "B34567890", amount: 9600, currency: "EUR", vatAmount: 2016, issueDate: date(2026, 3, 1), dueDate: date(2026, 3, 15), paidDate: date(2026, 3, 12), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[4].id, number: fNumber(), description: "Segundo pago local comercial", counterpartNif: "B34567890", amount: 9600, currency: "EUR", vatAmount: 2016, issueDate: date(2026, 4, 1), dueDate: date(2026, 4, 5), status: "PENDING", isDeclared: true },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[4].id, number: fNumber(), description: "Tercer pago local comercial", counterpartNif: "B34567890", amount: 6400, currency: "EUR", vatAmount: 1344, issueDate: date(2026, 5, 1), dueDate: date(2026, 5, 15), status: "PENDING", isDeclared: true },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[4].id, number: fNumber(), description: "Pago final local comercial", counterpartNif: "B34567890", amount: 6400, currency: "EUR", vatAmount: 1344, issueDate: date(2026, 6, 1), dueDate: date(2026, 6, 15), status: "PENDING", isDeclared: true },
  )

  // Proyecto 6 - Pintura vivienda (COMPLETED, 4500€) — 2 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[5].id, number: fNumber(), description: "Anticipo pintura vivienda", counterpartNif: "45678901C", amount: 2250, currency: "EUR", vatAmount: 472.50, issueDate: date(2026, 1, 10), dueDate: date(2026, 1, 25), paidDate: date(2026, 1, 20), status: "PAID", isDeclared: true, paymentMethod: "efectivo" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[5].id, number: fNumber(), description: "Pago final pintura vivienda", counterpartNif: "45678901C", amount: 2250, currency: "EUR", vatAmount: 472.50, issueDate: date(2026, 2, 5), dueDate: date(2026, 2, 20), paidDate: date(2026, 2, 15), status: "PAID", isDeclared: true, paymentMethod: "efectivo" },
  )

  // Proyecto 7 - Fachada (ACTIVE, 45000€) — 3 cobros, pendientes
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[6].id, number: fNumber(), description: "Anticipo rehabilitación fachada", counterpartNif: "H12345678", amount: 15000, currency: "EUR", vatAmount: 1500, issueDate: date(2026, 4, 1), dueDate: date(2026, 4, 15), paidDate: date(2026, 4, 8), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[6].id, number: fNumber(), description: "Segundo pago fachada", counterpartNif: "H12345678", amount: 15000, currency: "EUR", vatAmount: 1500, issueDate: date(2026, 6, 1), dueDate: date(2026, 6, 15), status: "PENDING", isDeclared: true },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[6].id, number: fNumber(), description: "Pago final fachada", counterpartNif: "H12345678", amount: 15000, currency: "EUR", vatAmount: 1500, issueDate: date(2026, 8, 1), dueDate: date(2026, 8, 15), status: "PENDING", isDeclared: true },
  )

  // Proyecto 8 - Web (COMPLETED, 2800€) — 2 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[7].id, number: fNumber(), description: "Anticipo diseño web", counterpartNif: "56789012D", amount: 1400, currency: "EUR", vatAmount: 294, issueDate: date(2026, 1, 15), dueDate: date(2026, 1, 30), paidDate: date(2026, 1, 25), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[7].id, number: fNumber(), description: "Pago final diseño web", counterpartNif: "56789012D", amount: 1400, currency: "EUR", vatAmount: 294, issueDate: date(2026, 2, 28), dueDate: date(2026, 3, 15), paidDate: date(2026, 3, 5), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
  )

  // Proyecto 9 - Terraza (ACTIVE, 15600€) — 3 cobros, 1 pagado + 1 pendiente + 1 futuro
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[8].id, number: fNumber(), description: "Anticipo reforma terraza", counterpartNif: "67890123E", amount: 5200, currency: "EUR", vatAmount: 1092, issueDate: date(2026, 3, 10), dueDate: date(2026, 3, 25), paidDate: date(2026, 3, 20), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[8].id, number: fNumber(), description: "Segundo pago terraza", counterpartNif: "67890123E", amount: 5200, currency: "EUR", vatAmount: 1092, issueDate: date(2026, 4, 10), dueDate: date(2026, 4, 25), status: "PENDING", isDeclared: true },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[8].id, number: fNumber(), description: "Pago final terraza", counterpartNif: "67890123E", amount: 5200, currency: "EUR", vatAmount: 1092, issueDate: date(2026, 5, 10), dueDate: date(2026, 5, 25), status: "PENDING", isDeclared: true },
  )

  // Proyecto 10 - Consultoría (ARCHIVED, 6000€) — 2 cobros
  incomes.push(
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[9].id, number: fNumber(), description: "Anticipo consultoría energética", counterpartNif: "B45678901", amount: 3000, currency: "EUR", vatAmount: 630, issueDate: date(2025, 9, 1), dueDate: date(2025, 9, 15), paidDate: date(2025, 9, 10), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
    { id: cuid(), type: "INCOME", workspaceId: wId, projectId: projects[9].id, number: fNumber(), description: "Pago final consultoría energética", counterpartNif: "B45678901", amount: 3000, currency: "EUR", vatAmount: 630, issueDate: date(2025, 10, 15), dueDate: date(2025, 10, 30), paidDate: date(2025, 10, 25), status: "PAID", isDeclared: true, paymentMethod: "transferencia" },
  )

  for (const inv of incomes) {
    await prisma.invoice.create({ data: inv })
  }

  console.log(`✅ ${incomes.length} facturas emitidas creadas`)
  console.log("📦 Creando gastos...")

  // ─── Gastos (EXPENSE) ──────────────────────────────────────────────────

  let gNum = 1
  function gNumber() { return `G-${String(gNum++).padStart(3, "0")}` }

  const expenses: Array<{
    id: string; type: "EXPENSE"; workspaceId: string; projectId: null; number: string
    description: string; vendorName: string; category: string; counterpartNif?: string
    amount: number; currency: string; vatAmount: number; issueDate: Date
    paidDate?: Date; status: "PAID" | "PENDING"; isDeclared: boolean
    allocations?: Array<{ projectId: string; amount: number; notes?: string }>
  }> = []

  // Material
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Cerámica y azulejos cocina", vendorName: "Porcelanosa", category: "Material", counterpartNif: "A12345678", amount: 3200, currency: "EUR", vatAmount: 672, issueDate: date(2025, 10, 12), paidDate: date(2025, 10, 15), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[0].id, amount: 3200 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Sanitarios y grifería baño", vendorName: "Roca", category: "Material", counterpartNif: "A23456789", amount: 1850, currency: "EUR", vatAmount: 388.50, issueDate: date(2025, 11, 5), paidDate: date(2025, 11, 10), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[1].id, amount: 1850 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Cable eléctrico y mecanismos", vendorName: "Rexel España", category: "Material", counterpartNif: "B56789012", amount: 4100, currency: "EUR", vatAmount: 861, issueDate: date(2025, 12, 8), paidDate: date(2025, 12, 12), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[3].id, amount: 4100 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Pintura interior (20L blanco + colores)", vendorName: "Pinturas Isaval", category: "Material", counterpartNif: "A34567890", amount: 890, currency: "EUR", vatAmount: 186.90, issueDate: date(2026, 1, 8), paidDate: date(2026, 1, 10), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[5].id, amount: 580 }, { projectId: projects[0].id, amount: 310 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Madera y tableros melamina", vendorName: "Maderas García", category: "Material", counterpartNif: "B67890123", amount: 2400, currency: "EUR", vatAmount: 504, issueDate: date(2026, 2, 20), paidDate: date(2026, 2, 25), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[2].id, amount: 2400 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Cemento, mortero y materiales obra", vendorName: "Bricomart", category: "Material", counterpartNif: "A78901234", amount: 1650, currency: "EUR", vatAmount: 346.50, issueDate: date(2026, 3, 5), paidDate: date(2026, 3, 8), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[4].id, amount: 1100 }, { projectId: projects[8].id, amount: 550 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Pavimento exterior terraza", vendorName: "Leroy Merlin", category: "Material", counterpartNif: "A89012345", amount: 2100, currency: "EUR", vatAmount: 441, issueDate: date(2026, 3, 15), paidDate: date(2026, 3, 18), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[8].id, amount: 2100 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Material impermeabilización fachada", vendorName: "Sika España", category: "Material", counterpartNif: "A90123456", amount: 3800, currency: "EUR", vatAmount: 798, issueDate: date(2026, 4, 3), status: "PENDING", isDeclared: true, allocations: [{ projectId: projects[6].id, amount: 3800 }] },
  )

  // Herramientas
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Taladro percutor Bosch GBH 2-28", vendorName: "Amazon", category: "Herramientas", amount: 289, currency: "EUR", vatAmount: 60.69, issueDate: date(2025, 10, 2), paidDate: date(2025, 10, 2), status: "PAID", isDeclared: true },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Sierra circular + discos", vendorName: "Wurth", category: "Herramientas", counterpartNif: "A11223344", amount: 420, currency: "EUR", vatAmount: 88.20, issueDate: date(2026, 1, 5), paidDate: date(2026, 1, 5), status: "PAID", isDeclared: true },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Alquiler andamio 2 meses", vendorName: "Alquileres Obra SL", category: "Herramientas", counterpartNif: "B22334455", amount: 1200, currency: "EUR", vatAmount: 252, issueDate: date(2026, 4, 1), status: "PENDING", isDeclared: true, allocations: [{ projectId: projects[6].id, amount: 1200 }] },
  )

  // Subcontrata
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Fontanería cocina completa", vendorName: "Fontanería Rápida SL", category: "Mano de obra / Subcontrata", counterpartNif: "B33445566", amount: 2200, currency: "EUR", vatAmount: 462, issueDate: date(2025, 11, 20), paidDate: date(2025, 12, 5), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[0].id, amount: 2200 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Cristalería y mamparas", vendorName: "Cristalería Moderna SL", category: "Mano de obra / Subcontrata", counterpartNif: "B44556677", amount: 1500, currency: "EUR", vatAmount: 315, issueDate: date(2025, 12, 10), paidDate: date(2025, 12, 20), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[1].id, amount: 800 }, { projectId: projects[0].id, amount: 700 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Carpintería a medida oficina", vendorName: "Carpintería Artesana", category: "Mano de obra / Subcontrata", counterpartNif: "B55667788", amount: 4800, currency: "EUR", vatAmount: 1008, issueDate: date(2026, 3, 20), paidDate: date(2026, 4, 1), status: "PAID", isDeclared: true, allocations: [{ projectId: projects[2].id, amount: 4800 }] },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Electricista local comercial", vendorName: "Electro Servicios Madrid", category: "Mano de obra / Subcontrata", counterpartNif: "B66778899", amount: 3500, currency: "EUR", vatAmount: 735, issueDate: date(2026, 4, 5), status: "PENDING", isDeclared: true, allocations: [{ projectId: projects[4].id, amount: 3500 }] },
  )

  // Transporte
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Alquiler furgoneta 3 días", vendorName: "Enterprise", category: "Transporte", amount: 180, currency: "EUR", vatAmount: 37.80, issueDate: date(2026, 2, 10), paidDate: date(2026, 2, 10), status: "PAID", isDeclared: true },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Combustible trimestre", vendorName: "Repsol", category: "Transporte", amount: 420, currency: "EUR", vatAmount: 88.20, issueDate: date(2026, 3, 31), paidDate: date(2026, 3, 31), status: "PAID", isDeclared: true },
  )

  // Suministros
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Teléfono móvil + fibra oficina", vendorName: "Movistar", category: "Suministros", amount: 65, currency: "EUR", vatAmount: 13.65, issueDate: date(2026, 3, 1), paidDate: date(2026, 3, 5), status: "PAID", isDeclared: true },
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Electricidad oficina/taller", vendorName: "Iberdrola", category: "Suministros", amount: 95, currency: "EUR", vatAmount: 19.95, issueDate: date(2026, 3, 15), paidDate: date(2026, 3, 20), status: "PAID", isDeclared: true },
  )

  // Otros
  expenses.push(
    { id: cuid(), type: "EXPENSE", workspaceId: wId, projectId: null, number: gNumber(), description: "Seguro RC profesional anual", vendorName: "Mapfre", category: "Otros", amount: 380, currency: "EUR", vatAmount: 79.80, issueDate: date(2026, 1, 15), paidDate: date(2026, 1, 15), status: "PAID", isDeclared: true },
  )

  for (const exp of expenses) {
    const { allocations, ...invoiceData } = exp
    const created = await prisma.invoice.create({ data: invoiceData })

    if (allocations && allocations.length > 0) {
      for (const alloc of allocations) {
        await prisma.expenseAllocation.create({
          data: {
            id: cuid(),
            invoiceId: created.id,
            projectId: alloc.projectId,
            amount: alloc.amount,
            notes: alloc.notes,
          },
        })
      }
    }
  }

  console.log(`✅ ${expenses.length} gastos creados`)

  // ─── Resumen ──────────────────────────────────────────────────────────

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0)

  console.log("\n📊 Resumen de datos demo:")
  console.log(`   Proyectos: ${projects.length}`)
  console.log(`   Facturas emitidas: ${incomes.length} (${totalIncome.toLocaleString("es-ES")}€)`)
  console.log(`   Gastos: ${expenses.length} (${totalExpense.toLocaleString("es-ES")}€)`)
  console.log(`   Beneficio bruto: ${(totalIncome - totalExpense).toLocaleString("es-ES")}€`)
  console.log(`\n✅ ¡Datos demo listos!`)
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
