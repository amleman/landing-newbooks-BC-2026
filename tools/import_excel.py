# -*- coding: utf-8 -*-
"""
Importa la lista de novedades de la Biblioteca Central desde el .xls original.

Hace tres cosas:
  1. Lee los datos bibliograficos de la hoja «report com».
  2. Extrae las portadas incrustadas en el archivo (van dentro del flujo Escher
     del BIFF, troceadas en registros MSODRAWINGGROUP + CONTINUE) y las guarda
     optimizadas en public/covers/.
  3. Genera src/data/books.ts con el color de acento y el placeholder de cada
     portada, mas la copy editorial de tools/copy_editorial.py.

Uso:
    python tools/import_excel.py "ruta/a/Lista de Libros Nuevos.xls"

Requiere:  pip install xlrd olefile Pillow
"""

from __future__ import annotations

import base64
import colorsys
import io
import json
import os
import re
import struct
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

import olefile
import xlrd
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
COVERS_DIR = ROOT / "public" / "covers"
DATA_FILE = ROOT / "src" / "data" / "books.ts"

SHEET = "report com"
HEADER_ROW = 1  # fila con «No. | Clasificacion | Autor | ...»
COL = {"no": 0, "clasificacion": 1, "autor": 2, "titulo": 3, "resumen": 4, "enlace": 6}

JPG_SIG = b"\xff\xd8\xff"
PNG_SIG = b"\x89PNG\r\n\x1a\n"
BLIP_JPEG, BLIP_PNG = 0xF01D, 0xF01E
MSODRAWINGGROUP, CONTINUE = 0x00EB, 0x003C

MAX_COVER_WIDTH = 560
WEBP_QUALITY = 82


# -- 1. Datos bibliograficos --------------------------------------------------

def split_title(raw: str) -> tuple[str, str]:
    """«Titulo : subtitulo.» -> ("Titulo", "Subtitulo")"""
    t = re.sub(r"\s*\.\s*$", "", raw.strip())
    if " : " in t:
        main, sub = t.split(" : ", 1)
    elif ": " in t:
        main, sub = t.split(": ", 1)
    else:
        main, sub = t, ""
    sub = sub.strip().rstrip(".")
    if sub:
        sub = sub[0].upper() + sub[1:]
    return main.strip(), sub


def flip_author(raw: str) -> str:
    """«Vallejo, Irene» -> «Irene Vallejo»"""
    a = raw.strip()
    if "," in a:
        last, first = a.split(",", 1)
        return f"{first.strip()} {last.strip()}"
    return a


QUOTES_OPEN = '"' + "“«‘"
QUOTES_CLOSE = '"' + "”»’"


def clean_summary(raw: str) -> str:
    s = raw.strip().replace("\r\n", "\n").replace("\r", "\n")
    s = re.sub(r"\n{2,}", "\n", s)
    s = s.replace('""', '"')
    # Nota de catalogacion al cierre: «(Copiado de la pasta)». No es para el lector.
    s = re.sub(r"[\s\"]*\(\s*Copiado[^)]*\)\s*\.?\s*$", "", s, flags=re.IGNORECASE)
    # El Excel envuelve muchas sinopsis entre comillas; sobran en la web.
    s = re.sub(r"^[" + re.escape(QUOTES_OPEN) + r"\s]+", "", s)
    s = re.sub(r"[" + re.escape(QUOTES_CLOSE) + r"\s]+$", "", s)
    return re.sub(r"[ \t]{2,}", " ", s).strip()


HOST_CATALOGO = "biblos.usac.edu.gt"


def safe_link(raw: str) -> str:
    """
    El enlace de cada ficha acaba en un `href` de la web. Si el Excel trae un
    `javascript:...` o un dominio ajeno, seria un enlace vivo dentro del sitio
    de la Biblioteca. Solo pasan https y el catalogo. Lo mismo comprueba
    src/lib/url.ts en el navegador.
    """
    valor = raw.strip()
    if not valor:
        return ""
    partes = urlsplit(valor)
    if partes.scheme != "https" or partes.hostname is None:
        print(f"  enlace descartado (no es https): {valor[:70]}")
        return ""
    if partes.hostname.lower() != HOST_CATALOGO:
        print(f"  enlace descartado (dominio ajeno): {valor[:70]}")
        return ""
    return urlunsplit(partes)


