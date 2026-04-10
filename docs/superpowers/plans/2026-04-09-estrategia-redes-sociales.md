# Estrategia Redes Sociales — Plan de Ejecución

> **Para agentes:** REQUIRED SUB-SKILL: Usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de casilla (`- [ ]`) para seguimiento.

**Objetivo:** Generar todo el contenido listo para publicar en LinkedIn, Twitter/X e Instagram durante las 4 semanas de lanzamiento de ProjectTrack.

**Enfoque:** Contenido organizado por plataforma y semana. Cada tarea produce copys, estructuras de carruseles y prompts de imágenes listos para usar. Se aplica en todo el principio "estimamos, no facturamos".

**Stack:** Agentes `marketing-content-creator`, `marketing-linkedin-content-creator`, `marketing-twitter-engager`, `marketing-instagram-curator`, `design-carousel-growth-engine`, `design-image-prompt-engineer`.

**Spec de referencia:** `docs/superpowers/specs/2026-04-09-estrategia-redes-sociales-design.md`

---

## Reglas globales (aplicar en TODAS las tareas)

- Nunca decir: "calcula exactamente lo que debes a Hacienda", "sabe cuánto le debes a Hacienda", "sustituye a tu gestor"
- Siempre decir: "estimación orientativa", "control de ingresos y gastos", "organización financiera"
- Disclaimer obligatorio en contenido fiscal: *"Estimación orientativa. Depende de los datos introducidos. No sustituye asesoramiento profesional."*
- Tono LinkedIn: profesional y directo (datos, hechos, resultados)
- Tono Instagram/Twitter: cercano y educativo (como un amigo que sabe de finanzas)
- URL de la herramienta: https://project-track-ruby.vercel.app
- Plan gratuito: Starter (sin coste) — Plan de pago: PRO (14,99€/mes)

---

## Estructura de archivos a crear

```
docs/contenido/
├── semana-1/
│   ├── linkedin.md          # 5 posts LinkedIn semana 1
│   ├── twitter.md           # 7 tweets/hilos Twitter semana 1
│   ├── instagram.md         # 5 posts + stories Instagram semana 1
│   └── prompts-imagenes.md  # Prompts para generar imágenes semana 1
├── semana-2/
│   ├── linkedin.md
│   ├── twitter.md
│   ├── instagram.md
│   └── prompts-imagenes.md
├── semana-3/
│   ├── linkedin.md
│   ├── twitter.md
│   ├── instagram.md
│   └── prompts-imagenes.md
├── semana-4/
│   ├── linkedin.md
│   ├── twitter.md
│   ├── instagram.md
│   └── prompts-imagenes.md
└── calendario-editorial.md  # Calendario completo con fechas y orden de publicación
```

---

## Tarea 1: Contenido LinkedIn — Semana 1 (Siembra)

**Archivos:**
- Crear: `docs/contenido/semana-1/linkedin.md`

**Objetivo de la semana:** Presentar ProjectTrack y posicionarse como referente de organización financiera para autónomos.

- [ ] **Paso 1: Generar los 5 posts de LinkedIn**

Crear `docs/contenido/semana-1/linkedin.md` con exactamente estos 5 posts en formato listo para copiar y pegar:

**Post 1 (Lunes) — El problema:**
```
El problema no es que los autónomos no sepan de números.
Es que nadie les enseña a organizarlos.

Cada trimestre, miles de autónomos en España se llevan la misma sorpresa:
→ Ingresos que no cuadran
→ Gastos que olvidaron apuntar
→ Una estimación de IVA que no habían previsto

No es falta de esfuerzo. Es falta de sistema.

¿Cómo llevas tú la gestión de tu negocio?

#Autónomos #GestiónFinanciera #España
```

**Post 2 (Martes) — Presentación de ProjectTrack:**
```
Hoy presento ProjectTrack.

Una herramienta que construí porque yo mismo necesitaba:
→ Ver mis proyectos activos y cuánto factura cada uno
→ Controlar ingresos y gastos en un solo sitio
→ Tener una estimación de cuánto reservar para Hacienda cada trimestre

No es un software de facturación. No reemplaza a tu gestor.
Es la capa de control que faltaba entre tu trabajo y tu gestor.

Plan Starter gratuito disponible hoy.
🔗 [enlace en bio]

#ProjectTrack #Autónomos #ControlFinanciero
```

