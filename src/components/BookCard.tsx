import { motion } from "motion/react";
import type { Book } from "../data/books";
import { Cover } from "./Cover";

type Props = {
  book: Book;
  onOpen: (b: Book) => void;
  /** Ancho fijo cuando la tarjeta va en un estante horizontal. */
  className?: string;
};

export function BookCard({ book, onOpen, className = "" }: Props) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.22 } }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`list-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onOpen(book)}
        className="group block w-full text-left"
        aria-label={`Ver detalle de ${book.titulo}, de ${book.autor}`}
      >
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 50% 60%, ${book.accent}55, transparent 70%)` }}
          />
          <Cover
            book={book}
            className="aspect-2/3 w-full rounded-xl ring-1 ring-white/10 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:ring-white/25"
          />

          {/* Gancho al pasar el cursor */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end overflow-hidden rounded-xl opacity-0 transition-opacity duration-500 group-hover:-translate-y-2 group-hover:opacity-100">
            <div className="bg-gradient-to-t from-navy-950 via-navy-950/92 to-transparent p-4 pt-14">
              <p className="translate-y-3 font-display text-[15.5px] leading-[1.4] text-parchment transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                «{book.hook}»
              </p>
              <span className="mt-2.5 block translate-y-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-transform duration-500 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                style={{ color: book.accent }}
              >
                Ver detalle →
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 px-0.5">
          <h3 className="line-clamp-2 text-[15px] leading-[1.35] font-semibold tracking-tight text-parchment transition-colors duration-300 group-hover:text-white">
            {book.titulo}
          </h3>
          {book.subtitulo && (
            <p className="mt-1 line-clamp-1 text-[13px] italic text-mist-dim">{book.subtitulo}</p>
          )}
          <p className="mt-1.5 line-clamp-1 text-[13.5px] text-mist">{book.autor}</p>
          <p className="mt-2 font-mono text-[11px] tracking-tight text-mist-dim">
            {book.clasificacion}
          </p>
        </div>
      </button>
    </motion.li>
  );
}
