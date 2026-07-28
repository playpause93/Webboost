# webboost.es

Sitio estático (HTML + CSS, sin build system) desplegado en Vercel desde `main`.

## CSS

`styles.css` es la fuente editable, pero ninguna página la carga como `<link>`:
va minificada e inline en el `<head>` de cada página, entre los marcadores
`<!-- CSS-INLINE:START -->` / `<!-- CSS-INLINE:END -->`. Tras editar `styles.css`,
ejecuta `python scripts/build-css` y commitea también los HTML que cambien.
