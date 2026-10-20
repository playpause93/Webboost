// Markdown para agentes: si la petición pide `Accept: text/markdown`,
// devuelve la versión .md de la página (generada por tools/html_to_markdown.py).
// Los navegadores siguen recibiendo HTML. Si no hay .md, sigue el flujo normal.

export const config = {
  // Solo rutas de página (sin extensión); no toca assets ni /api
  matcher: ['/', '/((?!api/|md/|.*\\.).*)'],
};

export default async function middleware(request) {
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/markdown')) return;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const mdPath = path === '/' ? '/md/index.md' : `/md${path}.md`;

  const res = await fetch(new URL(mdPath, url.origin));
  if (!res.ok) return;

  const body = await res.text();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept',
      'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Robots-Tag': 'noindex',
    },
  });
}