def read_rows(xls_path: Path) -> list[dict]:
    sheet = xlrd.open_workbook(str(xls_path)).sheet_by_name(SHEET)
    rows: list[dict] = []
    for r in range(HEADER_ROW + 1, sheet.nrows):
        cells = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        if not str(cells[COL["titulo"]]).strip():
            continue
        titulo, subtitulo = split_title(str(cells[COL["titulo"]]))
        rows.append(
            {
                "titulo": titulo,
                "subtitulo": subtitulo,
                "autor": flip_author(str(cells[COL["autor"]])),
                "autorOrden": str(cells[COL["autor"]]).strip(),
                "clasificacion": " ".join(str(cells[COL["clasificacion"]]).split()),
                "resumen": clean_summary(str(cells[COL["resumen"]])),
                "enlace": safe_link(str(cells[COL["enlace"]])),
            }
        )
    return rows


# -- 2. Portadas incrustadas --------------------------------------------------

def escher_stream(xls_path: Path) -> bytes:
    """Reensambla el flujo de dibujo, troceado en registros BIFF de 8 KB."""
    data = olefile.OleFileIO(str(xls_path)).openstream("Workbook").read()
    out = bytearray()
    pos, inside = 0, False
    while pos + 4 <= len(data):
        opcode, length = struct.unpack_from("<HH", data, pos)
        payload = data[pos + 4 : pos + 4 + length]
        if opcode == MSODRAWINGGROUP:
            out += payload
            inside = True
        elif opcode == CONTINUE and inside:
            out += payload
        else:
            inside = False
        pos += 4 + length
    return bytes(out)


def extract_covers(xls_path: Path) -> list[Image.Image]:
    """Devuelve las portadas en el orden en que se insertaron (= orden de filas)."""
    esc = escher_stream(xls_path)
    covers: list[Image.Image] = []
    i = 0
    while i < len(esc) - 8:
        _, fbt, cb = struct.unpack_from("<HHI", esc, i)
        if fbt in (BLIP_JPEG, BLIP_PNG) and 500 < cb < 30_000_000 and i + 8 + cb <= len(esc):
            sig = JPG_SIG if fbt == BLIP_JPEG else PNG_SIG
            # Tras la cabecera van uno o dos UID de 16 bytes y un byte de tag.
            offset = esc[i + 8 : i + 8 + 48].find(sig)
            if 0 <= offset <= 40:
                blob = esc[i + 8 + offset : i + 8 + cb]
                try:
                    img = Image.open(io.BytesIO(blob))
                    img.load()
                    covers.append(img)
                    i += 8 + cb
                    continue
                except Exception:
                    pass
        i += 1
    return covers


def flatten(img: Image.Image) -> Image.Image:
    """Las portadas PNG traen transparencia; el fondo real del papel es blanco."""
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        canvas = Image.new("RGB", img.size, (255, 255, 255))
        canvas.paste(img, mask=img.split()[-1])
        return canvas
    return img.convert("RGB")


def accent_color(img: Image.Image) -> str:
    """
    Color dominante de la portada, normalizado para que brille sobre azul
    marino: descarta blancos, negros y grises, y luego fija luminosidad y
    saturacion en un rango legible.
    """
    small = img.copy()
    small.thumbnail((90, 90))
    palette = small.quantize(colors=12, method=Image.MEDIANCUT).convert("RGB")
    counts: dict[tuple[int, int, int], int] = {}
    for px in palette.get_flattened_data():
        counts[px] = counts.get(px, 0) + 1
    total = sum(counts.values())

    best = None
    for (r, g, b), n in counts.items():
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if l > 0.86 or l < 0.07 or s < 0.15:
            continue
        score = (n / total) * (0.3 + s) * (1 - abs(l - 0.5) * 0.6)
        if best is None or score > best[0]:
            best = (score, h, l, s)

    if best is None:
        return "#5b8fd6"  # azul de reserva para portadas en blanco y negro
    _, h, l, s = best
    r, g, b = colorsys.hls_to_rgb(h, min(0.62, max(0.46, l)), min(0.95, max(0.55, s)))
    return "#%02x%02x%02x" % (round(r * 255), round(g * 255), round(b * 255))


