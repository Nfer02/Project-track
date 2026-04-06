"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportRow {
  fecha: string
  tipo: string
  numero: string
  numeroFacturaProveedor: string
  nif: string
  nombreClienteProveedor: string
  baseImponible: string
  iva: string
  total: string
  estado: string
}

interface ReportExportButtonProps {
  rows: ReportRow[]
  quarterLabel: string
}

export function ReportExportButton({ rows, quarterLabel }: ReportExportButtonProps) {
  function handleExport() {
    const headers = ["Fecha", "Tipo", "N\u00b0 Factura", "N\u00b0 Factura Proveedor", "NIF", "Nombre Cliente/Proveedor", "Base Imponible", "IVA", "Total", "Estado"]

    const csvContent = [
      headers.join(";"),
      ...rows.map((r) =>
        [
          r.fecha,
          r.tipo,
          r.numero,
          r.numeroFacturaProveedor,
          r.nif,
          `"${(r.nombreClienteProveedor || "").replace(/"/g, '""')}"`,
          r.baseImponible,
          r.iva,
          r.total,
          r.estado,
        ].join(";")
      ),
    ].join("\n")

    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte-${quarterLabel}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={rows.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
