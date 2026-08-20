# Brief — Rediseño de /seo-local-logrono

**Fecha:** 20 de agosto de 2026
**Base:** `main` en `e3f3e88`
**Rama de trabajo:** `redesign/seo-local-logrono`
**Modelo recomendado:** Fable (esta página es la piloto del sistema visual que luego se propaga)

---

## Regla de oro

Alcance cerrado. Se toca **solo** `/seo-local-logrono` y los estilos que esa página use en exclusiva.

Si un cambio obligara a tocar un archivo compartido con otras páginas, **para y repórtalo antes de hacerlo**. No lo hagas por iniciativa propia.

Todo lo que detectes fuera de alcance: **"detectado, no tocado"** en el informe final. No lo arregles.

---

## INTOCABLES

No se modifican bajo ningún concepto:

- La URL `/seo-local-logrono`
- La etiqueta `noindex` de la página
- El contenedor de GTM y cualquier `dataLayer`
- El `action` de Formspree y la redirección a `/gracias`
- Los `id` de ambos formularios (el del final y el `-mid` de mitad de página)
- Los enlaces `wa.me` y sus números
- La lógica de consentimiento del banner de cookies y su texto legal
- El precio: 200€/mes
- Los plazos oficiales: primeras señales 3–6 semanas, consolidados 60–90 días
- La garantía: 90 días, devolución del primer mes

---

## FASE 0 — Correcciones de datos

**Obligatoria e independiente del diseño.** Hay claims publicados que no se sostienen con los datos. Esto se aplica aunque el rediseño se posponga.

### 0.1 — Textos confirmados (literal)

Estos los he verificado en capturas de la página en producción. Sustituye exacto:

| Actual | Nuevo |
|---|---|
| `#1 entre 91 competidores` | `#1 entre 77 carpinterías` |
| `ENTRE 91 COMPETIDORES` | `ENTRE 77 CARPINTERÍAS` |
| `63` (cifra del bloque de estadísticas) | `+70` |
| `RESEÑAS · 4.9★` | `RESEÑAS · 4,9★` |
| `100%` (cifra del bloque de estadísticas) | `78/81` |
| `COBERTURA LOCALPACK` | `PUNTOS DEL MAPA` |
| `Ironwood Soluciones: #1 en Google Maps entre 91 competidores, en menos de 90 días.` | `Ironwood Soluciones: #1 en Google Maps entre 77 carpinterías, en menos de 90 días.` |
| `Investigamos cómo buscan tus clientes en La Rioja y optimizamos para eso.` | `Investigo cómo buscan tus clientes en La Rioja y optimizo para eso.` |
| `Mantenemos la ficha activa con contenido que Google valora` | `Mantengo la ficha activa con contenido que Google valora` |

**Por qué el `100%` desaparece:** el export de Collac tiene dos columnas distintas, "Puntos con visibilidad" (78 de 81) y "Porcentaje de LocalPack" (70%). El claim publicado las mezclaba, y además el 100% ya no es cierto. Nunca vuelvas a escribir "100% cobertura LocalPack".

**Por qué `+70` y no `71`:** los números fijos se pudren. Esa cifra ya ha pasado por 56 → 63 → 67 → 71 en unos meses. La fórmula de suelo sobrevive sola.

### 0.2 — Bloque ANTES/DESPUÉS: se sustituye entero

El bloque actual dice, en la columna ANTES: "Sin visibilidad en Google Maps", "0 reseñas", "Sin posición en el LocalPack", "Llamadas desde Google: 0".

**Ninguno de esos cuatro datos existe.** No hay medición previa de Ironwood. Se eliminan.

Se sustituye por una comparativa con el sector, toda verificable contra el mismo export de Collac (consulta "carpinteria", cuadrícula de 81 puntos, 49 km², 20 de agosto de 2026):

**Título:** `Ironwood frente a las otras 76 carpinterías de la zona`

| Métrica | Ironwood | El resto del sector |
|---|---|---|
| Reseñas | +70 | mediana de 5 |
| Valoración | 4,9★ | media de 4,4★ |
| Presencia en el Pack Local | 70% de los puntos | 52% el segundo mejor |
| Negocios con más de 50 reseñas | — | 1 de 77 |

**Pie del bloque:** `Datos de la cuadrícula de 81 puntos sobre 49 km², agosto de 2026.`

Esto es más fuerte que el bloque inventado: una mediana de 5 reseñas frente a 70 dice más que cualquier "antes" sin medir.

### 0.3 — Barridos que debes hacer tú

No tengo la lista completa porque leí la página con un fetch que puede servir caché. **Localiza, repórtame lo que encuentres y espera confirmación antes de cambiar:**

