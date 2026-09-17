import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { books, type Book } from "../data/books";
import type { MoodDef } from "../data/taxonomy";
import { BookCard } from "./BookCard";

type Props = {
  momento: MoodDef | null;
  onCerrar: () => void;
  onOpenBook: (b: Book) => void;
  /** Aplica el filtro en el catálogo completo y baja hasta él. */
  onVerCatalogo: () => void;
  /** Hay una ficha de libro encima: este diálogo no debe reaccionar al teclado. */
  tapado: boolean;
};

/**
 * La respuesta a un «momento», en primer plano.
 *
 * Antes, elegir un momento solo bajaba la página hasta el catálogo con el
 * filtro puesto: el visitante aterrizaba junto a un buscador y parecía que le
 * tocaba buscar. Ahora los títulos se abren encima, como la ficha de un libro,
 * y bajar al catálogo es una decisión suya.
 */
export function MoodModal({ momento, onCerrar, onOpenBook, onVerCatalogo, tapado }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // En una ref, no en las dependencias: abrir una ficha encima no debe
  // rehacer este efecto ni robarle el foco al panel.
  const tapadoRef = useRef(tapado);
  tapadoRef.current = tapado;

  useEffect(() => {
    if (!momento) return;

    const onKey = (e: KeyboardEvent) => {
      // Con una ficha abierta encima, Escape le toca a ella.
      if (e.key === "Escape" && !tapadoRef.current) onCerrar();
    };
    const opener = document.activeElement as HTMLElement | null;

    // El scroll lo bloquea App.tsx, no cada pop-up: ver el comentario de
    // `hayPopup` allí.
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
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
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Títulos para «${momento.label}»`}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCerrar}
            className="absolute inset-0 cursor-default bg-abyss/80 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[92svh] w-full max-w-[1100px] flex-col rounded-t-3xl border border-white/10 bg-navy-950 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] outline-none sm:rounded-3xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-56 rounded-t-3xl bg-[radial-gradient(120%_100%_at_25%_0%,rgba(21,153,214,0.28),transparent_70%)]"
            />

            {/* Encabezado */}
            <header className="relative flex items-start justify-between gap-4 px-6 pt-6 pb-5 sm:px-9 sm:pt-9">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky">
                  {libros.length} {libros.length === 1 ? "título" : "títulos"} para este momento
                </p>
                <h2 className="mt-2.5 font-display text-[clamp(1.5rem,3.4vw,2.2rem)] leading-tight font-light text-parchment">
                  {momento.label}
                </h2>
                <p className="mt-2 max-w-[54ch] text-[14.5px] leading-[1.6] text-mist">
                  {momento.claim}
                </p>
              </div>

              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-white/14 bg-navy-900/80 text-mist backdrop-blur transition-colors duration-300 hover:border-white/40 hover:text-parchment"
              >
                ✕
              </button>
            </header>

            {/* Los títulos */}
            <ul className="relative grid grid-cols-2 gap-x-5 gap-y-8 overflow-y-auto overscroll-contain px-6 pb-6 sm:grid-cols-3 sm:px-9 lg:grid-cols-4">
              {libros.map((b) => (
                <BookCard key={b.id} book={b} onOpen={onOpenBook} />
              ))}
            </ul>

            {/* Salida al catálogo */}
            <footer className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/8 bg-navy-950/95 px-6 py-4 sm:px-9 sm:py-5">
              <p className="text-[12.5px] text-mist-dim">
                Toca cualquier portada para leer de qué trata y cómo encontrarlo en estantería.
              </p>
              <button
                type="button"
                onClick={onVerCatalogo}
                className="group inline-flex items-center gap-2 rounded-full border border-sky/40 bg-usac/15 px-5 py-2.5 text-[13.5px] font-semibold text-sky-soft transition-all duration-300 hover:border-sky/70 hover:bg-usac/30 hover:text-parchment"
              >
                Ver estos {libros.length} en el catálogo
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
