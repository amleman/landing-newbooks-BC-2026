import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { books } from "../data/books";
import { safeUrl } from "../lib/url";

/**
 * Quién hizo esta página y por qué.
 *
 * Es la ficha de autoría del proyecto, igual que la ficha de un libro dice
 * quién lo escribió. Va en un pop-up y no en el pie porque el pie ya está
 * lleno de información que el visitante necesita (dónde está la biblioteca,
 * cómo escribir, qué horario) y esto no compite con eso: quien tenga
 * curiosidad por cómo está hecho el sitio, entra; quien venga a buscar un
 * libro, ni se entera.
 *
 * El crédito de desarrollo es información del proyecto, no decoración: si se
 * edita, que sea por una decisión consciente de quien corresponda, igual que
 * el copyright del LICENSE o el autor del package.json.
 */

/** Quien desarrolló el sitio. */
const AUTOR = "Anthony Alemán";

/**
 * Su perfil profesional. Se valida con la misma lista blanca que el resto de
 * enlaces del sitio (src/lib/url.ts): si algún día se pone una URL que no
 * pasa el filtro, el nombre se pinta sin enlace en vez de pintar un enlace
 * roto o peligroso.
 */
const PERFIL_AUTOR = "https://www.linkedin.com/in/anthony-aleman";

export function AcercaDe({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const perfil = safeUrl(PERFIL_AUTOR);

  useEffect(() => {
    if (!abierto) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    const quienAbrio = document.activeElement as HTMLElement | null;

    // El scroll lo bloquea App.tsx, no cada pop-up: ver el comentario de
    // `hayPopup` allí.
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      quienAbrio?.focus?.();
    };
  }, [abierto, onCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Acerca de este sitio"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCerrar}
            className="absolute inset-0 cursor-default bg-abyss/85 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92svh] w-full max-w-[680px] overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-navy-950 p-7 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] outline-none sm:rounded-3xl sm:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-3xl bg-[radial-gradient(120%_100%_at_25%_0%,rgba(21,153,214,0.22),transparent_70%)]"
            />

            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar acerca de"
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-white/14 bg-navy-900/80 text-mist backdrop-blur transition-colors duration-300 hover:border-white/40 hover:text-parchment"
            >
              ✕
            </button>

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky">
                Acerca de este sitio
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.5rem,3.4vw,2.1rem)] leading-tight font-light text-parchment">
                Novedades de la Biblioteca Central
              </h2>

              <div className="texto-justo mt-5 space-y-4 text-[15px] leading-[1.75] text-mist">
                <p>
                  Cada semestre entran títulos nuevos a la Biblioteca Central de la Universidad de
                  San Carlos de Guatemala, y durante años la única forma de enterarse fue un listado
                  impreso que casi nadie leía. Este sitio nació para cambiar eso: enseñar los{" "}
                  {books.length} libros que acaban de llegar de manera que den ganas de abrirlos, no
                  como un inventario.
                </p>
                <p>
                  Por eso la página no empieza preguntando por materias ni por signaturas, sino por
                  lo que uno necesita: entender el mundo, aprobar el semestre, escapar un rato. De
                  cada libro se cuenta de qué trata y dónde encontrarlo en estantería, con enlace
                  directo a su ficha en Biblos.
                </p>
                <p>
                  Los datos salen del propio sistema de la biblioteca, incluidas las portadas. No
                  hay publicidad, ni analítica, ni cuentas, ni formularios: la página no recoge ni
                  un dato de quien la visita.
                </p>
              </div>

              <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-white/8 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    Diseño y desarrollo
                  </dt>
                  <dd className="mt-1.5 text-[15.5px] text-parchment">
                    {perfil ? (
                      <a
                        href={perfil}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-sky/40 underline-offset-4 transition-colors duration-300 hover:text-sky-soft hover:decoration-sky"
                      >
                        {AUTOR}
                      </a>
                    ) : (
                      AUTOR
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    Para
                  </dt>
                  <dd className="mt-1.5 text-[15.5px] text-parchment">
                    Biblioteca Central · USAC
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    Hecho con
                  </dt>
                  <dd className="mt-1.5 text-[14.5px] leading-[1.6] text-mist">
                    React, TypeScript, Vite y Tailwind CSS. Sitio estático, sin servidor detrás.
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    Publicado
                  </dt>
                  <dd className="mt-1.5 text-[14.5px] leading-[1.6] text-mist">
                    Septiembre de 2026
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