1. **Voz en plural.** Busca en toda la página: `amos ` (estudiamos, trabajamos, diseñamos, medimos, investigamos, mantenemos, conseguimos, optimizamos), `nuestro`, `nuestra`, `nos `. WebBoost es un consultor, no una agencia: todo va en primera persona del singular. Incluye `<title>`, `meta description`, `og:`, JSON-LD y `alt`.
2. **Decimal con punto.** Busca `4.9` y cualquier otra cifra con punto decimal. En castellano va coma.
3. **Plazos vagos.** Busca en la FAQ cualquier fórmula tipo "las primeras señales aparecen antes" sin concretar. Debe decir **3–6 semanas**.
4. **`91`.** Búscalo en toda la página por si queda alguna instancia fuera de la tabla de arriba.

---

## FASE 1 — Sistema visual

El diagnóstico de Sergio es que la página "se ve muy estándar de IA". Tiene razón, y estas son las causas concretas, por orden de impacto.

### 1.1 — Fuera los emojis como iconos

La página usa ⚙️ 🔍 📝 💬 como iconos de sección. **Esto es lo que más delata.** Un emoji se renderiza distinto en cada sistema operativo y no forma parte de ningún sistema de diseño.

Sustitúyelos por SVG inline, trazo de 1,5px, un único set coherente, heredando `currentColor`. Sin relleno, sin color propio, sin caja de fondo.

Aplica a todos los iconos de la página, incluido el del formulario.

### 1.2 — El dorado, una vez por pantalla

Ahora mismo el dorado `#C9A035` está en el logo, en el botón fijo del header, en los tres CTA del hero, en el bloque de estadísticas entero, en los checks, en los bordes de tarjeta y con `box-shadow` de brillo en casi todos.

Cuando todo destaca, nada destaca.

**Regla nueva:** un solo elemento dorado sólido por pantalla — el que quieres que se pulse. Todo lo demás pasa a dorado solo en el texto, o a un borde de 1px, o a blanco.

**Elimina los `box-shadow` de brillo/glow de los botones.** El resplandor es la firma visual de las plantillas generadas.

### 1.3 — Romper el centrado

Todo está centrado: eyebrow, titular, párrafo, botones, cada sección. Es la retícula por defecto.

Alinea a la izquierda al menos: el bloque de problema, la comparativa de la Fase 0.2 y la sección de servicios. El hero puede seguir centrado — hace de portada.

### 1.4 — Densidad

La captura de escritorio a página completa sale con bloques enormes vacíos. Antes de tocar nada, **comprueba si esas zonas están realmente vacías o si es que las animaciones de entrada no dispararon en la captura**, y repórtalo. El arreglo es distinto en cada caso.

### 1.5 — Tipografía (opcional, decisión de Sergio)

La display actual es geométrica y muy común en plantillas. Cambiarla daría personalidad, pero acaba de commitearse el trabajo de `@font-face` con métricas de fallback y hay una regresión de CLS abierta.

**Propuesta:** no la toques en esta ronda. Si Sergio quiere cambiarla, se hace después, sola, con el mismo `preload` + `size-adjust` + `ascent-override` que ya está montado, y se mide CLS antes y después. Un cambio de fuente sin esa disciplina reabre el CLS.

Consúltalo antes de decidir.

---

## FASE 2 — El elemento distintivo: la cuadrícula

Esto es lo único que hay que hacer con ambición. Todo lo demás es limpieza.

**El problema:** "#1 entre 77 carpinterías" es texto. Cualquiera lo escribe. No prueba nada.

**La solución:** el artefacto real de la profesión de Sergio es la cuadrícula de RankMap — 81 círculos numerados sobre el mapa de Logroño, verdes donde Ironwood sale primero. Nadie más en el sector tiene eso en su web. Es prueba y es identidad a la vez.

**Qué construir:** un componente de cuadrícula 9×9 en SVG o CSS Grid, con los números y colores reales del RankMap de Ironwood. Sin captura de pantalla — nativo, para que sea nítido, ligero y responsive.

**Requisitos:**
- Los números reales, no decorativos
- Escala de color coherente con la del RankMap (verde 1–3, amarillo 4–10, naranja +10)
- Sin nombres de competidores en ninguna parte
- Leyenda breve: qué significa cada color
- Pie: `Cuadrícula de 81 puntos sobre 49 km². Búsqueda: "carpintería". Agosto de 2026.`
- En móvil se reduce, no se recorta

**Dónde:** sustituyendo o acompañando al bloque de estadísticas del caso de éxito.