**Post 3 (Miércoles) — Educación fiscal:**
```
3 gastos que los autónomos suelen olvidar deducir:

1. Suscripciones digitales de trabajo (Notion, Figma, Adobe...)
2. Parte proporcional del móvil si lo usas para el negocio
3. Formación relacionada con tu actividad profesional

Cada euro no deducido es dinero que pagas de más.
Tu gestor puede ayudarte a validarlos — pero primero tienes que tenerlos apuntados.

¿Cuántos tickets del último trimestre no has registrado todavía?

#Autónomos #GastoDeducible #IVA
```

**Post 4 (Jueves) — Antes/después:**
```
Antes de ProjectTrack:
→ Excel con 3 pestañas que nadie entiende
→ Tickets en una carpeta de fotos del móvil
→ Llamada urgente al gestor el último día del trimestre

Con ProjectTrack:
→ Proyectos con presupuesto y estado en tiempo real
→ OCR: sube la foto del ticket, extrae los datos automáticamente
→ Estimación orientativa de reserva fiscal actualizada cada semana

Mismo negocio. Mucho menos estrés.

#Productividad #Autónomos #ProjectTrack
```

**Post 5 (Viernes) — CTA Starter:**
```
Si llegas al final de la semana sin saber exactamente cuánto has ingresado este mes... esta herramienta es para ti.

ProjectTrack — plan Starter completamente gratuito.

✓ Gestión de proyectos
✓ Control de ingresos y gastos
✓ Estimación de reserva fiscal (orientativa)
✓ Dashboard con tus números en tiempo real

Sin tarjeta. Sin compromiso.

🔗 [enlace en bio]

#ProjectTrack #Autónomos #GratisParaSiempre
```

- [ ] **Paso 2: Revisar que ningún post incumple las reglas globales**

Verificar que no aparece: "exactamente lo que debes", "calcula tus impuestos", "sustituye al gestor". Si aparece, corregir.

- [ ] **Paso 3: Guardar el archivo**

---

## Tarea 2: Contenido Twitter/X — Semana 1 (Siembra)

**Archivos:**
- Crear: `docs/contenido/semana-1/twitter.md`

- [ ] **Paso 1: Generar tweets y hilo de lanzamiento**

Crear `docs/contenido/semana-1/twitter.md` con el siguiente contenido:

**Tweet 1 (Lunes):**
```
¿Sabes cuánto IVA has repercutido este mes?

Si la respuesta es "creo que..." tienes un problema de organización, no de contabilidad.

Un sistema simple lo resuelve. Tu gestor te lo agradecerá.
```

**Tweet 2 (Martes):**
```
Hoy lanzamos ProjectTrack 🚀

→ Gestión de proyectos con presupuesto real
→ Control de ingresos y gastos desglosados
→ OCR: foto del ticket → datos extraídos en segundos
→ Estimación orientativa de reserva fiscal trimestral

Plan Starter gratuito. Sin tarjeta.

🔗 [enlace]
```

**Hilo (Miércoles) — "Por qué construí ProjectTrack":**
```
Tweet 1/6
Llevo X años como autónomo en España.
Y cada trimestre era igual: estrés, prisas y la sensación de no tener nada bajo control.
No era falta de ganas. Era falta de herramienta. 🧵

Tweet 2/6
El problema con la mayoría de software de gestión:
→ O es demasiado complejo (pensado para empresas)
→ O es solo facturación (y yo necesitaba más)
Lo que yo necesitaba era algo intermedio.

Tweet 3/6
Necesitaba saber:
→ Cuánto está generando cada proyecto
→ Si estoy ganando o perdiendo en el mes
→ Cuánto debería apartar para el próximo trimestre (orientativamente)
Sin llamar a mi gestor cada semana.

Tweet 4/6
Así nació ProjectTrack.
No es un software de facturación.
No reemplaza a tu gestor.
Es la capa de control que faltaba entre tu trabajo diario y tu gestor.

Tweet 5/6
Lo que puedes hacer con ProjectTrack:
✓ Gestionar proyectos con presupuesto y estado
✓ Registrar ingresos y gastos con desglose IVA/IRPF
✓ Subir tickets con OCR inteligente
✓ Ver una estimación de tu reserva fiscal trimestral

Tweet 6/6
Plan Starter completamente gratuito.
Si eres autónomo o tienes una pequeña empresa en España y odias no tener tus números bajo control...
Pruébalo hoy 👇
🔗 [enlace]
```

