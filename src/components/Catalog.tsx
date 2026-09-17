import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { books, areas, type Book, type Mood } from "../data/books";
import { moods } from "../data/taxonomy";
import { BookCard } from "./BookCard";
import { Reveal } from "./Reveal";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type Props = {
  mood: Mood | null;
  setMood: (m: Mood | null) => void;
  onOpen: (b: Book) => void;
};

export function Catalog({ mood, setMood, onOpen }: Props) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = norm(q.trim());
    return books.filter((b) => {
      if (mood && !b.moods.includes(mood)) return false;
      if (area && b.area !== area) return false;
      if (!needle) return true;
      return norm(
        `${b.titulo} ${b.subtitulo} ${b.autor} ${b.area} ${b.clasificacion} ${b.hook}`,
      ).includes(needle);
    });
  }, [q, mood, area]);

  const activeFilters = Boolean(mood || area || q);
  const moodActivo = moods.find((m) => m.key === mood) ?? null;

  return (
    <section id="catalogo" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-[62ch]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            La colección completa
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.95rem,4.6vw,3.2rem)] leading-[1.1] font-light tracking-[-0.005em] text-parchment">
            Los {books.length} títulos,
            <span className="block italic text-mist">uno por uno.</span>
          </h2>
        </Reveal>

        {/* Controles */}
        <div className="sticky top-16 z-30 -mx-5 mt-10 border-y border-white/7 bg-abyss/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:top-[72px] sm:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Buscar entre las novedades</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist-dim"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Busca por título, autor o signatura…"
                  className="w-full rounded-full border border-white/12 bg-navy-900/70 py-3 pl-11 pr-4 text-[14.5px] text-parchment placeholder:text-mist-dim/80 transition-colors duration-300 focus:border-sky/50 focus:outline-none"
                />
              </label>

              <label className="relative">
                <span className="sr-only">Filtrar por área</span>
                <select
                  value={area ?? ""}
                  onChange={(e) => setArea(e.target.value || null)}
                  className="w-full appearance-none rounded-full border border-white/12 bg-navy-900/70 py-3 pl-4 pr-10 text-[14.5px] text-parchment transition-colors duration-300 focus:border-sky/50 focus:outline-none sm:w-[15rem]"
                >
                  <option value="">Todas las áreas</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-mist-dim"
                >
                  ▼
                </span>
              </label>
            </div>

            <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setMood(null)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 ${
                  mood === null
                    ? "border-parchment bg-parchment text-navy-950"
                    : "border-white/12 text-mist hover:border-white/30 hover:text-parchment"
                }`}
              >
                Todo
              </button>
              {moods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(mood === m.key ? null : m.key)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 ${
                    mood === m.key
                      ? "border-parchment bg-parchment text-navy-950"
                      : "border-white/12 text-mist hover:border-white/30 hover:text-parchment"
                  }`}
                >
                  {m.chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Al llegar desde un «momento», el catálogo dice en voz alta qué está
            mostrando: si no, parece que el visitante aterrizó en un buscador
            vacío y le toca buscar de nuevo. */}
        <AnimatePresence initial={false}>
          {moodActivo && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-sky/30 bg-usac/10 px-5 py-4">
                <p>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky">
                    Ya filtrado para ti
                  </span>
                  <span className="mt-1.5 block font-display text-[19px] leading-tight text-parchment sm:text-[21px]">
                    {moodActivo.label}
                    <span className="text-mist"> · {results.length} títulos</span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setMood(null)}
                  className="rounded-full border border-white/18 px-5 py-2.5 text-[13px] font-medium text-parchment transition-colors duration-300 hover:border-white/45 hover:bg-white/6"
                >
                  Ver los {books.length}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-[13.5px] text-mist-dim">
            {/* Si el banner ya canta el número, aquí no se repite. */}
            {moodActivo ? (
              area ? `Área: ${area}` : ""
            ) : (
              <>
                <span className="font-semibold tabular-nums text-parchment">{results.length}</span>{" "}
                {results.length === 1 ? "título" : "títulos"}
                {area ? ` · ${area}` : ""}
              </>
            )}
          </p>
          {activeFilters && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setArea(null);
                setMood(null);
              }}
              className="text-[13.5px] font-medium text-sky-soft underline-offset-4 transition-colors hover:text-parchment hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <motion.ul
          layout
          className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {results.map((b) => (
              <BookCard key={b.id} book={b} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>

        {results.length === 0 && (
          <div className="mt-16 rounded-2xl border border-white/9 bg-navy-900/40 px-6 py-16 text-center">
            <p className="font-display text-[22px] text-parchment">Nada por aquí.</p>
            <p className="mt-2 text-[15px] text-mist">
              Prueba con otro término o quita los filtros para ver los {books.length} títulos.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
