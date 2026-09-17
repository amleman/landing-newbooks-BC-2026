import type { Book } from "../../data/books";
import { Cover } from "./Cover";

type Props = {
  book: Book;
  onOpen: (b: Book) => void;
  className?: string;
};

/** Ficha breve del catálogo: la portada sobre blanco y sus tres datos. */
export function BookCard({ book, onOpen, className = "" }: Props) {
  return (
    <li className={`list-none ${className}`}>
      <button
        type="button"
        onClick={() => onOpen(book)}
        aria-label={`Abrir la ficha de ${book.titulo}, de ${book.autor}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-blanco text-left shadow-[var(--shadow-posada)] transition-[transform,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-2 hover:shadow-[var(--shadow-flotante)]"
      >
        <Cover
          book={book}
          className="aspect-4/5 w-full p-4 transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="flex flex-1 flex-col border-t border-filete px-4 py-4 transition-colors duration-300 group-hover:border-cian/40">
          <span className="font-libro line-clamp-2 text-[15.5px] leading-[1.3] text-tinta">
            {book.titulo}
          </span>
          <span className="mt-1.5 line-clamp-1 text-[13.5px] text-tinta-media">{book.autor}</span>
          <span className="cifras mt-auto pt-3 text-[12.5px] font-semibold text-cian-texto">
            {book.clasificacion}
          </span>
        </span>
      </button>
    </li>
  );
}