**Tweet 3 (Jueves):**
```
El autónomo que llega al trimestre organizado:
✓ Tiene todos sus tickets registrados
✓ Sabe cuánto ha ingresado y gastado
✓ Tiene una estimación de lo que necesita reservar
✓ Llama a su gestor con los datos ya preparados

¿Eres tú? ¿O todavía usas Excel?
```

**Tweet 4 (Viernes) — CTA:**
```
Esta semana lanzamos ProjectTrack.

Si eres autónomo en España y quieres controlar tus proyectos, ingresos y gastos sin volverte loco...

👉 Plan Starter gratuito disponible ahora
🔗 [enlace]

RT si conoces a alguien que lo necesita 🙏
```

- [ ] **Paso 2: Revisar reglas globales y guardar**

---

## Tarea 3: Contenido Instagram — Semana 1 (Siembra)

**Archivos:**
- Crear: `docs/contenido/semana-1/instagram.md`

- [ ] **Paso 1: Generar posts y estructura de carruseles**

Crear `docs/contenido/semana-1/instagram.md` con:

**Post 1 (Lunes) — Carrusel educativo:**
```
Título del carrusel: "5 señales de que necesitas organizar tu negocio"

Slide 1 (portada):
Imagen: fondo oscuro, texto grande
"¿Tu negocio está fuera de control?"
Subtítulo: "5 señales que no deberías ignorar"
@projecttrack.es

Slide 2: "No sabes cuánto has ingresado este mes sin abrir Excel"
Slide 3: "Tienes tickets y facturas sin registrar de hace semanas"
Slide 4: "Llegas al trimestre sin saber cuánto reservar para Hacienda"
Slide 5: "No sabes qué proyecto te genera más dinero"
Slide 6: "Tu gestor siempre te pide cosas a última hora"
Slide 7 (CTA): "Hay una forma más tranquila de llevar tu negocio. ProjectTrack — empieza gratis. 🔗 Link en bio"

Caption:
¿Te has reconocido en alguna? 👀

La buena noticia: no necesitas ser un experto en contabilidad. Solo necesitas un sistema.

ProjectTrack te ayuda a gestionar tus proyectos, controlar ingresos y gastos, y tener una estimación de cuánto reservar para Hacienda — todo en un mismo sitio.

Plan Starter gratuito 👉 link en bio

#Autónomos #Freelance #GestiónFinanciera #PymesEspaña #Emprendedores
```

**Post 2 (Martes) — Reveal del producto:**
```
Caption:
Esto es ProjectTrack 👇

Una herramienta creada para autónomos y pequeñas empresas en España que quieren tener su negocio bajo control.

✓ Gestión de proyectos
✓ Control de ingresos y gastos
✓ OCR: sube el ticket, extrae los datos
✓ Estimación de reserva fiscal (orientativa)
✓ Dashboard con todo en tiempo real

No factura. No reemplaza a tu gestor.
Complementa tu trabajo para que llegues al trimestre sin sorpresas.

Plan Starter gratuito 👉 link en bio

#ProjectTrack #Autónomos #España
```

**Post 3 (Miércoles) — Carrusel educativo:**
```
Título: "¿Qué es el IVA repercutido y el IVA soportado?"

Slide 1 (portada): "IVA: lo que cobras vs lo que pagas"
Slide 2: "IVA repercutido = el IVA que añades a tus facturas"
Slide 3: "IVA soportado = el IVA que pagas en tus gastos"
Slide 4: "Cada trimestre, declaras la diferencia"
Slide 5: "Si repercutes más de lo que soportas → pagas a Hacienda"
Slide 6: "Si soportas más de lo que repercutes → Hacienda te devuelve"
Slide 7 (CTA): "ProjectTrack registra ambos automáticamente. Estimación orientativa incluida. 🔗 Link en bio"

Caption:
Entender el IVA es más fácil de lo que parece 👆

Lo importante: tener todos tus ingresos y gastos registrados para que tu gestor pueda hacer bien su trabajo.

ProjectTrack te ayuda a llevar ese control. Plan gratuito 👉 link en bio

#IVA #Autónomos #EducaciónFiscal #Freelance
```

