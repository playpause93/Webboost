# Brief — Barrido de claims de Ironwood en todo el sitio

**Fecha:** 20 de agosto de 2026
**Rama:** `fix/claims-ironwood-sitio`
**Base:** `main`, después del merge de la Fase 0 de `/seo-local-logrono`
**Modelo:** Opus. Son sustituciones literales, no hace falta Fable.

---

## Por qué existe este brief

`/seo-local-logrono` ya está corregida. El barrido en solo lectura encontró los mismos claims obsoletos en **otros 19 archivos**, incluidos metadatos, JSON-LD y `llms.txt`.

Tres de esos sitios importan más que el texto visible:

- **`llms.txt`** es lo que leen ChatGPT, Gemini y Claude cuando alguien pregunta por WebBoost. Dice **56 reseñas** — dos versiones caducadas por detrás.
- **`caso-de-estudio.html`** lleva los claims dentro del **JSON-LD**: el dato falso está en datos estructurados, no solo en prosa.
- La tarjeta **"De invisible a…"** está copiada a mano en **11 archivos**.

---

## Regla de oro

Alcance cerrado: **solo sustituciones de texto**. Nada de diseño, nada de estructura, nada de CSS, nada de reescribir copy más allá de lo que se lista aquí.

Si un cambio obligara a tocar algo que no sea texto, **para y repórtalo**.

Todo lo que detectes fuera de alcance: **"detectado, no tocado"**.

---

## Los datos válidos (fuente única)

Export de Collac, consulta `carpinteria`, cuadrícula de 81 puntos sobre 49 km², **20 de agosto de 2026**:

| Métrica | Valor |
|---|---|
| GeoRank | **1 de 77** carpinterías |
| Puntos con visibilidad | **78 de 81** |
| Porcentaje de LocalPack | **70%** |
| Posición media | 3,5 |
| Reseñas | **71** → se escribe siempre **"+70"** o **"más de 70"** |
| Valoración | **4,9★** (coma, nunca punto) |
| Tiempo | **menos de 90 días** |

**Comparativa de sector** (misma cuadrícula), por si hace falta en algún texto: mediana de 5 reseñas, media de 10,1 sin Ironwood, valoración media 4,40, solo otra carpintería supera las 50 reseñas, el segundo mejor Pack Local es 52%.

### Prohibiciones permanentes

1. **Nunca "91 competidores".** Derogado. Son 77 carpinterías.
2. **Nunca "100% cobertura LocalPack"** ni "cobertura total en el LocalPack". Mezcla dos columnas distintas del CSV y además el 100% ya es falso. Si hace falta hablar de cobertura: "presente en 78 de los 81 puntos". Si hace falta hablar de Pack Local: "70%".
3. **Nunca un número fijo de reseñas.** Ni 56, ni 63, ni 67, ni 71. Siempre fórmula de suelo: **"+70"** o **"más de 70"**. Ha caducado cuatro veces ya.
4. **Nunca "invisible", "sin visibilidad", "0 reseñas", "sin posición en el LocalPack", "llamadas desde Google: 0"** ni ningún otro "antes" de Ironwood. No existe medición previa. Son claims inventados.
5. **Nunca `4.9` con punto.** En castellano va coma.

---

## Orden de ejecución

Por daño real, no por comodidad. **Un commit por bloque**, para poder revertir por partes.

### Bloque 1 — `llms.txt`

El más urgente y el más pequeño.

Localiza y corrige: `#1/91`, `100% cobertura`, `56 reseñas` y cualquier decimal con punto.

Repórtame el bloque completo de Ironwood antes y después. Si el archivo tiene fecha de actualización, ponla al día.

### Bloque 2 — `caso-de-estudio.html`

El que más carga.

- `<title>`, `meta description`, `og:`, `twitter:` y **JSON-LD (:421)**
- Cuerpo del texto, incluido **"Invisibles ante 91 competidores"**
- Cualquier `4.9`

**Aviso sobre el JSON-LD:** después de editarlo, valida que sigue siendo JSON sintácticamente correcto. Un JSON-LD roto es peor que uno con un dato viejo.

