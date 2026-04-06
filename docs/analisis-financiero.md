# Analisis Financiero — ProjectTrack SaaS

**Fecha:** 6 de abril de 2026
**Modelo de negocio:** Freemium (Starter gratuito + PRO 14,99 EUR/mes)

---

## 1. COSTES FIJOS MENSUALES (Infraestructura)

| Servicio | Plan actual (gratis) | Limite del plan gratuito | Cuando necesitas pagar | Plan de pago | Precio |
|---|---|---|---|---|---|
| Vercel | Hobby (gratis) | 100 GB bandwidth, 100 GB-hrs serverless | >100 GB BW o uso comercial con equipo | Pro | 20 USD/mo por miembro |
| Supabase | Free | 500 MB DB, 1 GB storage, 50K MAUs | >500 MB DB o >1 GB storage | Pro | 25 USD/mo + uso |
| Stripe | Sin cuota mensual | N/A | Desde la primera transaccion | Por transaccion | 1,5% + 0,25 EUR (tarjetas EU) |
| Anthropic Claude | Pago por uso | N/A | Desde la primera llamada API | Por tokens | Ver calculo abajo |
| Resend | Free | 3.000 emails/mes | >3.000 emails/mes | Pro | 20 USD/mo (50K emails) |
| Dominio .es | N/A | N/A | Desde el inicio | Anual | ~15 EUR/ano (~1,25 EUR/mo) |

### Coste fijo mensual ACTUAL (pre-lanzamiento / pocos usuarios):

| Concepto | Coste EUR/mes |
|---|---|
| Vercel Hobby | 0,00 |
| Supabase Free | 0,00 |
| Stripe | 0,00 (sin transacciones) |
| Anthropic Claude | ~0,00 (sin escaneos) |
| Resend Free | 0,00 |
| Dominio .es | 1,25 |
| **TOTAL** | **1,25 EUR/mes** |

---

## 2. CALCULO DETALLADO DEL COSTE OCR POR ESCANEO

### Modelo actual: `claude-opus-4-5`

El codigo usa `claude-opus-4-5` (confirmado en `app/api/invoices/[invoiceId]/upload/route.ts` y `app/api/ocr/extract/route.ts`).

**Precios actuales de Claude Opus 4.5 (abril 2026):**
- Input: 5,00 USD / millon de tokens
- Output: 25,00 USD / millon de tokens

**Tokens por escaneo OCR de una factura tipica:**

| Componente | Tokens estimados | Calculo |
|---|---|---|
| Imagen/PDF de factura (resolucion tipica ~1200x1600px) | ~2.560 tokens | (1200 * 1600) / 750 = 2.560 |
| Prompt del sistema (instrucciones JSON) | ~350 tokens | Texto del prompt medido |
| **Total input** | **~2.910 tokens** | |
| Respuesta JSON estructurada | ~250 tokens | JSON con 12 campos |
| **Total output** | **~250 tokens** | |

**Coste por escaneo con Opus 4.5:**

| Concepto | Calculo | Coste USD |
|---|---|---|
| Input (2.910 tokens) | 2.910 / 1.000.000 * 5,00 | 0,01455 |
| Output (250 tokens) | 250 / 1.000.000 * 25,00 | 0,00625 |
| **Total por escaneo** | | **0,0208 USD (~0,019 EUR)** |

### Modelo recomendado: `claude-sonnet-4-6`

**Precios de Claude Sonnet 4.6:**
- Input: 3,00 USD / millon de tokens
- Output: 15,00 USD / millon de tokens

**Coste por escaneo con Sonnet 4.6:**

| Concepto | Calculo | Coste USD |
|---|---|---|
| Input (2.910 tokens) | 2.910 / 1.000.000 * 3,00 | 0,00873 |
| Output (250 tokens) | 250 / 1.000.000 * 15,00 | 0,00375 |
| **Total por escaneo** | | **0,01248 USD (~0,0115 EUR)** |

**Ahorro al cambiar de Opus 4.5 a Sonnet 4.6: ~40% menos por escaneo**

> NOTA: Opus 4.5 ahora cuesta 5/25 USD (no los 15/75 de la generacion anterior), por lo que la diferencia ya no es tan dramatica como antes. Aun asi, Sonnet 4.6 es ~40% mas barato y suficiente para OCR de facturas.