**Post 4 (Jueves) — Reel 30s:**
```
Guión del Reel:
[0-3s] Hook: "¿Sabes cuánto has ganado este mes?" (texto en pantalla)
[3-8s] Mostrar dashboard de ProjectTrack con gráfico de ingresos
[8-15s] Mostrar gestión de proyectos activos
[15-22s] Mostrar OCR: foto de ticket → datos extraídos
[22-28s] Mostrar estimación fiscal con disclaimer visible
[28-30s] CTA: "Empieza gratis. Link en bio."

Audio sugerido: trending de momento, ritmo rápido

Caption:
Tu negocio en números, en tiempo real 📊

¿Ves lo del disclaimer de estimación fiscal? Importante: ProjectTrack te da una orientación, no el cálculo exacto. Para eso está tu gestor 😉

Pruébalo gratis 👉 link en bio

#ProjectTrack #Autónomos #App #Finanzas
```

**Post 5 (Viernes) — CTA:**
```
Caption:
Lleva toda la semana publicando sobre organización financiera para autónomos.

¿La razón? Porque es el problema número 1 que tienen los autónomos en España y casi nadie habla de él.

ProjectTrack nació para resolverlo.

→ Gestiona tus proyectos
→ Controla lo que entra y lo que sale
→ Estima cuánto reservar para Hacienda (orientativamente)
→ Llega al trimestre sin sorpresas

Plan Starter completamente gratis. Sin tarjeta.

🔗 Link en bio

¿Lo conocías? Cuéntame en comentarios 👇

#ProjectTrack #Autónomos #Freelance #España #Lanzamiento
```

**Stories de la semana (lunes a viernes):**
```
Lunes: Encuesta — "¿Cómo llevas tus cuentas?" A) Excel B) App C) Mi gestor lo hace D) Caos total
Martes: Countdown + "Hoy presentamos algo nuevo 👀"
Miércoles: Quiz — "¿Qué es el IVA soportado?" con 4 opciones
Jueves: Pantallazos del dashboard con "¿Lo conocías?"
Viernes: Link directo al plan Starter + "Esta semana es gratis para siempre 🎉"
```

- [ ] **Paso 2: Revisar reglas globales y guardar**

---

## Tarea 4: Prompts de imágenes — Semana 1

**Archivos:**
- Crear: `docs/contenido/semana-1/prompts-imagenes.md`

- [ ] **Paso 1: Generar prompts para Midjourney/DALL-E**

Crear `docs/contenido/semana-1/prompts-imagenes.md` con:

```markdown
# Prompts de imágenes — Semana 1

## Estilo base de marca ProjectTrack
Paleta: azules oscuros (#0f172a, #1e3a5f), acentos en azul eléctrico (#3b82f6), blanco
Estilo: minimalista, profesional, moderno, sin fotografías de stock genéricas
Tipografía en imágenes: sans-serif limpia

---

## Post 1 LinkedIn — "El problema del autónomo"
**Prompt Midjourney:**
`A Spanish freelancer looking stressed at a laptop with multiple spreadsheets open, minimalist flat illustration, dark navy background, blue accents, professional financial management app concept, clean modern design, no text --ar 4:5 --style raw`

**Alternativa DALL-E:**
`Minimalist illustration of a freelancer overwhelmed by financial documents and spreadsheets, dark blue color scheme, professional clean style, Spain freelancer concept`

---

## Portada carrusel Instagram — "5 señales"
**Prompt Midjourney:**
`Dark minimalist poster design, large bold white text placeholder, electric blue accent lines, professional business app aesthetic, gradient dark navy background, modern typography layout --ar 4:5 --style raw`

---

## Reel thumbnail — Dashboard demo
**Indicación:** Usar captura de pantalla real del dashboard de ProjectTrack en https://project-track-ruby.vercel.app
Añadir: texto superpuesto "Tu negocio en números" + logo ProjectTrack

---

## Post Twitter — Hilo de lanzamiento
**No requiere imagen especial.** Usar captura del dashboard o logo.

---

## Stories Instagram
**Prompt fondo stories (formato 9:16):**
`Dark navy gradient background for Instagram story, minimal professional design, space for text overlay, electric blue subtle geometric elements, clean modern fintech aesthetic --ar 9:16`
```

- [ ] **Paso 2: Guardar el archivo**

---

## Tarea 5: Contenido LinkedIn — Semana 2 (Demo)

**Archivos:**
- Crear: `docs/contenido/semana-2/linkedin.md`

- [ ] **Paso 1: Generar 5 posts de demo**

Crear `docs/contenido/semana-2/linkedin.md`:

