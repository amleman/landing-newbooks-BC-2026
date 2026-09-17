import { useState } from "react";
import type { Book } from "../data/books";
import { rutaPublica } from "../lib/rutas";

type Props = {
  book: Book;
  className?: string;
  priority?: boolean;
  /**
   * "tile" — encuadre 2:3 uniforme con la portada difuminada de fondo.
   * "float" — la portada sola, sin marco, flotando sobre el fondo de la página.
   */
  variant?: "tile" | "float";
};

/**
 * Las portadas del listado vienen en proporciones distintas (verticales,
 * cuadradas, apaisadas). En vez de recortarlas, se muestran completas sobre un
 * fondo construido con la misma imagen difuminada: la retícula queda pareja y
 * ninguna cubierta pierde su título.
 */
export function Cover({ book, className = "", priority = false, variant = "tile" }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (variant === "float") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={rutaPublica(book.cover)}
          alt={`Portada de ${book.titulo}`}
          onLoad={() => setLoaded(true)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`max-h-full w-auto max-w-full rounded-[3px] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            loaded ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
          }`}
          style={{ filter: `drop-shadow(0 30px 48px rgb(0 0 0 / 0.65))` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-navy-900 ${className}`}
      style={{
        // Un halo del color dominante del libro, no la portada difuminada: el
        // mosaico se mantiene oscuro y cada cubierta conserva su identidad.
        backgroundImage: `radial-gradient(115% 85% at 50% 18%, ${book.accent}2b, transparent 62%)`,
      }}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-[9%] rounded-[3px] bg-cover bg-center transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-60"
        }`}
        style={{ backgroundImage: `url(${book.lqip})`, filter: "blur(8px)" }}
      />
      <img
        src={rutaPublica(book.cover)}
        alt={`Portada de ${book.titulo}`}
        onLoad={() => setLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain p-[9%] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loaded ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
        }`}
        style={{ filter: "drop-shadow(0 16px 26px rgb(0 0 0 / 0.55))" }}
      />
    </div>
  );
}
