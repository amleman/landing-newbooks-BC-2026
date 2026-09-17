import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Book } from "../data/books";
import { Cover } from "./Cover";
import { moodByKey } from "../data/taxonomy";
import { safeUrl } from "../lib/url";

export function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  // El enlace sale del Excel: se valida antes de pintarlo (ver src/lib/url.ts)
  const ficha = safeUrl(book?.enlace);

  useEffect(() => {
    if (!book) return;
    setCopiado(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Quien abrió la ficha vuelve a su tarjeta al cerrarla.
    const opener = document.activeElement as HTMLElement | null;

    // El scroll lo bloquea App.tsx, no cada pop-up: ver el comentario de
    // `hayPopup` allí.
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [book, onClose]);

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={book.titulo}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-abyss/80 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92svh] w-full max-w-[980px] overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-navy-950 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] outline-none sm:rounded-3xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-45"
              style={{ background: `radial-gradient(120% 100% at 20% 0%, ${book.accent}55, transparent 70%)` }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full border border-white/14 bg-navy-900/80 text-mist backdrop-blur transition-colors duration-300 hover:border-white/40 hover:text-parchment"
              aria-label="Cerrar detalle"
            >
              ✕
            </button>

            <div className="relative grid gap-8 p-6 sm:grid-cols-[minmax(0,230px)_1fr] sm:gap-10 sm:p-9 lg:grid-cols-[minmax(0,270px)_1fr] lg:p-11">
              <div className="mx-auto w-[min(58vw,220px)] sm:sticky sm:top-9 sm:mx-0 sm:w-full sm:self-start">
                <Cover
                  book={book}
                  priority
                  className="aspect-2/3 w-full rounded-xl ring-1 ring-white/14"
                />
                <div className="mt-5 space-y-2.5">
                  {ficha ? (
                    <a
                      href={ficha}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-parchment px-5 py-3 text-[13.5px] font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Reservar en Biblos <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <p className="rounded-full border border-white/12 px-5 py-3 text-center text-[12.5px] text-mist-dim">
                      Sin ficha en línea. Búscalo por signatura.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => copiar(book.clasificacion)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/14 px-5 py-3 text-[13px] font-medium text-mist transition-colors duration-300 hover:border-white/35 hover:text-parchment"
                  >
                    {copiado ? "Signatura copiada ✓" : "Copiar signatura"}
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{ background: `${book.accent}22`, color: book.accent }}
                  >
                    {book.area}
                  </span>
                  {book.moods.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-medium text-mist-dim"
                    >
                      {moodByKey[m].chip}
                    </span>
                  ))}
                </div>

                <h2 className="mt-5 font-display text-[clamp(1.55rem,3.4vw,2.25rem)] leading-[1.18] font-light tracking-[-0.005em] text-parchment">
                  {book.titulo}
                </h2>
                {book.subtitulo && (
                  <p className="mt-2.5 font-display text-[17px] leading-snug italic text-mist">
                    {book.subtitulo}
                  </p>
                )}

                <p className="mt-4 text-[15px] font-medium text-sky-soft">{book.autor}</p>

                <p
                  className="mt-7 border-l-2 py-1 pl-5 font-display text-[20px] leading-[1.5] text-parchment sm:text-[22px]"
                  style={{ borderColor: book.accent }}
                >
                  «{book.hook}»
                </p>

                <div className="mt-8">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-dim">
                    De qué trata
                  </h3>
                  <div className="texto-justo mt-3.5 space-y-4 text-[15.5px] leading-[1.8] text-mist">
                    {book.resumen.split("\n").map((par, i) => (
                      <p key={i}>{par}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-9 rounded-2xl border border-white/9 bg-navy-900/50 p-5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Cómo encontrarlo
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.7] text-mist">
                    Busca esta signatura en el lomo del libro. Los números ordenan la estantería de
                    menor a mayor:
                  </p>
                  <p className="mt-3 inline-block rounded-lg border border-white/12 bg-abyss/70 px-3.5 py-2 font-mono text-[14px] tracking-tight text-parchment">
                    {book.clasificacion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