**Post 1 (Lunes) — Demo OCR:**
```
Uno de los problemas más comunes de los autónomos: los tickets.

Fotos en el móvil, emails sin archivar, papel arrugado en el bolsillo.

En ProjectTrack, subes la foto del ticket y la IA extrae automáticamente:
→ Nombre del proveedor
→ NIF
→ Base imponible
→ IVA

Sin teclear nada. Sin perder tiempo.

¿Cuántos tickets tienes sin registrar ahora mismo?

#OCR #Autónomos #ProjectTrack #InteligenciaArtificial
```

**Post 2 (Martes) — Dashboard:**
```
Tu negocio debería responder estas 5 preguntas en menos de 10 segundos:

1. ¿Cuánto he ingresado este mes?
2. ¿Cuánto he gastado?
3. ¿Cuál es mi beneficio neto real?
4. ¿Qué proyectos están activos y cuánto generan?
5. ¿Cuánto debería reservar para el próximo trimestre? (estimación)

Si tardas más de 10 segundos en responderlas, tu sistema de control no está funcionando.

En ProjectTrack, el dashboard te da estas respuestas en tiempo real.

#Dashboard #ControlFinanciero #Autónomos
```

**Post 3 (Miércoles) — Gestión de proyectos:**
```
¿Sabes cuál de tus clientes te da más trabajo por menos dinero?

En ProjectTrack puedes ver, por proyecto:
→ Presupuesto acordado vs ingresos registrados
→ Gastos asociados al proyecto
→ Beneficio neto real por cliente

Saber esto cambia cómo negocias tu próximo contrato.

#GestiónProyectos #Autónomos #ProjectTrack
```

**Post 4 (Jueves) — Estimación fiscal:**
```
La pregunta que más estrés genera entre autónomos cada 3 meses:

"¿Cuánto tengo que pagar a Hacienda?"

ProjectTrack no puede darte la respuesta exacta — eso lo hace tu gestor.
Lo que sí puede hacer es darte una estimación orientativa de cuánto deberías estar reservando, basada en los datos que introduces.

Una orientación. Una guía. Para que la sorpresa sea lo más pequeña posible.

*Estimación orientativa. Depende de los datos introducidos. Consulta siempre con tu asesor fiscal.*

#Hacienda #Autónomos #GestiónFinanciera
```

**Post 5 (Viernes) — CSV para gestor:**
```
Una cosa que aprenden todos los autónomos tarde o temprano:

Cuanto más organizado llegues a tu gestor, menos pagas en honorarios.

ProjectTrack genera reportes trimestrales en CSV con todos tus ingresos, gastos e IVA desglosado — listos para enviárselos a tu gestor.

Tú te organizas. Tu gestor trabaja más rápido. Todos contentos.

*Los reportes son orientativos y no sustituyen la revisión de un profesional.*

#Gestoría #Autónomos #ProjectTrack
```

- [ ] **Paso 2: Revisar reglas globales y guardar**

---

## Tarea 6: Contenido Twitter/X — Semana 2 (Demo)

**Archivos:**
- Crear: `docs/contenido/semana-2/twitter.md`

- [ ] **Paso 1: Generar tweets**

Crear `docs/contenido/semana-2/twitter.md`:

**Tweet 1 (Lunes) — OCR:**
```
¿Cuántos tickets tienes en la galería del móvil sin registrar?

Con ProjectTrack: foto del ticket → IA extrae proveedor, NIF e IVA automáticamente.

Menos tiempo apuntando. Más tiempo trabajando.

[GIF del OCR en acción]
```

**Tweet 2 (Martes) — Dashboard:**
```
Tu negocio en 5 gráficos:
→ Ingresos vs gastos
→ Beneficio neto
→ Categorías de gasto
→ Proyectos activos
→ Estimación fiscal trimestral (orientativa)

Todo en tiempo real. Todo en un solo sitio.

[captura del dashboard]
```

**Hilo (Miércoles) — "5 funcionalidades que uso cada semana":**
```
1/6 Uso ProjectTrack cada semana para gestionar mi negocio. Estas son las 5 funcionalidades que más me aportan 🧵

2/6 OCR de tickets
Subo la foto, extrae los datos. Sin teclear. Funciona con facturas en PDF también. Ahorra ~20 min/semana solo en esto.

3/6 Dashboard de proyectos
Veo de un vistazo qué proyectos están activos, cuánto presupuesto queda y si el cliente ha pagado. Sin buscar en emails.

4/6 Desglose IVA/IRPF en ingresos
Cada factura que registro se desglosa automáticamente. Sé exactamente cuánto es base, cuánto es IVA, cuánto es retención.

5/6 Estimación de reserva fiscal
Cada trimestre tengo una estimación orientativa de cuánto necesito reservar. No es el número exacto — eso lo calcula mi gestor. Es una guía para no llevarme sorpresas.

6/6 CSV para el gestor
Exporto el trimestre en segundos. Mi gestor recibe los datos organizados. Ahorro tiempo y dinero en gestoría.
¿Quieres probarlo? Plan Starter gratis 👉 [enlace]
```

