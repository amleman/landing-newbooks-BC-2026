# -*- coding: utf-8 -*-
"""
Prepara los assets de marca para la web a partir de los originales.

  Los originales viven en brand/ y NO se publican: todo lo que hay en public/
  se copia tal cual a dist/, y ahi solo deben ir los derivados que la pagina
  usa de verdad.

  Tipografias: los .ttf/.otf de brand/ pesan entre 40 y 90 KB cada uno y ningun
  navegador los necesita en ese formato. Aqui se convierten a WOFF2 (misma
  calidad, ~40% del peso) en public/fonts/web/.

  Logo: brand/new_logo_bc.png es un pliego carta de 2550x3300 px con el logo
  centrado y mucho transparente alrededor. Se recorta y se sacan estas piezas:
    - logo-bc.webp    el logo completo (marca + texto), para el pie
    - logo-mark.webp  solo el isotipo, para la cabecera
    - favicon.png / apple-touch-icon.png

Uso:
    python tools/build_assets.py

Requiere:  pip install fonttools brotli Pillow
"""

from __future__ import annotations

from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
BRAND = ROOT / "brand"
WEB_FONTS = PUBLIC / "fonts" / "web"

# Solo los cortes que la pagina usa de verdad. Josefin es variable: un unico
# archivo cubre de Thin a Bold.
#
# Neulis Cursive (la letra del logotipo) salio de aqui en septiembre de 2026:
# la direccion de la Biblioteca pidio cambiar los titulares y se pusieron en
# Fraunces. Fraunces se descarga ya en .woff2 desde Google Fonts y vive
# directamente en public/fonts/web/, asi que este script no la toca. Los .otf
# de Neulis siguen en brand/ por si algun dia se quiere volver atras.
FONT_SOURCES = [
    (BRAND / "Josefin_Sans" / "JosefinSans-VariableFont_wght.ttf", "JosefinSans-Variable.woff2"),
    (BRAND / "Josefin_Sans" / "JosefinSans-Italic-VariableFont_wght.ttf", "JosefinSans-Italic-Variable.woff2"),
]

LOGO_SRC = BRAND / "new_logo_bc.png"
# Version a color, horizontal: es la que se ve sobre fondo claro. La blanca
# desapareceria sobre el papel de la version clara.
LOGO_COLOR_SRC = BRAND / "LOGO PRINCIPAL FULL RGB-04.png"
# El isotipo termina donde empieza la palabra «Biblioteca». La franja en blanco
# entre ambos se localiza midiendo filas totalmente transparentes.
MIN_GAP_ROWS = 40


def build_fonts() -> None:
    WEB_FONTS.mkdir(parents=True, exist_ok=True)
    total = 0
    for src, name in FONT_SOURCES:
        if not src.exists():
            print(f"  falta: {src.name}")
            continue
        font = TTFont(str(src))
        font.flavor = "woff2"
        dst = WEB_FONTS / name
        font.save(str(dst))
        total += dst.stat().st_size
        print(f"  {name:38} {src.stat().st_size // 1024:>4} KB -> {dst.stat().st_size // 1024:>3} KB")
    print(f"  total web: {total // 1024} KB")


def trim(img: Image.Image) -> Image.Image:
    return img.crop(img.split()[-1].getbbox())


def build_logo() -> None:
    if not LOGO_SRC.exists():
        print(f"  falta: {LOGO_SRC.name}")
        return
    logo = trim(Image.open(LOGO_SRC).convert("RGBA"))

    # Logo completo para el pie
    full = logo.copy()
    full.thumbnail((520, 520), Image.LANCZOS)
    full.save(PUBLIC / "logo-bc.webp", "WEBP", quality=92, method=6)
    print(f"  logo-bc.webp    {full.size}")

    # Primera franja de filas vacias: separa isotipo de logotipo
    alpha = logo.split()[-1]
    rows = [any(alpha.getpixel((x, y)) > 12 for x in range(0, logo.width, 4)) for y in range(logo.height)]
    cut = logo.height
    run_start = None
    for y, filled in enumerate(rows):
        if not filled and run_start is None:
            run_start = y
        elif filled and run_start is not None:
            if y - run_start >= MIN_GAP_ROWS:
                cut = run_start
                break
            run_start = None

    mark = trim(logo.crop((0, 0, logo.width, cut)))
    mark_web = mark.copy()
    mark_web.thumbnail((240, 240), Image.LANCZOS)
    mark_web.save(PUBLIC / "logo-mark.webp", "WEBP", quality=92, method=6)
    print(f"  logo-mark.webp  {mark_web.size}  (corte en y={cut} de {logo.height})")

    # Favicon: el isotipo sobre un cuadrado azul marino redondeado
    for size, name in ((64, "favicon.png"), (180, "apple-touch-icon.png")):
        icon = Image.new("RGBA", (size, size), (8, 11, 28, 255))
        glyph = mark.copy()
        glyph.thumbnail((round(size * 0.68), round(size * 0.68)), Image.LANCZOS)
        icon.alpha_composite(glyph, ((size - glyph.width) // 2, (size - glyph.height) // 2))
        icon.save(PUBLIC / name)
        print(f"  {name:15} {icon.size}")


def build_logo_color() -> None:
    """Lockup horizontal a color para la version clara: completo y solo isotipo."""
    if not LOGO_COLOR_SRC.exists():
        print(f"  falta: {LOGO_COLOR_SRC.name}")
        return
    logo = trim(Image.open(LOGO_COLOR_SRC).convert("RGBA"))

    full = logo.copy()
    full.thumbnail((720, 720), Image.LANCZOS)
    full.save(PUBLIC / "logo-color.webp", "WEBP", quality=92, method=6)
    print(f"  logo-color.webp      {full.size}")

    # El isotipo termina en la primera franja vertical vacia.
    alpha = logo.split()[-1]
    cols = [any(alpha.getpixel((x, y)) > 12 for y in range(0, logo.height, 3)) for x in range(logo.width)]
    cut, run = logo.width, None
    for x, filled in enumerate(cols):
        if not filled and run is None:
            run = x
        elif filled and run is not None:
            if x - run >= 25:
                cut = run
                break
            run = None

    mark = trim(logo.crop((0, 0, cut, logo.height)))
    mark.thumbnail((240, 240), Image.LANCZOS)
    mark.save(PUBLIC / "logo-mark-color.webp", "WEBP", quality=92, method=6)
    print(f"  logo-mark-color.webp {mark.size}  (corte en x={cut} de {logo.width})")


if __name__ == "__main__":
    print("Tipografias:")
    build_fonts()
    print("Logo:")
    build_logo()
    build_logo_color()