**Sergio te pasará el RankMap con los valores.** Si no lo tienes cuando llegues aquí, para y pídeselo. No inventes números.

---

## FASE 3 — Movimiento

Contenido y con propósito. El exceso de animación es otra señal de plantilla.

- **Contadores** en las cifras del caso de éxito, al entrar en viewport, una sola vez, 600–800ms.
- **Reveal por sección:** opacidad 0→1 y `translateY(12px)→0`, 400ms, `ease-out`, una sola vez. Nada de repetir al volver a subir.
- **Cascada** en la comparativa de la Fase 0.2: las filas entran escalonadas, 60ms entre cada una.
- **La cuadrícula de la Fase 2:** los 81 puntos aparecen en cascada desde el centro. Este es el momento coreografiado de la página — que sea el único.
- **Hover** en tarjetas y botones: sutil, sin desplazamientos que muevan el layout.

**Prohibido:** parallax, vídeo, animación en bucle, cualquier cosa que dispare cada vez que se hace scroll.

**Obligatorio:** todo dentro de `@media (prefers-reduced-motion: reduce)` desactivado. Y ninguna animación puede provocar layout shift — la regresión de CLS sigue abierta.

---

## FASE 4 — Conversión

### 4.1 — La foto real de Sergio

Ahora el botón dice "Habla con Sergio" y a Sergio no se le ve. Es consultor directo, no agencia: esa es su diferenciación entera y no está representada.

Sergio te pasará la foto ya optimizada. Colócala **junto al formulario**, no en el hero, con un pie corto en primera persona.

Formato: `<img>` con `width` y `height` explícitos y `loading="lazy"`. Sin dimensiones fijas hay CLS.

### 4.2 — Tres CTA en el hero son demasiados

Compiten "Diagnóstico gratuito", "Habla con Sergio en WhatsApp" y "Ver caso de éxito". Más el botón fijo del header, que hace un cuarto.

**Nueva jerarquía:**
- **Primario:** WhatsApp — el tráfico de estas keywords es mayoritariamente móvil y WhatsApp tiene menos fricción que un formulario
- **Secundario:** Diagnóstico gratuito (ancla al formulario), como enlace o botón fantasma
- **"Ver caso de éxito":** deja de ser botón. Pasa a indicador de scroll

Y decide qué hace el botón del header para que no duplique al primario.

### 4.3 — El banner de cookies en escritorio

En la captura de escritorio el banner tapa los CTA del hero, pese al commit `7a41e99` que iba justo de eso. Verifica en producción si el arreglo está desplegado o no funcionó, y repórtalo antes de tocarlo.

---

## Verificación

Antes de considerar nada terminado:

1. **Preview de Vercel de la rama.** No se toca producción hasta que Sergio lo apruebe ahí.
2. **Prueba de fuego del formulario:** envío real desde el formulario del final y desde el `-mid`. Comprobar que llega a info@webboost.es, que redirige a `/gracias` y que la conversión dispara en GTM. Si esto se rompe, se rompe la única medición que existe.
3. **Verificación por negación:** buscar en la URL pública que **NO** aparezcan: `91`, `63 reseñas`, `100% cobertura`, `4.9` con punto, ni ninguna forma verbal en plural de la lista de la Fase 0.3.
4. **CLS medido antes y después.** Si sube, se revierte la causa.
5. **Móvil real**, no emulador del navegador.
6. `noindex` sigue en su sitio.

El árbitro final es Sergio abriendo la URL en incógnito con Ctrl+F. Ni tu fetch ni el mío cuentan como prueba.

---

## Lo que NO se hace

- **No se usa la skill 10k-websites.** Es para sitios de lanzamiento con vídeo de scroll. Esta es una landing de respuesta directa que paga por clic: un scroll narrativo retrasa el mensaje y el peso extra encarece cada clic vía experiencia de página.
- **No se reconstruye la página desde cero.** La estructura actual (problema → servicio → caso → método → precio → garantía → FAQ → contacto) es correcta. Se pule, no se rehace.
- **No se reescribe el copy** más allá de las correcciones de datos de la Fase 0. Sergio lo ha pedido explícitamente.
- **No se añaden imágenes generadas por IA.** La foto real es la que hace el trabajo.
- **No se toca ninguna otra página** aunque compartan el problema.

---

## Informe final

Al terminar, entrega:

- Archivos tocados, uno por uno
- Cada cambio de la Fase 0 con su antes y su después
- Resultado de los cuatro barridos de la Fase 0.3
- Qué se detectó fuera de alcance y no se tocó
- CLS antes y después
- URL del preview de Vercel