---

## 3. COSTES VARIABLES (por usuario activo al mes)

### Usuario STARTER (gratis)

| Recurso | Uso estimado | Coste |
|---|---|---|
| DB Supabase | ~5 MB | 0,00 EUR (dentro del free tier) |
| Storage Supabase | ~10 MB | 0,00 EUR (dentro del free tier) |
| Emails (Resend) | ~2/mes (bienvenida, reset) | 0,00 EUR |
| OCR | 0 escaneos (no incluido) | 0,00 EUR |
| Bandwidth Vercel | ~50 MB | 0,00 EUR |
| **Total por usuario Starter** | | **0,00 EUR/mes** |

### Usuario PRO (14,99 EUR/mes)

| Recurso | Uso estimado | Coste por usuario |
|---|---|---|
| DB Supabase | ~10 MB | ~0,00 EUR (prorrateado) |
| Storage Supabase | ~50 MB | ~0,00 EUR (dentro del plan) |
| Emails (Resend) | ~5/mes | ~0,00 EUR (dentro del plan) |
| OCR (Opus 4.5) | 20 escaneos/mes | 20 * 0,019 = **0,38 EUR** |
| OCR (Sonnet 4.6) | 20 escaneos/mes | 20 * 0,0115 = **0,23 EUR** |
| Bandwidth Vercel | ~200 MB | ~0,00 EUR |
| **Total por usuario PRO (Opus 4.5)** | | **~0,38 EUR/mes** |
| **Total por usuario PRO (Sonnet 4.6)** | | **~0,23 EUR/mes** |

---

## 4. MODELO DE INGRESOS

| Concepto | Importe |
|---|---|
| Precio PRO | 14,99 EUR/mes |
| Comision Stripe (1,5% + 0,25 EUR) | -(14,99 * 0,015 + 0,25) = **-0,47 EUR** |
| Ingreso neto por pago | **14,52 EUR** |
| Coste OCR por usuario PRO (Opus 4.5) | -0,38 EUR |
| Coste OCR por usuario PRO (Sonnet 4.6) | -0,23 EUR |
| **Margen bruto por usuario PRO (Opus 4.5)** | **14,14 EUR/mes (94,3%)** |
| **Margen bruto por usuario PRO (Sonnet 4.6)** | **14,29 EUR/mes (95,3%)** |

---

## 5. PROYECCIONES DE CRECIMIENTO (12 meses)

### Parametros del modelo

| Parametro | Valor |
|---|---|
| Registros mes 1 | 50 |
| Crecimiento mensual de registros | 10% |
| Tasa de conversion free-to-PRO | 5% |
| Churn mensual de PRO | 5% |
| Modelo OCR | claude-opus-4-5 (escenario actual) |

### Umbrales de pago de infraestructura

| Servicio | Se activa cuando... | Coste adicional |
|---|---|---|
| Supabase Pro | >500 MB DB (~50 usuarios PRO) | +25 USD/mo (~23 EUR) |
| Resend Pro | >3.000 emails/mes (~600 usuarios) | +20 USD/mo (~18,50 EUR) |
| Vercel Pro | Necesidad comercial/equipo | +20 USD/mo (~18,50 EUR) |

### Tabla mes a mes (con Opus 4.5)

| Mes | Nuevos registros | Total Free | Total PRO | Ingresos PRO (EUR) | Coste infra (EUR) | Coste OCR (EUR) | Beneficio neto (EUR) | Acumulado (EUR) |
|---|---|---|---|---|---|---|---|---|
| 1 | 50 | 48 | 2 | 29,04 | 1,25 | 0,76 | 27,03 | 27,03 |
| 2 | 55 | 101 | 5 | 72,60 | 1,25 | 1,90 | 69,45 | 96,48 |
| 3 | 61 | 157 | 8 | 116,16 | 1,25 | 3,04 | 111,87 | 208,35 |
| 4 | 67 | 217 | 11 | 159,72 | 1,25 | 4,18 | 154,29 | 362,64 |
| 5 | 73 | 281 | 14 | 203,28 | 1,25 | 5,32 | 196,71 | 559,35 |
| 6 | 81 | 352 | 18 | 261,36 | 1,25 | 6,84 | 253,27 | 812,62 |
| 7 | 89 | 429 | 22 | 319,44 | 1,25 | 8,36 | 309,83 | 1.122,45 |
| 8 | 97 | 512 | 27 | 392,04 | 24,25 | 10,26 | 357,53 | 1.479,98 |
| 9 | 107 | 603 | 32 | 464,64 | 24,25 | 12,16 | 428,23 | 1.908,21 |
| 10 | 118 | 703 | 38 | 551,76 | 42,75 | 14,44 | 494,57 | 2.402,78 |
| 11 | 130 | 812 | 44 | 638,88 | 42,75 | 16,72 | 579,41 | 2.982,19 |
| 12 | 143 | 930 | 51 | 740,52 | 42,75 | 19,38 | 678,39 | 3.660,58 |