**Tweet 3 (Jueves):**
```
"¿Y la estimación fiscal es exacta?"

No. Y lo decimos claramente.

ProjectTrack te da una orientación de cuánto reservar para Hacienda, basada en los datos que introduces.

El cálculo exacto lo hace tu gestor. Nosotros te ayudamos a llegar organizado.

Honestidad ante todo.
```

**Tweet 4 (Viernes):**
```
Exportar tu trimestre para el gestor:
1. Abre ProjectTrack
2. Ve a Reportes
3. Selecciona el trimestre
4. Descarga CSV
5. Envía a tu gestor

Listo en menos de 2 minutos.

*Reporte orientativo. Revisión profesional siempre recomendada.*
```

- [ ] **Paso 2: Revisar y guardar**

---

## Tarea 7: Contenido Instagram — Semana 2 (Demo)

**Archivos:**
- Crear: `docs/contenido/semana-2/instagram.md`

- [ ] **Paso 1: Generar posts**

Crear `docs/contenido/semana-2/instagram.md`:

**Post 1 (Lunes) — Reel OCR:**
```
Guión Reel (30-45s):
[0-3s] Hook en texto: "Tienes 47 fotos de tickets en el móvil. Yo también."
[3-8s] Mostrar galería de fotos de tickets (recreada)
[8-15s] Abrir ProjectTrack → subir foto → ver cómo extrae los datos
[15-25s] Ver el gasto registrado automáticamente en el dashboard
[25-30s] Texto: "Así de fácil. Plan gratuito. Link en bio."

Caption:
¿Cuántos tickets tienes sin registrar? 🙋

Spoiler: ProjectTrack tiene OCR inteligente. Subes la foto, extrae el proveedor, el NIF y el IVA automáticamente.

Menos tiempo apuntando. Más control.

🔗 Link en bio — Plan Starter gratuito

#ProjectTrack #OCR #Autónomos #Freelance #Productividad
```

**Post 2 (Martes) — Carrusel Dashboard:**
```
Título: "Tu negocio en números (sin Excel)"

Slide 1: "¿Sabes cuánto has ganado este mes de verdad?"
Slide 2: Captura real del gráfico de ingresos vs gastos
Slide 3: "Ingresos registrados. Gastos categorizados. En tiempo real."
Slide 4: Captura del dashboard de proyectos
Slide 5: "¿Qué proyecto te genera más? ¿Cuál te cuesta más?"
Slide 6: Captura de la estimación fiscal CON disclaimer visible
Slide 7: "Una estimación de cuánto reservar para Hacienda. Orientativa, siempre con tu gestor."
Slide 8 (CTA): "Prueba ProjectTrack gratis. Link en bio."

Caption:
Este es el dashboard de ProjectTrack 👆

5 gráficos. Toda la información de tu negocio. Sin hojas de cálculo.

Y sí, la estimación fiscal es orientativa — lo decimos claro porque queremos que confíes en la herramienta, no que la uses para sustituir a tu gestor 😉

🔗 Link en bio

#Dashboard #Autónomos #GestiónFinanciera #ProjectTrack
```

**Post 3 (Miércoles) — Carrusel gestión de proyectos:**
```
Título: "¿Sabes cuánto ganas por cliente?"

Slide 1: "El cliente más activo no siempre es el más rentable"
Slide 2: "En ProjectTrack, cada proyecto tiene: presupuesto, ingresos registrados, gastos asociados"
Slide 3: Captura de vista de proyecto
Slide 4: "Beneficio neto real por proyecto. En tiempo real."
Slide 5 (CTA): "Prueba gratis. Link en bio."

Caption:
¿Cuánto ganas realmente por cada cliente? 🤔

Spoiler: muchos autónomos se llevan sorpresas cuando hacen los números de verdad.

Con ProjectTrack lo ves de un vistazo. Plan gratuito 👉 link en bio

#GestiónProyectos #Autónomos #Rentabilidad
```

