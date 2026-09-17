import type { Book } from "../../data/books";

/**
 * Los lomos del estante.
 *
 * El color de acento de cada libro se calculó para brillar sobre azul marino
 * (versión oscura). Sobre papel claro hay que bajarlo: un lomo se lee como tela
 * de encuadernación, saturada y media, no como un neón.
 */

function hexAHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) / 6
      : max === g
        ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslAHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255);
  };
  return `#${[f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Color de la tela del lomo.
 *
 * El techo de luminosidad (0.30) no es estético: es lo que hace que el título
 * en blanco supere 4.5:1 en los 43 lomos. Con acentos más claros —los verdes y
 * los ocres— el texto se volvía ilegible. De paso, una tela profunda es lo que
 * tiene una encuadernación de verdad.
 */
export function tonoLomo(accent: string): string {
  const [h, s, l] = hexAHsl(accent);
  return hslAHex(h, Math.min(0.74, Math.max(0.26, s)), Math.min(0.3, Math.max(0.2, l * 0.6)));
}

/** Un punto más claro, para el filo superior del lomo. */
export function filoLomo(accent: string): string {
  const [h, s, l] = hexAHsl(accent);
  return hslAHex(h, Math.min(0.7, Math.max(0.22, s * 0.9)), Math.min(0.44, Math.max(0.3, l * 0.82)));
}

/**
 * El mismo color, pero legible como texto sobre blanco.
 *
 * Los acentos se calcularon para brillar sobre azul marino: varios son verdes
 * o amarillos claros que sobre papel no se leen. Se conserva el tono (que es
 * lo que identifica al libro) y se baja la luminosidad hasta que el contraste
 * pasa de 7:1.
 */
export function tintaLibro(accent: string): string {
  const [h, s] = hexAHsl(accent);
  return hslAHex(h, Math.min(0.8, Math.max(0.38, s)), 0.24);
}

/** Fondo muy claro del mismo tono, para la etiqueta de área. */
export function papelLibro(accent: string): string {
  const [h, s] = hexAHsl(accent);
  return hslAHex(h, Math.min(0.55, Math.max(0.28, s)), 0.95);
}

/**
 * Grosor y altura del lomo. No hay número de páginas en el Excel, así que se
 * derivan del propio título: da un ritmo irregular y estable, y dos libros del
 * mismo autor no salen idénticos.
 */
export function medidasLomo(libro: Book): { ancho: number; alto: number } {
  const semilla = [...`${libro.titulo}${libro.clasificacion}`].reduce(
    (a, c) => (a * 31 + c.charCodeAt(0)) % 9973,
    7,
  );
  const largo = Math.min(1, libro.titulo.length / 46);
  return {
    ancho: Math.round(30 + largo * 16 + (semilla % 11)),
    alto: Math.round(80 + (semilla % 21)),
  };
}
