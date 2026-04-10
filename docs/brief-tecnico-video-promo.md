# Brief Técnico de Edición — Video Promocional ProjectTrack

---

## Herramienta de edición

**DaVinci Resolve 18 (versión gratuita)** — recomendado principal.

- Sin marca de agua en la exportación
- Color grading profesional
- Módulo Fusion para motion graphics (sin necesidad de After Effects)
- Módulo Fairlight para audio preciso
- Exporta a todos los formatos necesarios

**Alternativa:** CapCut Pro (~13€/mes) si se prefiere flujo de trabajo más rápido. Ofrece subtítulos automáticos y plantillas. Menos control en color y exportación.

---

## Paleta de motion graphics

| Rol | Color | Hex |
|-----|-------|-----|
| Fondo principal | Casi blanco / gris humo | `#F8F9FA` |
| Acento primario | Azul pizarra | `#3B5BDB` |
| Acento secundario | Índigo suave | `#6741D9` |
| Texto principal | Gris carbón | `#1C1C1E` |
| Texto secundario | Gris medio | `#6B7280` |
| Éxito / positivo | Verde salvia | `#2F9E44` |
| Fondo oscuro (cierre) | Gris grafito | `#212529` |

Nunca más de 3 colores simultáneos en pantalla.

---

## Tipografía (todas gratuitas en Google Fonts)

| Uso | Fuente | Peso |
|-----|--------|------|
| Titulares en pantalla | Plus Jakarta Sans | 700 / 800 |
| Subtítulos | Inter | 400 Regular |
| Datos numéricos / KPIs | JetBrains Mono | 600 SemiBold |
| CTA final | Plus Jakarta Sans | 800 Black |

---

## Flujo de trabajo

```text
FASE 1 — Ingest y organización (1-2h)
  Crear bins: /Screen_Recordings /Talking_Head /Stock /Audio /Graphics
  Generar proxies si < 16 GB RAM
  Etiquetar y valorar takes

FASE 2 — Rough cut (2-3h)
  Solo talking head + screen recordings
  Ignorar color, audio fino y gráficos
  Objetivo: que la historia tenga sentido
  Duración objetivo: 110-120 seg (se comprimirá)

FASE 3 — Fine cut (2-3h)
  Ajustar timing de cada corte
  Insertar B-roll en momentos menos dinámicos
  Aplicar J-cuts y L-cuts en transiciones
  Duración objetivo: 75-85 seg

FASE 4 — Motion graphics (3-4h)
  Animar lower thirds con datos clave
  Construir tarjetas de feature highlight
  Animar subtítulos
  Frame de cierre con logo + URL

FASE 5 — Color grading (1-2h)
  LUT neutro de base al talking head
  Emparejar temperatura entre todos los clips
  Leve lift en sombras, skin tones cálidos,
  pantallas +10% saturación

FASE 6 — Audio (1-2h)
  Limpieza del talking head
  Mezcla de niveles
  Revisión en auriculares y altavoces

FASE 7 — Subtítulos (1h)
  Generar SRT con Whisper.ai (gratis) o CapCut
  Importar en DaVinci y aplicar estilo
  Revisar manualmente línea por línea

FASE 8 — Export (30 min)
  Exportar según specs de plataforma
```

---

## Transiciones permitidas

| Tipo | Cuándo | Duración |
|------|--------|----------|
| Corte directo | Dentro de secuencias de UI | Instantáneo |
| Fundido a negro | Entre secciones principales | 12-15 frames |
| Empuje horizontal | Entre features en la demo | 18-22 frames |
| Zoom sutil | Énfasis en elemento de UI | 8-12 frames |
| Match cut | Gesto usuario → mismo gesto en app | Instantáneo |

No usar: wipes de colores, glitch, sparkles, ni transiciones de plantilla con marca. Rompen la credibilidad del SaaS.

---

## Speed ramps

Aplicar solo en 2 momentos:

1. **Entrada al OCR:** Arranca al 30% de velocidad 0,5 seg → acelera a 100% cuando el sistema reconoce los datos.
2. **Scroll en dashboard:** 100% → rampa a 200% en tramo intermedio → vuelve a 100% cuando el elemento relevante queda centrado.

Herramienta en DaVinci: Speed Warp en inspector de clip, interpolación óptica activada.

---

## Motion graphics clave

### Tarjeta flotante (para cada feature)

- Fondo: `#F8F9FA` al 92% opacidad, bordes redondeados 12px
- Título: Plus Jakarta Sans 700, 38px, color `#1C1C1E`
- Descripción: Inter 400, 22px, color `#6B7280`
- Animación entrada: slide up + fade in, 0,4 seg, ease-out
- Posición: tercio inferior izquierdo (deja visible la UI a la derecha)
- Permanencia: 3-4 seg en pantalla
- Línea de acento: 3px `#3B5BDB`, se dibuja izq→der en 0,3 seg

### Lower third de dato numérico

- Número: JetBrains Mono 64px, counter animation 0-X en 0,8 seg
- Descripción: aparece en fade cuando termina el contador
- Fondo: banda `#212529` al 85% opacidad, 90px de alto
- Margen inferior: 40px de safe zone

### Subtítulos

| Parámetro | Valor |
|-----------|-------|
| Fuente | Inter 600 SemiBold |
| Tamaño | 42px (16:9) / 52px (9:16) |
| Color | Blanco `#FFFFFF` |
| Contorno | Negro `#000000`, 2px, 80% opacidad |
| Posición | Centro-inferior, 80px del borde |
| Máximo | 2 líneas, 7 palabras por línea |
| Palabra activa | Resaltado en `#3B5BDB` (para Reels — omitir en YouTube si se prefiere tono más sobrio) |

