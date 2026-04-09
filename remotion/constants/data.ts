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
