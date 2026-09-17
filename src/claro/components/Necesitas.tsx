import { books, type Mood } from "../../data/books";
import { moods } from "../../data/taxonomy";
import { Reveal } from "./Reveal";

type Props = {
  onAbrir: (m: Mood) => void;
  abierto: Mood | null;
};

/**
 * Las seis puertas de entrada, como lista y no como rejilla de tarjetas.
 *
 * Nadie entra a una biblioteca por una materia: entra porque necesita algo.
 * Una lista se lee de corrido, que es como se escoge entre seis opciones; seis
 * tarjetas iguales obligarían a comparar en dos ejes sin motivo.
 */
export function Necesitas({ onAbrir, abierto }: Props) {
  return (
    <section id="necesitas" className="relative scroll-mt-20 pt-20 pb-14 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[16ch] text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.12] font-light tracking-[-0.01em] text-tinta">
            ¿Qué necesitas resolver?
          </h2>
          <p className="mt-5 max-w-[48ch] text-pretty text-[16.5px] leading-[1.7] text-tinta-media">
            Cada fila abre los títulos nuevos que responden a eso. No hace falta
            saber de antemano en qué área buscar.
          </p>
        </Reveal>

        <ul className="mt-12 space-y-2.5">
          {moods.map((m, i) => {
            const coinciden = books.filter((b) => b.moods.includes(m.key));
            const seleccionado = abierto === m.key;

            return (
              <Reveal key={m.key} delay={i * 0.05} y={22} className="list-none">
                <button
                  type="button"
                  onClick={() => onAbrir(m.key)}
                  aria-haspopup="dialog"
                  className={`group flex w-full flex-col gap-4 rounded-2xl px-5 py-7 text-left transition-[transform,box-shadow,background-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-10 sm:px-7 ${
                    seleccionado
                      ? "bg-blanco shadow-[var(--shadow-flotante)]"
                      : "bg-white/55 shadow-[var(--shadow-posada)] hover:bg-blanco hover:shadow-[var(--shadow-flotante)]"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[clamp(1.2rem,2.2vw,1.65rem)] leading-tight font-light text-tinta transition-colors duration-200 group-hover:text-cian-texto">
                      {m.label}
                    </span>
                    <span className="mt-2 block max-w-[62ch] text-[14.5px] leading-[1.6] text-tinta-media">
                      {m.detalle}
                    </span>
                  </span>

                  {/* Cuántos hay, y las primeras cinco portadas como aperitivo */}
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="cifras rounded-full bg-hoja-honda px-3 py-1 text-[13.5px] font-semibold text-tinta-media tabular-nums">
                      {coinciden.length}
                    </span>
                    <span className="flex gap-1.5">
                      {coinciden.slice(0, 5).map((b) => (
                        <span
                        key={b.id}
                        className="block aspect-2/3 w-9 overflow-hidden rounded-[4px] bg-hoja-honda shadow-[0_5px_12px_-5px_rgb(16_23_51_/_0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-1 sm:w-11"
                      >
                        <img
                          src={b.cover}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      ))}
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