#### Notas sobre la tabla:

- **Mes 1-7:** Solo se paga dominio (1,25 EUR/mes). Supabase y Resend gratis.
- **Mes 8:** Se activa Supabase Pro (27 usuarios PRO * 10 MB = 270 MB, buffer para datos free). Coste sube a 24,25 EUR.
- **Mes 10:** Se activa Resend Pro (>600 usuarios totales = >3.000 emails estimados). Coste sube a 42,75 EUR.
- Los usuarios PRO se calculan como: PRO_anterior * 0,95 (churn) + nuevos_registros * 0,05 (conversion).
- Los usuarios Free incluyen los que no convierten y los que cancelan PRO.

### Resumen anual

| Metrica | Valor |
|---|---|
| Total usuarios registrados (mes 12) | ~981 |
| Usuarios PRO activos (mes 12) | ~51 |
| Ingresos brutos anuales | ~3.949 EUR |
| Costes totales anuales | ~289 EUR |
| **Beneficio neto anual** | **~3.660 EUR** |
| **Margen neto** | **~92,7%** |

---

## 6. ANALISIS DE PUNTO DE EQUILIBRIO (BREAK-EVEN)

### Escenario minimo (solo costes fijos actuales)

| Concepto | Valor |
|---|---|
| Costes fijos minimos | 1,25 EUR/mes (solo dominio) |
| Margen neto por usuario PRO | 14,14 EUR/mes |
| **Usuarios PRO para break-even** | **1 usuario PRO** |

### Escenario con todos los servicios de pago activados

| Concepto | Valor |
|---|---|
| Costes fijos (Supabase Pro + Resend Pro + Dominio) | 42,75 EUR/mes |
| Margen neto por usuario PRO (tras Stripe + OCR) | 14,14 EUR/mes |
| **Usuarios PRO para break-even** | **4 usuarios PRO** |
| **Mes en que se alcanza (proyeccion conservadora)** | **Mes 3** |

### Escenario con Vercel Pro incluido

| Concepto | Valor |
|---|---|
| Costes fijos totales | 61,25 EUR/mes |
| Margen neto por usuario PRO | 14,14 EUR/mes |
| **Usuarios PRO para break-even** | **5 usuarios PRO** |
| **Mes en que se alcanza** | **Mes 3-4** |

> El break-even es muy rapido porque los margenes de un SaaS con infraestructura serverless son altisimos. Con solo 4-5 usuarios PRO se cubren todos los costes de infraestructura.

---

## 7. RECOMENDACIONES DE OPTIMIZACION DE COSTES

### 7.1 Cambiar OCR de `claude-opus-4-5` a `claude-sonnet-4-6`

| Metrica | Opus 4.5 | Sonnet 4.6 | Ahorro |
|---|---|---|---|
| Coste por escaneo | 0,019 EUR | 0,0115 EUR | **40%** |
| Coste anual (51 PRO * 20 scans * 12) | ~232 EUR | ~141 EUR | **~91 EUR/ano** |
| Calidad OCR | Excelente | Muy buena (suficiente para facturas) | Minima diferencia |

**Cambio recomendado en el codigo:**
```
// En app/api/invoices/[invoiceId]/upload/route.ts y app/api/ocr/extract/route.ts
// Cambiar:
model: "claude-opus-4-5"
// Por:
model: "claude-sonnet-4-6"
```

