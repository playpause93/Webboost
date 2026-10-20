"""Genera la versión Markdown de cada página indexable de webboost.es.

Lee las URLs de sitemap.xml, localiza el HTML de cada una y escribe
md/<ruta>.md (la portada va a md/index.md). El middleware de Vercel
sirve esos ficheros cuando un agente pide `Accept: text/markdown`.

Uso:  python tools/html_to_markdown.py
"""
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "md"
SITE = "https://www.webboost.es"

# Elementos que no aportan contenido a un agente
DROP = {"script", "style", "noscript", "svg", "nav", "footer", "form", "button",
        "iframe", "template", "head", "input", "select", "textarea", "label"}
BLOCK = {"p", "div", "section", "article", "main", "header", "aside", "address",
         "figure", "figcaption", "details", "summary", "dl", "dt", "dd"}
HEADINGS = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "h5": 5, "h6": 6}


def sitemap_paths():
    xml = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    for loc in re.findall(r"<loc>([^<]+)</loc>", xml):
        yield urlparse(loc.strip()).path or "/"


def html_file_for(path):
    if path == "/":
        return ROOT / "index.html"
    rel = path.strip("/")
    for cand in (ROOT / f"{rel}.html", ROOT / rel / "index.html"):
        if cand.exists():
            return cand
    return None


def md_file_for(path):
    return OUT / ("index.md" if path == "/" else f"{path.strip('/')}.md")


def is_hidden(tag):
    style = (tag.get("style") or "").replace(" ", "").lower()
    return ("display:none" in style or tag.get("hidden") is not None
            or tag.get("aria-hidden") == "true")


def inline(node, base):
    """Texto en línea de un nodo (enlaces, negritas, cursivas)."""
    if isinstance(node, Comment):
        return ""
    if isinstance(node, NavigableString):
        return re.sub(r"\s+", " ", str(node))
    if not isinstance(node, Tag) or node.name in DROP or is_hidden(node):
        return ""
    if node.name == "br":
        return "\n"
    inner = "".join(inline(c, base) for c in node.children)
    if node.name in ("strong", "b") and inner.strip():
        return f"**{inner.strip()}** "
    if node.name in ("em", "i") and inner.strip():
        return f"*{inner.strip()}* "
    if node.name == "a":
        href = node.get("href", "")
        text = inner.strip()
        if not text:
            return ""
        if href.startswith(("#", "javascript:")) or not href:
            return text
        return f"[{text}]({urljoin(base, href)})"
    if node.name == "img":
        alt = (node.get("alt") or "").strip()
        return f"![{alt}]({urljoin(base, node.get('src', ''))})" if alt else ""
    return inner


def has_block_child(tag):
    return any(isinstance(c, Tag) and (c.name in BLOCK or c.name in HEADINGS
               or c.name in ("ul", "ol", "table", "blockquote", "p", "hr"))
               for c in tag.children)


def block(node, base, depth=0):
    """Convierte un nodo en bloques Markdown separados por línea en blanco."""
    if isinstance(node, Comment):
        return ""
    if isinstance(node, NavigableString):
        return re.sub(r"\s+", " ", str(node))
    if not isinstance(node, Tag) or node.name in DROP or is_hidden(node):
        return ""

    name = node.name
    if name in HEADINGS:
        text = clean(inline(node, base))
        return f"\n\n{'#' * HEADINGS[name]} {text}\n\n" if text else ""
    if name in ("ul", "ol"):
        lines = []
        for i, li in enumerate(node.find_all("li", recursive=False), 1):
            if is_hidden(li):
                continue
            nested = [c for c in li.children if isinstance(c, Tag) and c.name in ("ul", "ol")]
            for n in nested:
                n.extract()
            text = clean("".join(block(c, base, depth + 1) for c in li.children))
            bullet = f"{i}." if name == "ol" else "-"
            if text:
                lines.append("  " * depth + f"{bullet} {text.replace(chr(10), ' ')}")
            for n in nested:
                lines.append(block(n, base, depth + 1).strip("\n"))
        return "\n\n" + "\n".join(lines) + "\n\n" if lines else ""
    if name == "table":
        rows = []
        for tr in node.find_all("tr"):
            cells = [clean(inline(c, base)).replace("|", "\\|") for c in tr.find_all(["th", "td"])]
            if cells:
                rows.append(cells)
        if not rows:
            return ""
        width = max(len(r) for r in rows)
        rows = [r + [""] * (width - len(r)) for r in rows]
        out = ["| " + " | ".join(rows[0]) + " |", "|" + " --- |" * width]
        out += ["| " + " | ".join(r) + " |" for r in rows[1:]]
        return "\n\n" + "\n".join(out) + "\n\n"
    if name == "blockquote":
        text = clean("".join(block(c, base, depth) for c in node.children))
        return "\n\n" + "\n".join(f"> {l}" if l else ">" for l in text.split("\n")) + "\n\n"
    if name == "hr":
        return "\n\n---\n\n"
    if name in BLOCK or name in ("body", "html", "li", "span") and has_block_child(node):
        if has_block_child(node):
            return "\n\n" + "".join(block(c, base, depth) for c in node.children) + "\n\n"
        text = clean(inline(node, base))
        return f"\n\n{text}\n\n" if text else ""
    return inline(node, base)


def clean(text):
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\*\* +([.,;:)])", r"**\1", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def convert(html_path, url):
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    title = soup.title.get_text(strip=True) if soup.title else ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    desc = desc_tag.get("content", "").strip() if desc_tag else ""
    for sel in (".mobile-menu", "#mobileMenu", ".cookie-banner"):
        for t in soup.select(sel):
            t.decompose()
    body = soup.body or soup
    content = clean(block(body, url))
    front = ["---", f'title: "{title}"', f'description: "{desc}"', f"url: {url}", "---"]
    return "\n".join(front) + "\n\n" + content + "\n"


def main():
    written = 0
    for path in sitemap_paths():
        src = html_file_for(path)
        if not src:
            print(f"AVISO: no encuentro el HTML de {path}", file=sys.stderr)
            continue
        url = SITE + ("/" if path == "/" else path)
        dest = md_file_for(path)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(convert(src, url), encoding="utf-8")
        written += 1
        print(f"{path:45} -> {dest.relative_to(ROOT).as_posix()}")
    print(f"\n{written} páginas convertidas.")


if __name__ == "__main__":
    main()
