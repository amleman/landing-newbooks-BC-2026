import { useState } from "react";
import type { Book } from "../../data/books";

type Props = {
  book: Book;
  className?: string;
  priority?: boolean;
};

/**
 * Portada sobre papel blanco. Las cubiertas vienen en proporciones distintas
 * (verticales, cuadradas); se muestran completas y centradas, apoyadas sobre
 * blanco, con la sombra corta de un libro puesto sobre una mesa.
 */
export function Cover({ book, className = "", priority = false }: Props) {
  const [cargada, setCargada] = useState(false);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-blanco ${className}`}>
      <img
        src={book.cover}
        alt={`Portada de ${book.titulo}`}
        onLoad={() => setCargada(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`max-h-full max-w-full rounded-[3px] object-contain transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.3,1)] ${
          cargada ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
        }`}
        style={{ filter: "drop-shadow(0 10px 22px rgb(16 23 51 / 0.22))" }}
      />
    </div>
  );
}
