import { featured, type Book } from "../../data/books";
import { safeUrl } from "../../lib/url";
import { papelLibro, tintaLibro } from "../lib/lomo";
import { Cover } from "./Cover";
import { Reveal } from "./Reveal";

function primerasFrases(texto: string, max = 300) {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max);
  const punto = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("? "));
  return (punto > 120 ? corte.slice(0, punto + 1) : `${corte.trimEnd()}…`).trim();
}

/**
 * La selección, jerarquizada: uno grande y cuatro menores.
 *
 * La asimetría no es un capricho de maquetación; es el juicio editorial hecho
 * estructura. Si la Biblioteca recomienda uno por encima de los demás, ese uno
 * ocupa el espacio que le corresponde. Por eso tampoco van numerados: no son
 * una secuencia, son una jerarquía.
 */
export function Recomendamos({ onAbrir }: { onAbrir: (b: Book) => void }) {
  const [principal, ...resto] = featured;
  const ficha = safeUrl(principal.enlace);

  return (
    <section id="recomendamos" className="relative scroll-mt-20 overflow-hidden bg-hoja-honda py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[14ch] text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.12] font-light tracking-[-0.01em] text-tinta">
            Si solo te llevas uno
          </h2>
        </Reveal>

        {/* El principal */}
        <Reveal delay={0.08}>
          <article className="mt-10 grid gap-8 rounded-3xl bg-blanco p-6 shadow-[var(--shadow-flotante)] sm:p-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
          <button
            type="button"
            onClick={() => onAbrir(principal)}
            className="group mx-auto w-[min(62vw,260px)] cursor-pointer lg:mx-0 lg:w-full"
            aria-label={`Abrir la ficha de ${principal.titulo}`}
          >
            <Cover
              book={principal}
              priority
              className="aspect-3/4 w-full rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-2"
            />
          </button>

          <div className="flex flex-col justify-center">
            <p
              className="w-fit rounded-full px-3 py-1 text-[12.5px] font-semibold"
              style={{ background: papelLibro(principal.accent), color: tintaLibro(principal.accent) }}
            >
              {principal.area}
            </p>

            <h3 className="font-libro mt-5 text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.2] text-tinta">
              {principal.titulo}
            </h3>
            {principal.subtitulo && (
              <p className="font-libro mt-2 text-[17px] leading-snug text-tinta-media italic">
                {principal.subtitulo}
              </p>
            )}
            <p className="mt-3 text-[15px] text-tinta-media">{principal.autor}</p>

            <p className="font-libro mt-6 max-w-[46ch] text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.45] text-tinta">
              {principal.hook}
            </p>

            <p className="mt-5 max-w-[62ch] text-pretty text-[15px] leading-[1.75] text-tinta-media">
              {primerasFrases(principal.resumen)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onAbrir(principal)}
                className="rounded-full bg-indigo px-6 py-3.5 text-[14px] font-semibold text-white shadow-[var(--shadow-posada)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-0.5 hover:bg-indigo-hondo hover:shadow-[var(--shadow-flotante)]"
              >
                Leer la ficha completa
              </button>
              {ficha && (
                <a
                  href={ficha}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full bg-hoja px-6 py-3.5 text-[14px] font-medium text-tinta transition-all duration-300 ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-0.5 hover:text-cian-texto hover:shadow-[var(--shadow-posada)]"
                >
                  Reservar en Biblos
                </a>
              )}
            </div>

            <p className="cifras mt-6 text-[13px] font-semibold text-tinta-tenue">
              Signatura {principal.clasificacion}
            </p>
          </div>
          </article>
        </Reveal>

        {/* Los otros cuatro */}
        <Reveal>
          <h3 className="mt-16 text-[17px] font-medium text-tinta-media">
            Y cuatro más que valen el viaje
          </h3>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {resto.map((libro, i) => (
            <Reveal key={libro.id} delay={i * 0.06} y={24}>
              <article className="h-full rounded-2xl bg-blanco p-5 shadow-[var(--shadow-posada)] transition-[transform,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-flotante)] sm:p-6">
              <button
                type="button"
                onClick={() => onAbrir(libro)}
                className="group flex w-full gap-5 text-left"
                aria-label={`Abrir la ficha de ${libro.titulo}`}
              >
                <Cover
                  book={libro}
                  className="aspect-3/4 w-[92px] shrink-0 rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-1.5 sm:w-[104px]"
                />
                <span className="min-w-0 flex-1">
                  <span className="font-libro block text-[17px] leading-[1.25] text-tinta">
                    {libro.titulo}
                  </span>
                  <span className="mt-1.5 block text-[13.5px] text-tinta-media">{libro.autor}</span>
                  <span className="font-libro mt-3 block text-[14.5px] leading-[1.5] text-tinta">
                    {libro.hook}
                  </span>
                  <span className="cifras mt-3 block text-[12.5px] font-semibold text-cian-texto">
                    {libro.clasificacion}
                  </span>
                </span>
              </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
