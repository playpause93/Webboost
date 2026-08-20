# CRO — `/seo-local-logrono`: subir CTA y formulario

**Para:** Claude Code
**De:** CEREBRO (estrategia WebBoost)
**Fecha:** 4 agosto 2026
**Prioridad:** Alta — hay tráfico de pago entrando ahora mismo en esta página

---

# ⛔ ALCANCE CERRADO

**Un solo archivo:** `/seo-local-logrono` (la landing de Google Ads, `noindex`).

**PROHIBIDO:**
- Tocar cualquier otra página del sitio.
- Reescribir textos, titulares, secciones o copy existentes. Este brief **mueve y añade elementos, no reescribe contenido**.
- Cambiar el diseño, la paleta, la tipografía o el CSS global.
- Añadir cifras, estadísticas o afirmaciones nuevas. Los únicos datos válidos de Ironwood: **#1 entre 91 competidores · menos de 90 días · 63 reseñas · 4,9★ · 100% cobertura Pack Local**.
- Tocar el formulario en sí: campos, action de Formspree, redirección a `/gracias`. **Funciona y está verificado hoy.** Solo se duplica/reubica el bloque, no se modifica su lógica.
- Quitar el `noindex`.

**Si algo no coincide con lo descrito aquí:** repórtalo y para. No improvises.

---

# Diagnóstico (por qué se hace esto)

Datos reales de la campaña, 27 jul – 4 ago:

| Métrica | Valor |
|---|---|
| Clics a esta landing | 7-8 |
| CTR del anuncio | 13,21% |
| Conversiones | **0** |
| Tiempo de interacción medio (GA4) | **14 s** |
| % de clics desde móvil | **71%** |

Comparativa de tiempo de interacción en el mismo sitio:

| Página | Tiempo |
|---|---|
| /precios | 33 s |
| /caso-de-estudio | 23 s |
| /contacto | 16 s |
| **/seo-local-logrono** | **14 s** |

La landing de pago retiene menos que las orgánicas. Con 14 segundos de media y 71% de móvil, **el usuario no llega nunca al formulario**, que está al final de la página. No es un problema de mensaje: es que no se ve.

El tracking está verificado hoy y funciona (email a info@webboost.es + redirección a `/gracias`). Los ceros son reales, no un fallo de medición.

---

# CAMBIO 1 — CTA visible sin hacer scroll

## Qué hacer

Añadir un botón de llamada a la acción en el **hero** de la página (primera pantalla, visible sin scroll en móvil).

- **Texto del botón:** `Diagnóstico gratuito`
- **Comportamiento:** ancla interna que hace scroll suave hasta el bloque del formulario (`href="#formulario"` o el id que ya exista; si no existe, crearlo en el bloque del formulario actual).
- **NO** debe abrir una página nueva, ni ir a `/contacto`, ni a ningún dominio externo.

## Requisitos

- Debe verse **sin hacer scroll en móvil** (viewport de 375×667 como referencia mínima).
- Estilo coherente con los botones que ya existen en la página. Reutilizar clases CSS existentes, no crear un sistema nuevo.
- Área táctil mínima de 44×44 px.

## Verificación

- [ ] El botón es visible en el primer viewport en móvil sin scroll
- [ ] Al pulsarlo, la página hace scroll hasta el formulario
- [ ] El texto es exactamente `Diagnóstico gratuito` (nunca "auditoría gratuita" — la auditoría es el servicio de 150€)

---

# CAMBIO 2 — Formulario también a mitad de página

## Qué hacer

Duplicar el bloque del formulario y colocarlo **también** aproximadamente a mitad de la página, además del que ya existe al final.

Punto de inserción sugerido: justo después de la sección donde se explica el servicio y antes de la parte más larga de contenido. Elegir un corte natural, no partir una sección por la mitad.

## Requisitos técnicos

- **Mismo `action` de Formspree** que el formulario actual.
- **Misma redirección** a `/gracias`.
- **Mismos campos** exactamente (nombre, negocio, teléfono).
- Los `id` de los campos HTML deben ser **únicos** entre los dos formularios (por ejemplo, sufijo `-mid` en el nuevo) para no romper el HTML ni los `<label>`.
- Los dos formularios deben funcionar de forma independiente y enviar igual.

⚠️ Si el evento de conversión de GA4/GTM depende de un `id` o selector concreto del formulario, **verificar que el nuevo formulario también lo dispara**. Si no es posible garantizarlo, reportarlo antes de desplegar.

## Verificación

- [ ] Ambos formularios envían correctamente a Formspree
- [ ] Ambos redirigen a `/gracias`
- [ ] No hay `id` duplicados en el HTML de la página
- [ ] El envío llega a info@webboost.es desde los dos

---

# CAMBIO 3 — Prueba social en la primera pantalla

## Qué hacer

Añadir en el hero, cerca del CTA del Cambio 1, una línea breve con el dato de Ironwood.

**Texto literal a usar:**

> Ironwood Soluciones: #1 en Google Maps entre 91 competidores, en menos de 90 días.

## Requisitos

- Una sola línea, discreta, sin robar protagonismo al titular ni al botón.
- **Texto literal.** No reformular, no añadir porcentajes, no añadir "un único cambio estratégico" ni ningún otro detalle.
- Si esa frase ya aparece en el hero, **no duplicarla**: reportarlo y no hacer nada en este punto.

## Por qué

`/caso-de-estudio` tiene el mejor CTR de todo el sitio (1,9%) y 23 s de interacción. El contenido que demuestra resultados es lo que más engancha en esta web.

---

# VERIFICACIÓN FINAL

Contra la URL pública (`https://www.webboost.es/seo-local-logrono`), no en local:

- [ ] La página sigue con `noindex`
- [ ] El CTA es visible en el primer viewport móvil
- [ ] Hay exactamente **dos** formularios: uno a mitad y uno al final
- [ ] Los dos envían y redirigen a `/gracias`
- [ ] Sin `id` duplicados
- [ ] No aparece la cadena `auditoría gratuita` en ninguna parte de la página
- [ ] No hay ningún `href="#"` vacío ni enlaces salientes nuevos en el footer
- [ ] Ningún texto existente ha sido reescrito

# INFORME

1. Salida de la verificación contra producción.
2. Qué se ha movido y qué se ha añadido, elemento por elemento.
3. Confirmación de si el evento de conversión se dispara desde los dos formularios, o aviso si no se ha podido garantizar.
4. Cualquier problema detectado y **no tocado**.
