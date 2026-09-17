import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Book } from "../../data/books";
import { moodByKey } from "../../data/taxonomy";
import { safeUrl } from "../../lib/url";
import { papelLibro, tintaLibro } from "../lib/lomo";
import { Cover } from "./Cover";

export function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const ficha = safeUrl(book?.enlace);

  useEffect(() => {
    if (!book) return;
    setCopiado(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
          className="fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={book.titulo}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-tinta/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.3, 1] }}
            className="relative max-h-[92svh] w-full max-w-[940px] overflow-y-auto overscroll-contain rounded-t-xl bg-blanco shadow-[0_-20px_60px_rgb(19_26_51_/_0.25)] outline-none sm:rounded-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full border border-filete bg-blanco text-tinta-media transition-colors duration-200 hover:border-cian hover:text-cian-texto"
            >
              ✕
            </button>

            <div className="grid gap-8 p-6 sm:grid-cols-[minmax(0,230px)_1fr] sm:gap-10 sm:p-9">
              <div className="mx-auto w-[min(56vw,220px)] sm:sticky sm:top-9 sm:mx-0 sm:w-full sm:self-start">
                <Cover
                  book={book}
                  priority
                  className="aspect-3/4 w-full rounded-sm border border-filete p-3"
                />
                <div className="mt-4 space-y-2.5">
                  {ficha ? (
                    <a
                      href={ficha}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block w-full rounded-full bg-indigo px-5 py-3 text-center text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-indigo-hondo"
                    >
                      Reservar en Biblos
                    </a>
                  ) : (
                    <p className="rounded-full border border-filete px-5 py-3 text-center text-[12.5px] text-tinta-tenue">
                      Sin ficha en línea. Búscalo por signatura.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => copiar(book.clasificacion)}
                    className="w-full rounded-full border border-filete px-5 py-3 text-[13px] font-medium text-tinta transition-colors duration-200 hover:border-cian hover:text-cian-texto"
                  >
                    {copiado ? "Signatura copiada" : "Copiar la signatura"}
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[12.5px] font-semibold"
                    style={{ background: papelLibro(book.accent), color: tintaLibro(book.accent) }}
                  >
                    {book.area}
                  </span>
                  {book.moods.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-filete px-3 py-1 text-[12.5px] text-tinta-media"
                    >
                      {moodByKey[m].chip}
                    </span>
                  ))}
                </div>

                <h2 className="font-libro mt-5 text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.2] text-tinta">
                  {book.titulo}
                </h2>
                {book.subtitulo && (
                  <p className="font-libro mt-2 text-[17px] leading-snug text-tinta-media italic">
                    {book.subtitulo}
                  </p>
                )}
                <p className="mt-4 text-[15px] font-medium text-tinta-media">{book.autor}</p>

                <p className="font-libro mt-6 border-l-2 border-cian pl-5 text-[19px] leading-[1.5] text-tinta sm:text-[21px]">
                  {book.hook}
                </p>

                <h3 className="mt-8 text-[15px] font-semibold text-tinta">De qué trata</h3>
                <div className="texto-justo mt-3 space-y-4 text-[15.5px] leading-[1.8] text-tinta-media">
                  {book.resumen.split("\n").map((par, i) => (
                    <p key={i}>{par}</p>
                  ))}
                </div>

                <div className="mt-9 rounded-sm bg-hoja px-5 py-5">
                  <h3 className="text-[15px] font-semibold text-tinta">Cómo encontrarlo</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.7] text-tinta-media">
                    Busca esta signatura en el lomo. Los números ordenan la estantería de
                    menor a mayor.
                  </p>
                  <p className="cifras mt-3 inline-block rounded-sm border border-filete bg-blanco px-4 py-2 text-[15px] font-semibold text-tinta">
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