**Y una duda que quiero que me plantees, no que resuelvas:** si al quitar los claims inventados esa página se queda sin argumento, dímelo y decidimos. No la rellenes por tu cuenta.

### Bloque 3 — `index.html` y `consultor-seo-logrono/index.html`

La home y la réplica del bloque que ya arreglamos.

En `consultor-seo-logrono/` reutiliza exactamente las mismas sustituciones que aplicamos en `/seo-local-logrono` — incluido el bloque comparativo, si el bloque Antes/Después está replicado ahí. Si lo está, **avísame antes de sustituirlo** para confirmar que el bloque nuevo encaja en esa maqueta.

En `index.html`: meta description, `og:`, `twitter:`, JSON-LD y los cuatro puntos del cuerpo.

### Bloque 4 — Páginas de servicio

`seo-local.html`, `seo-la-rioja.html`, `seo-web.html`, `sobre-mi.html`, `blog.html`.

Claims en cuerpo y metadatos.

### Bloque 5 — `blog/seo-local-logrono.html` y los 11 artículos

En `blog/seo-local-logrono.html` (:525):

> …el resultado número 1 en Google Maps entre 91 competidores directos. Hoy tienen 63 reseñas con una valoración de 4,9 sobre 5 y cobertura total en el LocalPack de su zona.

Queda:

> …el resultado número 1 en Google Maps entre 77 carpinterías de su zona. Hoy tiene más de 70 reseñas con una valoración de 4,9 sobre 5 y aparece en 78 de los 81 puntos de la cuadrícula.

Ojo al singular: **"tiene"**, no "tienen". Y corrige la voz en plural de :521.

En los 11 artículos: solo la tarjeta **"De invisible a GeoRank #1"** del bloque de relacionados. Texto nuevo: **`Ironwood Soluciones · #1 entre 77 carpinterías`**.

---

## La decisión del componente replicado

Antes del Bloque 5, quiero que evalúes y **me lo cuentes sin ejecutar nada**:

Esa tarjeta está copiada a mano en 11 archivos. Corregirla once veces significa que la próxima vez que cambie un dato hay que corregirla once veces otra vez.

Mira si el build de CSS inline que ya existe permite extraerla a un parcial reutilizable. Dime el coste y el riesgo. **Si es caro o toca cosas fuera de alcance, se corrigen las once a mano y punto** — no es una excusa para meterse en una refactorización.

---

## INTOCABLES

- Cualquier `noindex` existente
- `action` de Formspree, redirecciones a `/gracias`, `id` de formularios
- GTM, `dataLayer`, enlaces `wa.me`
- Canonicals, `sitemap.xml`, redirecciones de `vercel.json`
- Estructura de encabezados: no cambies un `<h2>` de nivel al reescribirlo
- Enlaces internos
- Precios y plazos oficiales (60–90 días SEO Local; 2–3 meses / 6–12 meses SEO Web)
- Nomenclatura: "diagnóstico gratuito" gratis, "auditoría SEO" 150€. Nunca "auditoría gratuita"
- **La palabra "agencia" no entra en ningún texto nuevo**

---

## Verificación

Sobre las **URLs públicas del preview**, no sobre archivos locales.

**Deben dar cero:** `91 competidores`, `entre 91`, `63 reseñas`, `56 reseñas`, `100% cobertura`, `cobertura total`, `Cobertura LocalPack`, `4.9`, `De invisible`, `Invisibles ante`, `Sin visibilidad`, `0 reseñas`.

**Deben aparecer:** `77 carpinterías`, `+70` o `más de 70`, `4,9`.

Además:
- JSON-LD válido en todos los archivos donde se haya tocado
- Ningún enlace interno roto
- Los `noindex` donde estaban

El árbitro es Sergio en incógnito con Ctrl+F.

---

## Informe final

Un commit por bloque. Al terminar:

- Archivos tocados por bloque, con antes/después de cada claim
- Resultado de la verificación por negación sobre las URLs públicas
- Confirmación de JSON-LD válido
- Tu recomendación sobre el componente replicado
- Detectado y no tocado
- URL del preview

**No mergees.** El merge lo decide Sergio tras verificar.
