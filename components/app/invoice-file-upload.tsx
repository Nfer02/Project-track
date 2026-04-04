"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OcrData = {
  invoiceNumber?: string | null
  issueDate?: string | null
  dueDate?: string | null
  amount?: number | null
  currency?: string | null
  description?: string | null
  vendorName?: string | null
  clientName?: string | null
  notes?: string | null
  error?: string
}

type UploadResult = {
  id: string
  filename: string
  ocrData: OcrData
}

interface InvoiceFileUploadProps {
  invoiceId: string
  onSuccess?: (result: UploadResult) => void
}

const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.webp"
const MAX_MB = 10

export function InvoiceFileUpload({ invoiceId, onSuccess }: InvoiceFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setResult(null)

      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`El archivo supera el límite de ${MAX_MB} MB`)
        return
      }

      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`/api/invoices/${invoiceId}/upload`, {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? "Error al subir el archivo")
          return
        }

        setResult(data as UploadResult)
        onSuccess?.(data as UploadResult)
      } catch {
        setError("Error de red. Verifica tu conexión e inténtalo de nuevo.")
      } finally {
        setIsUploading(false)
      }
    },
    [invoiceId, onSuccess]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset para permitir subir el mismo archivo de nuevo
      e.target.value = ""
    },
    [handleFile]
  )

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 gap-3 cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {isUploading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            {isUploading ? "Analizando documento..." : "Arrastra un archivo o haz clic"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPEG, PNG, WEBP — máx. {MAX_MB} MB
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-destructive/60 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Archivo analizado: {result.filename}
          </div>

          {result.ocrData.error ? (
            <p className="text-sm text-muted-foreground">{result.ocrData.error}</p>
          ) : (
            <OcrResultCard data={result.ocrData} />
          )}
        </div>
      )}
    </div>
  )
}

function OcrResultCard({ data }: { data: OcrData }) {
  const fields: { label: string; value: string | number | null | undefined }[] = [
    { label: "N° de factura", value: data.invoiceNumber },
    { label: "Emisor", value: data.vendorName },
    { label: "Cliente", value: data.clientName },
    { label: "Descripción", value: data.description },
    { label: "Monto", value: data.amount != null ? `${data.amount} ${data.currency ?? ""}` : null },
    { label: "Fecha emisión", value: data.issueDate },
    { label: "Fecha vencimiento", value: data.dueDate },
    { label: "Notas", value: data.notes },
  ].filter((f) => f.value != null && f.value !== "")

  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No se encontraron datos estructurados en el documento.
      </p>
    )
  }

  return (
    <div className="rounded-lg border bg-muted/30 divide-y text-sm">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <FileText className="h-3.5 w-3.5" />
        Datos extraídos por OCR
      </div>
      {fields.map(({ label, value }) => (
        <div key={label} className="flex gap-3 px-3 py-2">
          <span className="text-muted-foreground w-32 shrink-0">{label}</span>
          <span className="font-medium break-words">{String(value)}</span>
        </div>
      ))}
    </div>
  )
}
