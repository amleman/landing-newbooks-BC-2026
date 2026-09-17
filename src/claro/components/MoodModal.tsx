import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { books, type Book } from "../../data/books";
import type { MoodDef } from "../../data/taxonomy";
import { BookCard } from "./BookCard";

type Props = {
  momento: MoodDef | null;
  onCerrar: () => void;
  onOpenBook: (b: Book) => void;
  onVerCatalogo: () => void;
  /** Hay una ficha de libro encima: este diálogo no debe atender al teclado. */
  tapado: boolean;
};

/** La respuesta a una fila de «qué necesitas», en primer plano. */
export function MoodModal({ momento, onCerrar, onOpenBook, onVerCatalogo, tapado }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // En una ref, no en las dependencias: abrir una ficha encima no debe
  // rehacer este efecto ni robarle el foco al panel.
  const tapadoRef = useRef(tapado);
  tapadoRef.current = tapado;

  useEffect(() => {
    if (!momento) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !tapadoRef.current) onCerrar();
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
  }, [momento, onCerrar]);

  const libros = momento ? books.filter((b) => b.moods.includes(momento.key)) : [];

  return (
    <AnimatePresence>
      {momento && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={momento.label}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCerrar}
            className="absolute inset-0 cursor-default bg-tinta/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.3, 1] }}
            className="relative flex max-h-[92svh] w-full max-w-[1060px] flex-col rounded-t-xl bg-hoja shadow-[0_-20px_60px_rgb(19_26_51_/_0.25)] outline-none sm:rounded-xl"
          >
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-5 sm:px-9 sm:pt-8">
              <div className="min-w-0">
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] leading-tight font-light text-tinta">
                  {momento.label}
                </h2>
                <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-tinta-media">
                  {momento.claim} Hay {libros.length} títulos nuevos.
                </p>
              </div>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-filete bg-blanco text-tinta-media transition-colors duration-200 hover:border-cian hover:text-cian-texto"
              >
                ✕
              </button>
            </header>

            <ul className="grid grid-cols-2 gap-4 overflow-y-auto overscroll-contain px-6 pb-6 sm:grid-cols-3 sm:gap-5 sm:px-9 lg:grid-cols-4">
              {libros.map((b) => (
                <BookCard key={b.id} book={b} onOpen={onOpenBook} />
              ))}
            </ul>

            <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-filete bg-blanco px-6 py-4 sm:px-9 sm:py-5">
              <p className="text-[13.5px] text-tinta-media">
                Toca una portada para ver de qué trata y dónde está.
              </p>
              <button
                type="button"
                onClick={onVerCatalogo}
                className="rounded-full bg-indigo px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-indigo-hondo"
              >
                Verlos en el catálogo completo
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