**Post 4 (Jueves) — Estimación fiscal con disclaimer:**
```
Caption:
Hablemos del módulo que más preguntas genera 👇

La estimación fiscal trimestral de ProjectTrack.

¿Qué hace?
→ Calcula una estimación orientativa de tu IVA e IRPF basándose en los datos que introduces

¿Qué NO hace?
→ No calcula tu declaración exacta
→ No reemplaza a tu asesor fiscal
→ No garantiza el resultado final

¿Por qué lo usamos entonces?
Porque llegar al trimestre con una orientación es infinitamente mejor que llegar sin ninguna.

Tú introduces los datos. ProjectTrack te da una guía. Tu gestor hace el trabajo final.

Cada uno en su rol.

*Estimación orientativa. No sustituye asesoramiento profesional.*

#GestiónFiscal #Autónomos #Hacienda #Honestidad
```

**Post 5 (Viernes) — CSV/Reporte:**
```
Guión Reel (20s):
[0-3s]: "Así de fácil envías el trimestre a tu gestor"
[3-15s]: Screencast: Ir a Reportes → Seleccionar trimestre → Descargar CSV → "Listo"
[15-20s]: Texto: "Organizado. Rápido. Sin excusas."

Caption:
Tu gestor te lo va a agradecer 😄

ProjectTrack genera el reporte trimestral con todos tus ingresos, gastos e IVA desglosado. Descarga el CSV y se lo envías.

*Reporte orientativo. Tu gestor siempre debe revisarlo.*

🔗 Link en bio — Plan gratuito

#Gestoría #Autónomos #ProjectTrack #Organización
```

- [ ] **Paso 2: Revisar y guardar**

---

## Tarea 8: Contenido — Semana 3 (Conversión Starter)

**Archivos:**
- Crear: `docs/contenido/semana-3/linkedin.md`
- Crear: `docs/contenido/semana-3/twitter.md`
- Crear: `docs/contenido/semana-3/instagram.md`

- [ ] **Paso 1: LinkedIn semana 3**

Crear `docs/contenido/semana-3/linkedin.md` con 5 posts enfocados en:
- Comparativa Excel vs ProjectTrack (honesta, sin atacar a Excel)
- Respuesta a objeciones: "Ya tengo gestor", "Es muy caro", "No tengo tiempo de aprender otra app"
- Plan Starter: qué incluye exactamente
- Caso de uso: freelance de diseño gráfico
- CTA fuerte final: registrarse en Starter

Ejemplo Post 1 — Excel vs ProjectTrack:
```
Excel no es el problema. La falta de sistema, sí.

Excel puede funcionar perfectamente para llevar las cuentas de un autónomo.
El problema es que casi nadie lo usa bien:
→ Versiones distintas en cada dispositivo
→ Fórmulas que se rompen
→ Sin separación entre proyectos
→ Sin desglose automático de IVA/IRPF

ProjectTrack no es mejor que Excel. Es más específico.
Está diseñado exactamente para lo que necesita un autónomo en España.

¿Usas Excel para tu gestión? ¿Cómo te funciona?

#Excel #Autónomos #GestiónFinanciera
```

- [ ] **Paso 2: Twitter semana 3**

Crear `docs/contenido/semana-3/twitter.md` con:
- 5 tweets respondiendo objeciones frecuentes
- 1 hilo: "Por qué el plan Starter es gratis para siempre"
- 1 tweet CTA final de semana

- [ ] **Paso 3: Instagram semana 3**

Crear `docs/contenido/semana-3/instagram.md` con:
- Carrusel: "Excel vs ProjectTrack — comparativa honesta"
- Carrusel: "¿Tienes gestor? ProjectTrack lo complementa, no lo reemplaza"
- Post: qué incluye el plan Starter
- Reel: tour de 60s por la app
- Post CTA: "Empieza gratis hoy"
- Stories: FAQ formato pregunta/respuesta

- [ ] **Paso 4: Revisar reglas globales y guardar los 3 archivos**

---

## Tarea 9: Contenido — Semana 4 (Conversión PRO)

**Archivos:**
- Crear: `docs/contenido/semana-4/linkedin.md`
- Crear: `docs/contenido/semana-4/twitter.md`
- Crear: `docs/contenido/semana-4/instagram.md`

- [ ] **Paso 1: LinkedIn semana 4**

