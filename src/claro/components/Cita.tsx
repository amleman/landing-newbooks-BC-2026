import { books, type Book } from "../../data/books";
import { tonoLomo } from "../lib/lomo";
import { Cover } from "./Cover";
import { Reveal } from "./Reveal";

/** La signatura que cita el texto; si cambia la lista, se usa la primera. */
const EJEMPLO: Book =
  books.find((b) => b.clasificacion === "612 H174:14") ?? books[0];

/**
 * Enseña a leer una signatura, que es justo lo que el visitante va a necesitar
 * cuando suba al estante. El ejemplo no es inventado: es un libro de esta misma
 * lista, con su portada y su lomo al lado.
 */
export function Cita({ onAbrir }: { onAbrir: (b: Book) => void }) {
  const tela = tonoLomo(EJEMPLO.accent);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <figure className="grid items-center gap-10 rounded-3xl bg-blanco p-7 shadow-[var(--shadow-flotante)] sm:p-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
            {/* El libro del ejemplo: lomo y portada, como en la estantería */}
            <button
              type="button"
              onClick={() => onAbrir(EJEMPLO)}
              aria-label={`Abrir la ficha de ${EJEMPLO.titulo}`}
              className="group mx-auto flex cursor-pointer items-end gap-2 lg:mx-0"
            >
              <span
                className="block w-[26px] rounded-t-[3px] shadow-[0_10px_20px_-10px_rgb(16_23_51_/_0.5)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-2"
                style={{
                  height: 196,
                  background: tela,
                  backgroundImage:
                    "linear-gradient(100deg, rgb(255 255 255 / 0.22) 0%, transparent 44%, rgb(0 0 0 / 0.28) 100%)",
                }}
              >
                <span className="sr-only">Lomo</span>
              </span>
              <Cover
                book={EJEMPLO}
                className="h-[196px] w-[150px] rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-2"
              />
            </button>

            <div>
              <blockquote className="font-libro text-[clamp(1.35rem,2.6vw,2.05rem)] leading-[1.4] font-light text-tinta">
                Un número como {EJEMPLO.clasificacion} no es burocracia. Es una
                dirección: dice en qué estante, en qué nivel y entre qué dos libros
                está esperando.
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14.5px] text-tinta-media">
                <span>Este, por ejemplo:</span>
                <span className="font-libro text-tinta">{EJEMPLO.titulo}</span>
                <span
                  className="cifras rounded-full px-3 py-1 text-[13px] font-semibold text-white"
                  style={{ background: tela }}
                >
                  {EJEMPLO.clasificacion}
                </span>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
