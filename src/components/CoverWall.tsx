import { useEffect, useRef, useState } from "react";
import { books } from "../data/books";

const rows = [books.slice(0, 15), books.slice(15, 29), books.slice(29, 43)];

/**
 * Muro de portadas en deriva perpetua: el fondo del hero. Anuncia el volumen de
 * la colección antes de leer una sola palabra. La animación se detiene cuando
 * el hero sale de pantalla para no gastar GPU durante el resto del scroll.
 */
export function CoverWall() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1400px]"
    >
      <div className="absolute inset-x-[-30%] top-1/2 flex -translate-y-1/2 flex-col gap-5 opacity-90 sm:gap-7">
        {rows.map((row, i) => (
          <div
            key={i}
            className="anim-marquee flex w-max gap-5 sm:gap-7"
            style={{
              animationDuration: `${104 + i * 26}s`,
              animationDirection: i % 2 === 1 ? "reverse" : "normal",
              animationPlayState: visible ? "running" : "paused",
            }}
          >
            {[...row, ...row].map((b, j) => (
              <div
                key={`${b.id}-${j}`}
                className="aspect-2/3 w-[104px] shrink-0 overflow-hidden rounded-lg sm:w-[140px] lg:w-[168px]"
              >
                <img
                  src={b.cover}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Atenuación: el muro vive muy por debajo del contenido */}
      <div className="absolute inset-0 bg-navy-950/78" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(5,13,30,0.35)_0%,rgba(3,6,14,0.95)_78%)]" />
      {/* Cortina lateral: deja limpio el costado donde vive el titular */}
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/92 to-abyss/35 lg:via-abyss/80 lg:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-abyss via-abyss/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-abyss/95 to-transparent" />
    </div>
  );
}