def lqip(img: Image.Image) -> str:
    """Miniatura de 14 px en base64: se pinta mientras carga la portada real."""
    thumb = img.copy()
    thumb.thumbnail((14, 14))
    buf = io.BytesIO()
    thumb.save(buf, "JPEG", quality=42)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def save_covers(covers: list[Image.Image]) -> list[dict]:
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    meta = []
    for n, raw in enumerate(covers, start=1):
        img = flatten(raw)
        w, h = img.size
        if w > MAX_COVER_WIDTH:
            img = img.resize((MAX_COVER_WIDTH, round(h * MAX_COVER_WIDTH / w)), Image.LANCZOS)
        img.save(COVERS_DIR / f"{n:02d}.webp", "WEBP", quality=WEBP_QUALITY, method=6)
        meta.append(
            {
                "cover": f"/covers/{n:02d}.webp",
                "accent": accent_color(img),
                "ratio": round(img.size[0] / img.size[1], 4),
                "lqip": lqip(img),
            }
        )
    return meta


# -- 3. Generacion de src/data/books.ts ---------------------------------------

TEMPLATE = """// GENERADO POR tools/import_excel.py - no editar a mano.
// Fuente: «{source}» (Biblioteca Central, USAC).
// Las portadas salen del propio Excel y se optimizan a WebP en public/covers/.

export type Mood = {mood_union};

export type Book = {{
  id: number;
  titulo: string;
  subtitulo: string;
  autor: string;
  autorOrden: string;
  clasificacion: string;
  resumen: string;
  hook: string;
  area: string;
  moods: Mood[];
  enlace: string;
  cover: string;
  accent: string;
  ratio: number;
  lqip: string;
  destacado: boolean;
}};

export const books: Book[] = [
{body}
];

export const areas: string[] = {areas};

export const featured: Book[] = books.filter((b) => b.destacado);
"""

FIELDS = (
    "id", "titulo", "subtitulo", "autor", "autorOrden", "clasificacion",
    "resumen", "hook", "area", "moods", "enlace", "cover", "accent",
    "ratio", "lqip", "destacado",
)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    xls_path = Path(sys.argv[1])
    if not xls_path.exists():
        print(f"No encuentro el archivo: {xls_path}")
        return 1

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from copy_editorial import AREAS, FEATURED, HOOKS, MOODS, MOOD_KEYS

    rows = read_rows(xls_path)
    covers = extract_covers(xls_path)
    print(f"Filas leidas: {len(rows)}   Portadas extraidas: {len(covers)}")
    if len(rows) != len(covers):
        print("AVISO: no coinciden filas y portadas. Revisa el orden antes de publicar.")

    meta = save_covers(covers)
    total_kb = sum(p.stat().st_size for p in COVERS_DIR.glob("*.webp")) // 1024
    print(f"Portadas escritas en public/covers/ ({total_kb} KB en total)")

    fallback = {"cover": "", "accent": "#5b8fd6", "ratio": 0.66, "lqip": ""}
    records = []
    for i, row in enumerate(rows, start=1):
        record = {"id": i, **row}
        record.update(meta[i - 1] if i <= len(meta) else fallback)
        record["hook"] = HOOKS.get(i, "")
        record["area"] = AREAS.get(i, "Sin clasificar")
        record["moods"] = MOODS.get(i, [])
        record["destacado"] = i in FEATURED
        records.append({k: record[k] for k in FIELDS})

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(
        TEMPLATE.format(
            source=xls_path.name,
            mood_union=" | ".join(f'"{k}"' for k in MOOD_KEYS),
            body=",\n".join("  " + json.dumps(r, ensure_ascii=False) for r in records),
            areas=json.dumps(sorted(set(AREAS.values())), ensure_ascii=False),
        ),
        encoding="utf-8",
    )
    print(f"Escrito {DATA_FILE.relative_to(ROOT)} con {len(records)} titulos.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
