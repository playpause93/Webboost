# Agent readiness de webboost.es

## Objetivo
Mantener webboost.es legible y usable por agentes de IA (ChatGPT, Perplexity, Claude, agentes del navegador) sin romper la web para personas ni para Google. Referencia externa: https://isitagentready.com/webboost.es

## Piezas del sistema

| Pieza | Archivo | Qué hace |
|---|---|---|
| Content Signals | `robots.txt` | `search=yes, ai-input=yes, ai-train=yes` (decidido por Sergio el 20-10-2026) |
| Link headers | `vercel.json` (regla `source: "/"`) | La portada anuncia `llms.txt`, `md/index.md` y el sitemap |
| Markdown por página | `tools/html_to_markdown.py` → `md/` | Una copia `.md` de cada URL del `sitemap.xml` |
| Negociación Markdown | `middleware.js` | Si llega `Accept: text/markdown`, sirve `md/<ruta>.md`; si no existe, sirve el HTML normal |
| WebMCP | `webmcp.js` (cargado en `index.html`) y atributos `toolname`/`toolparamdescription` en el formulario de `contacto.html` | Herramientas `info_webboost` y `solicitar_diagnostico_seo` |
| Archivos que no se publican | `.vercelignore` | briefs, scripts, tools, workflows, CLAUDE*.md, informes, PDFs |

## Cuándo actuar

**Cada vez que cambie el texto de una página o se añada una URL al sitemap:**
1. Ejecutar `python tools/html_to_markdown.py`
2. Revisar el `git diff md/` (el Markdown copia el HTML: si el HTML tiene un claim prohibido, el `.md` también; contrastar con los datos válidos de Ironwood)
3. Commit de los `.md` junto con el cambio de HTML

**Página nueva:** basta con añadirla al `sitemap.xml` y ejecutar el script. Las páginas fuera del sitemap (landings de Ads, gracias, legales) no tienen `.md` a propósito: el middleware les sirve HTML.

**Archivo interno nuevo en la raíz o en una carpeta nueva:** comprobar que `.vercelignore` lo cubre antes de hacer push. Vercel publica todo lo que esté trackeado en git salvo lo que excluya `.vercelignore`.

## Verificación tras desplegar

```bash
curl -sI https://www.webboost.es/ | grep -i "^link"
curl -s -H "Accept: text/markdown" -D - https://www.webboost.es/ -o /dev/null | grep -i "content-type\|x-markdown-tokens"
curl -s -o /dev/null -w "%{http_code}\n" https://www.webboost.es/briefs/brief-barrido-claims-ironwood.md   # debe dar 404
```
Después, volver a pasar https://isitagentready.com/webboost.es

## Qué no implementar (decidido el 20-10-2026)
OAuth/OIDC, OAuth Protected Resource, auth.md, API Catalog, MCP Server Card, Poppy, DNS-AID y los protocolos de comercio (x402, MPP, UCP, ACP). La web no tiene API, login ni pagos: publicarlos sería anunciar capacidades que no existen. Agent Skills index y ai-catalog (ARD) quedan aparcados hasta que alguien los consuma de verdad.

## Lecciones
- En `vercel.json`, las expresiones regulares de `source` van con la barra invertida doble dentro del JSON (`"/((?!.*\\.).*)"`); con una sola, el JSON no es válido.
- Las `rewrites` de `vercel.json` se aplican después de buscar el archivo en disco, así que no sirven para la negociación de contenido de `/` (existe `index.html`). Por eso se usa `middleware.js`.
- Cuando varias reglas de `headers` fijan la misma cabecera, gana la última: las reglas específicas (fuentes, imágenes) van después de la general.
