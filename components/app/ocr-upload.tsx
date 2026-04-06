"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, CheckCircle2, AlertCircle, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export type OcrData = {
  invoiceNumber?: string | null
  issueDate?: string | null
  dueDate?: string | null
  baseAmount?: number | null
  vatRate?: number | null
  vatAmount?: number | null
  amount?: number | null
  currency?: string | null
  description?: string | null
  vendorName?: string | null
  clientName?: string | null
  nif?: string | null
  notes?: string | null
  error?: string
}

interface OcrUploadProps {
  onExtracted: (data: OcrData) => void
  className?: string
}

const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.webp"
const MAX_MB = 10

export function OcrUpload({ onExtracted, className }: OcrUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extracted, setExtracted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setExtracted(false)

      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`El archivo supera el límite de ${MAX_MB} MB`)
        return
      }

      setIsProcessing(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/ocr/extract", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? "Error al procesar el archivo")
          return
        }

        setExtracted(true)
        onExtracted(data as OcrData)
      } catch {
        setError("Error de red. Verifica tu conexión e inténtalo de nuevo.")
      } finally {
        setIsProcessing(false)
      }
    },
    [onExtracted]
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
      e.target.value = ""
    },
    [handleFile]
  )

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 gap-2 cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : extracted
              ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-900/10"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          isProcessing && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleChange}
          disabled={isProcessing}
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {isProcessing ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : extracted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="text-center space-y-0.5">
          <p className="text-sm font-medium">
            {isProcessing
              ? "Analizando documento con IA..."
              : extracted
                ? "Datos extraídos — sube otro para reemplazar"
                : "Sube una factura (PDF o foto) para auto-rellenar"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPEG, PNG, WEBP — máx. {MAX_MB} MB
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-destructive/60 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