### 7.2 Usar prompt caching de Anthropic

El prompt de instrucciones es identico en cada llamada (~350 tokens). Con prompt caching:
- Cache write: coste normal
- Cache read: 90% descuento (0,50 USD/MTok en vez de 5,00 USD/MTok)
- Ahorro estimado: ~5% adicional en coste de input

### 7.3 Cachear resultados OCR

Ya se almacena `ocrData` en la tabla `InvoiceFile`. Asegurar que:
- Si un archivo ya tiene `ocrData`, no se vuelve a enviar a Claude
- Deduplicar por hash del archivo (evitar escaneos repetidos del mismo documento)

### 7.4 Maximizar los tiers gratuitos

| Servicio | Estrategia | Ahorro estimado |
|---|---|---|
| Supabase | Limpiar datos de usuarios inactivos, comprimir JSON | Retrasar upgrade 2-3 meses |
| Vercel | Mantener Hobby mientras sea viable | 20 USD/mes |
| Resend | Reducir emails transaccionales innecesarios | Retrasar upgrade |

### 7.5 Batch API de Anthropic (50% descuento)

Si se implementa un sistema de cola para OCR (procesar escaneos en lotes en vez de en tiempo real), el coste baja un 50%:

| Modelo | Tiempo real | Batch API | Ahorro |
|---|---|---|---|
| Opus 4.5 | 0,019 EUR/scan | 0,0095 EUR/scan | 50% |
| Sonnet 4.6 | 0,0115 EUR/scan | 0,00575 EUR/scan | 50% |

> NOTA: El batch API tiene latencia de hasta 24h, asi que solo es viable si el usuario acepta esperar. No recomendado para la experiencia actual (OCR en tiempo real).

---

## 8. ESCENARIO COMPARATIVO: OPTIMIZADO vs ACTUAL

| Metrica (mes 12, 51 PRO) | Actual (Opus 4.5) | Optimizado (Sonnet 4.6) |
|---|---|---|
| Coste OCR mensual | 19,38 EUR | 11,73 EUR |
| Coste OCR anual | ~115 EUR | ~70 EUR |
| Margen por usuario PRO | 14,14 EUR | 14,29 EUR |
| Beneficio neto anual | ~3.660 EUR | ~3.706 EUR |

---

## 9. TABLA RESUMEN DE PRECIOS POR SERVICIO (Fuentes verificadas abril 2026)

| Servicio | Plan gratuito | Plan de pago | Fuente |
|---|---|---|---|
| Vercel | Hobby: 100 GB BW, uso personal | Pro: 20 USD/mo por miembro | vercel.com/pricing |
| Supabase | 500 MB DB, 1 GB storage, 50K MAUs | Pro: 25 USD/mo + uso | supabase.com/pricing |
| Stripe | Sin cuota, 1,5% + 0,25 EUR (EU) | Mismo | stripe.com/pricing |
| Claude Opus 4.5 | N/A | 5/25 USD por MTok (input/output) | platform.claude.com/docs |
| Claude Sonnet 4.6 | N/A | 3/15 USD por MTok (input/output) | platform.claude.com/docs |
| Resend | 3.000 emails/mes | Pro: 20 USD/mo (50K emails) | resend.com/pricing |
| Dominio .es | N/A | ~15 EUR/ano | dominios.es |

---

## 10. CONCLUSION

ProjectTrack tiene un **modelo financiero muy favorable**:

1. **Costes de arranque casi nulos:** 1,25 EUR/mes (solo dominio). Todo lo demas es gratuito.
2. **Break-even ultra rapido:** Con 1 usuario PRO ya se cubren los costes minimos. Con 4-5 PRO se cubren todos los servicios de pago.
3. **Margenes altisimos:** >94% de margen bruto por usuario PRO.
4. **Escalabilidad eficiente:** Los costes variables (OCR) escalan linealmente, pero representan menos del 3% del ingreso por usuario.
5. **Riesgo bajo:** La estructura serverless + free tiers elimina el riesgo de costes fijos elevados antes de tener traccion.

### Accion inmediata recomendada:
Cambiar `claude-opus-4-5` por `claude-sonnet-4-6` en los 2 endpoints de OCR para reducir costes un 40% sin impacto perceptible en calidad.