---

## Audio

### Música de fondo

Electrónica instrumental corporativa, 110-125 BPM. Sin voces. Piano o sintetizadores limpios, línea de bajo sutil, hi-hats repetitivos. Progresión: intro tranquila → build en la demo → salida limpia en el cierre.

**Fuentes gratuitas:**

| Plataforma | Plan | Notas |
|-----------|------|-------|
| Pixabay Music | Gratuito | Sin registro, licencia comercial |
| Uppbeat | Free (10 canciones/mes) | Filtrar: Corporate + Uplifting + 110-130 BPM |
| Mixkit | Gratuito | Buena selección electrónica corporativa |
| Freesound.org | Gratuito | Solo efectos — verificar licencia CC0 |

### Niveles de mezcla

| Elemento | Nivel | Notas |
|----------|-------|-------|
| Voz (talking head) | -14 LUFS integrado | Estándar YouTube |
| Música con voz | -24 a -28 LUFS | Siempre por debajo de la voz |
| Música sin voz (solo UI) | -18 a -20 LUFS | Puede subir ligeramente |
| Efectos de sonido | -18 dB pico | Nunca más alto que la voz |
| Silencio antes del CTA | -32 LUFS | 0,5 seg — genera atención |

### Efectos de sonido para UI

| Momento | Efecto |
|---------|--------|
| Clic en botón | Soft click, tono medio-agudo, 40-60ms |
| Aparición de tarjeta | Whoosh suave ascendente, 150ms |
| Counter animation | Ticking sutil durante el incremento |
| Transición entre secciones | Swoosh + impacto suave, máx. 300ms |
| Logo final | Una nota limpia de sintetizador |
| OCR procesando | Sonido de "escaneo" sutil |

Buscar en Freesound.org (CC0): "ui click soft", "whoosh transition", "counter tick", "scan beep minimal".

---

## Especificaciones de exportación

### YouTube — 16:9

| Parámetro | Valor |
|-----------|-------|
| Resolución | 1920 × 1080 |
| FPS | 25 |
| Codec | H.264, High Profile Level 4.2 |
| Bitrate vídeo | CBR 16 Mbps |
| Codec audio | AAC-LC 320 kbps estéreo |
| Color space | Rec. 709 |
| Contenedor | MP4 |

### LinkedIn — 16:9

| Parámetro | Valor |
|-----------|-------|
| Resolución | 1920 × 1080 |
| FPS | 25 |
| Codec | H.264 |
| Bitrate | 30 Mbps (LinkedIn recomprime — subir máxima calidad) |
| Audio | AAC 320 kbps estéreo |
| Contenedor | MP4 |
| Subtítulos | Subir SRT por separado — NO quemar en el vídeo |

### Instagram Reels / TikTok — 9:16

| Parámetro | Valor |
|-----------|-------|
| Resolución | 1080 × 1920 |
| FPS | 25 |
| Codec | H.264 |
| Bitrate | 8-12 Mbps |
| Audio | AAC 256 kbps estéreo |
| Contenedor | MP4 |
| Subtítulos | Quemados en el vídeo (karaoke style) |
| Safe zone | Mantener contenido entre px 250 y px 1670 del frame |

---

## Checklist pre-entrega

### Técnico

- [ ] Resolución y FPS correctos según plataforma destino
- [ ] Sin clipping de audio (ningún pico por encima de -1 dBFS)
- [ ] Niveles LUFS verificados (Youlean Loudness Meter — plugin gratuito)
- [ ] Primero y último frame no son negros accidentales
- [ ] Safe zones respetadas (especialmente en 9:16)
- [ ] Subtítulos revisados manualmente línea por línea
- [ ] Sin fotograma congelado ni salto de audio
- [ ] Archivo reproducido completo en VLC antes de subir

### Contenido

- [ ] URL visible en el frame de cierre: projecttrack.app
- [ ] CTA claro en los últimos 5 segundos
- [ ] Nombre del producto correcto en todos los textos en pantalla
- [ ] Ninguna pantalla muestra datos reales o sensibles de clientes
- [ ] Estadísticas mostradas verificadas o son aproximaciones honestas

### Legal

- [ ] Licencias de música descargadas y guardadas en carpeta del proyecto
- [ ] Fuentes tipográficas verificadas como libres para uso comercial
- [ ] Stock footage con licencia comercial verificada

### Plataforma

- [ ] Thumbnail 1280×720 preparado para YouTube (diferente del primer frame)
- [ ] Descripción con keywords lista para copiar en YouTube
- [ ] Para LinkedIn: texto del post (150-200 palabras) + SRT listos
- [ ] Para Reels: primeros 3 segundos funcionan sin audio

---

## Calendario de lanzamiento

| Día | Plataforma | Acción |
|-----|-----------|--------|
| Martes | LinkedIn | Video principal + post largo |
| Miércoles | Instagram | Reel corto (9:16 reencuadrado) |
| Jueves | LinkedIn | Post de texto con el hook + link al vídeo del martes |
| Viernes | YouTube | Publicar (subido el jueves, programado) |

**Truco LinkedIn:** Publicar el enlace a la web en el **primer comentario**, no en el cuerpo del post. LinkedIn penaliza los enlaces en el post — el alcance orgánico cae un 70%.