Crear `docs/contenido/semana-4/linkedin.md` con 5 posts:
- Starter vs PRO: diferencias concretas
- ROI de 14,99€/mes: cuánto vale para un autónomo
- Testimonio de usuario PRO (formato historia)
- Funciones exclusivas PRO con demos
- Oferta especial de lanzamiento con urgencia y CTA

- [ ] **Paso 2: Twitter semana 4**

Crear `docs/contenido/semana-4/twitter.md` con:
- 5 tweets sobre funciones PRO
- 1 hilo: "Lo que cambia cuando pasas a PRO"
- 1 tweet oferta especial

- [ ] **Paso 3: Instagram semana 4**

Crear `docs/contenido/semana-4/instagram.md` con:
- Carrusel: Starter vs PRO visual
- Reel: funciones PRO en acción
- Post: testimonio visual
- Carrusel: "¿14,99€/mes vale la pena?" con cálculo de ROI
- Post: oferta especial de lanzamiento

- [ ] **Paso 4: Revisar y guardar los 3 archivos**

---

## Tarea 10: Prompts de imágenes — Semanas 2, 3 y 4

**Archivos:**
- Crear: `docs/contenido/semana-2/prompts-imagenes.md`
- Crear: `docs/contenido/semana-3/prompts-imagenes.md`
- Crear: `docs/contenido/semana-4/prompts-imagenes.md`

- [ ] **Paso 1: Generar prompts para cada semana**

Cada archivo debe incluir prompts específicos para:
- Portadas de carruseles Instagram
- Thumbnails de Reels
- Imágenes para posts LinkedIn
- Fondos para Stories
- Siempre con el estilo base de ProjectTrack (azules oscuros, minimalista, profesional)

- [ ] **Paso 2: Guardar los 3 archivos**

---

## Tarea 11: Calendario editorial completo

**Archivos:**
- Crear: `docs/contenido/calendario-editorial.md`

- [ ] **Paso 1: Crear el calendario con fechas exactas**

Crear `docs/contenido/calendario-editorial.md` con una tabla completa:

```markdown
# Calendario Editorial — Lanzamiento ProjectTrack

## Instrucciones de publicación
- LinkedIn: publicar entre 8-9h o 12-13h (hora España)
- Twitter/X: publicar entre 9-10h o 18-19h
- Instagram: publicar entre 12-14h o 19-21h
- Stories Instagram: publicar cada día entre 10-11h

## Semana 1 — [INSERTAR FECHA DE INICIO]

| Fecha | Red | Tipo | Título/Tema | Estado |
|-------|-----|------|-------------|--------|
| Lun DD/MM | LinkedIn | Post | El problema del autónomo desordenado | ⬜ |
| Lun DD/MM | Twitter | Tweet | Tip IVA trimestral | ⬜ |
| Lun DD/MM | Instagram | Carrusel | "5 señales de que necesitas organizar tu negocio" | ⬜ |
| Lun DD/MM | Instagram | Story | Encuesta: ¿cómo llevas tus cuentas? | ⬜ |
| Mar DD/MM | LinkedIn | Post | Presentación oficial ProjectTrack | ⬜ |
...
[continuar para las 4 semanas completas]
```

- [ ] **Paso 2: Añadir sección de herramientas de publicación recomendadas**

```markdown
## Herramientas recomendadas para programar publicaciones
- **Buffer** (gratis hasta 3 redes): para programar LinkedIn, Twitter, Instagram
- **Later** (alternativa para Instagram): mejor para planificar feed visual
- **Metricool** (opción española): analytics en español + programación

## Proceso semanal recomendado
1. Lunes: revisar el contenido de la semana en `docs/contenido/semana-X/`
2. Generar las imágenes con los prompts de `prompts-imagenes.md`
3. Programar todos los posts del lunes al jueves
4. Publicar el viernes en tiempo real para aprovechar interacción
5. Revisar métricas el domingo y ajustar la semana siguiente
```

- [ ] **Paso 3: Guardar el calendario**

---

## Revisión final del plan

- [ ] Verificar que todos los archivos de `docs/contenido/` están creados
- [ ] Confirmar que ningún contenido viola las reglas globales (estimamos, no calculamos)
- [ ] Confirmar que todos los disclaimers fiscales están presentes
- [ ] Confirmar que los CTAs apuntan correctamente a https://project-track-ruby.vercel.app
- [ ] Entregar resumen al usuario con próximos pasos
