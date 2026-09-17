import { useRef, useState } from "react";
import { books, type Book } from "../../data/books";
import { filoLomo, medidasLomo, tonoLomo } from "../lib/lomo";

type Props = {
  /** Libro que se está mirando; el hero lo muestra en la vitrina. */
  onMirar: (b: Book) => void;
  onAbrir: (b: Book) => void;
  mirado: Book;
};

const ALTO_BANDA = 210;
const CARACTER = 6.4;

/** Un lomo no cabe entero: se corta donde se acaba el cartón, como en la realidad. */
function recortar(titulo: string, altoPx: number): string {
  const caben = Math.floor((altoPx - 30) / CARACTER);
  return titulo.length <= caben ? titulo : `${titulo.slice(0, Math.max(6, caben - 1)).trimEnd()}…`;
}

/**
 * Los 43 lomos, en el orden en que están en la estantería.
 *
 * El color de cada lomo sale de su propia portada. El degradado que lleva
 * encima —luz en el canto izquierdo, sombra en el derecho— es lo que le da
 * volumen: sin él son rectángulos planos.
 */
export function Estante({ onMirar, onAbrir, mirado }: Props) {
  const pista = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const arrastre = useRef({ activo: false, x: 0, desde: 0, movido: 0 });

  const alBajar = (e: React.PointerEvent) => {
    const el = pista.current;
    if (!el || e.pointerType === "touch") return;
    arrastre.current = { activo: true, x: e.clientX, desde: el.scrollLeft, movido: 0 };
  };
  const alMover = (e: React.PointerEvent) => {
    const el = pista.current;
    if (!el || !arrastre.current.activo) return;
    const dx = e.clientX - arrastre.current.x;
    arrastre.current.movido = Math.max(arrastre.current.movido, Math.abs(dx));
    el.scrollLeft = arrastre.current.desde - dx;
  };
  const alSoltar = () => {
    arrastre.current.activo = false;
  };

  return (
    <div className="relative">
      <div
        ref={pista}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerLeave={() => {
          alSoltar();
          setHover(null);
        }}
        className="sin-barra cursor-grab overflow-x-auto overscroll-x-contain pb-8 active:cursor-grabbing"
      >
        <ul className="flex items-end gap-[3px] px-5 pt-10 sm:px-8" style={{ minHeight: ALTO_BANDA + 40 }}>
          {books.map((libro, i) => {
            const { ancho, alto } = medidasLomo(libro);
            const altoPx = Math.max(164, Math.round((ALTO_BANDA * alto) / 100));
            const tela = tonoLomo(libro.accent);
            const activo = hover === libro.id || (hover === null && mirado.id === libro.id);

            return (
              <li key={libro.id} className="shrink-0">
                <button
                  type="button"
                  onMouseEnter={() => {
                    setHover(libro.id);
                    onMirar(libro);
                  }}
                  onFocus={() => {
                    setHover(libro.id);
                    onMirar(libro);
                  }}
                  onClick={() => {
                    if (arrastre.current.movido > 6) return;
                    onAbrir(libro);
                  }}
                  aria-label={`${libro.titulo}, de ${libro.autor}. Signatura ${libro.clasificacion}`}
                  className="lomo-entra relative block origin-bottom overflow-hidden rounded-t-[4px] transition-[transform,box-shadow,filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.3,1)] focus-visible:outline-offset-4"
                  style={{
                    width: ancho,
                    height: altoPx,
                    background: tela,
                    borderTop: `2px solid ${filoLomo(libro.accent)}`,
                    transform: activo ? "translateY(-22px) scaleY(1.02)" : "translateY(0)",
                    boxShadow: activo
                      ? `0 22px 34px -12px ${tela}99, 0 4px 10px rgb(16 23 51 / 0.18)`
                      : "0 8px 14px -8px rgb(16 23 51 / 0.35)",
                    filter: hover !== null && !activo ? "saturate(0.72) brightness(0.94)" : "none",
                    animationDelay: `${0.35 + i * 0.02}s`,
                  }}
                >
                  {/* Volumen: luz en el canto izquierdo, sombra en el derecho */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(100deg, rgb(255 255 255 / 0.22) 0%, rgb(255 255 255 / 0.07) 16%, transparent 44%, rgb(0 0 0 / 0.2) 86%, rgb(0 0 0 / 0.34) 100%)",
                    }}
                  />
                  {/* Filetes de la encuadernación */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[3px] top-[9px] h-px bg-white/25"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[3px] bottom-[9px] h-px bg-white/20"
                  />

                  <span className="absolute inset-x-0 top-4 bottom-4 flex justify-center">
                    <span
                      className="font-libro text-[11.5px] leading-none font-normal whitespace-nowrap text-white select-none"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {recortar(libro.titulo, altoPx)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* La madera del estante */}
      <div className="relative -mt-8">
        <div className="h-[10px] rounded-full bg-gradient-to-b from-tinta/14 to-transparent blur-[3px]" />
        <div className="h-[3px] rounded-full bg-gradient-to-r from-transparent via-filete to-transparent" />
      </div>
    </div>
  );
}
