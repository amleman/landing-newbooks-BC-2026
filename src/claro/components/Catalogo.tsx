import { useMemo, useState } from "react";
import { books, areas, type Book, type Mood } from "../../data/books";
import { moods } from "../../data/taxonomy";
import { BookCard } from "./BookCard";
import { Reveal } from "./Reveal";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

type Props = {
  mood: Mood | null;
  setMood: (m: Mood | null) => void;
  onOpen: (b: Book) => void;
};

export function Catalogo({ mood, setMood, onOpen }: Props) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string | null>(null);

  const resultados = useMemo(() => {
    const aguja = norm(q.trim());
    return books.filter((b) => {
      if (mood && !b.moods.includes(mood)) return false;
      if (area && b.area !== area) return false;
      if (!aguja) return true;
      return norm(
        `${b.titulo} ${b.subtitulo} ${b.autor} ${b.area} ${b.clasificacion} ${b.hook}`,
      ).includes(aguja);
    });
  }, [q, mood, area]);

  const momentoActivo = moods.find((m) => m.key === mood) ?? null;
  const hayFiltros = Boolean(mood || area || q);

  return (
    <section id="catalogo" className="relative scroll-mt-20 pt-20 pb-24 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.12] font-light tracking-[-0.01em] text-tinta">
            Los 43, uno por uno
          </h2>
        </Reveal>

        <div className="cristal sticky top-[68px] z-30 mt-8 flex flex-col gap-4 rounded-2xl px-5 py-4 shadow-[var(--shadow-posada)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Buscar entre las novedades</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-tinta-tenue"
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
                placeholder="Busca un título, un autor o una signatura"
                className="w-full rounded-full border border-filete bg-blanco py-3 pr-4 pl-11 text-[14.5px] text-tinta transition-colors duration-200 placeholder:text-tinta-tenue focus:border-cian focus:outline-none"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Filtrar por área</span>
              <select
                value={area ?? ""}
                onChange={(e) => setArea(e.target.value || null)}
                className="w-full appearance-none rounded-full border border-filete bg-blanco py-3 pr-10 pl-4 text-[14.5px] text-tinta transition-colors duration-200 focus:border-cian focus:outline-none sm:w-[15rem]"
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
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px] text-tinta-tenue"
              >
                ▼
              </span>
            </label>
          </div>

          <p className="cifras shrink-0 text-[14px] text-tinta-media lg:pl-8">
            <span className="font-semibold text-tinta">{resultados.length}</span>{" "}
            {resultados.length === 1 ? "título" : "títulos"}
          </p>
        </div>

        {/* Momentos como filtro: subrayado en vez de píldora, para que no
            compitan con la lista de arriba */}
        <div className="sin-barra -mx-5 mt-5 flex gap-6 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => setMood(null)}
            className={`shrink-0 border-b-2 pb-1 text-[14px] transition-colors duration-200 ${
              mood === null
                ? "border-cian font-semibold text-tinta"
                : "border-transparent text-tinta-media hover:text-cian-texto"
            }`}
          >
            Todos
          </button>
          {moods.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(mood === m.key ? null : m.key)}
              className={`shrink-0 border-b-2 pb-1 text-[14px] transition-colors duration-200 ${
                mood === m.key
                  ? "border-cian font-semibold text-tinta"
                  : "border-transparent text-tinta-media hover:text-cian-texto"
              }`}
            >
              {m.chip}
            </button>
          ))}
        </div>

        {momentoActivo && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-2xl bg-cian-papel px-5 py-4 shadow-[var(--shadow-posada)]">
            <p className="text-[15px] text-tinta">
              Mostrando los {resultados.length} títulos para{" "}
              <span className="font-semibold">{momentoActivo.label.toLowerCase()}</span>
            </p>
            <button
              type="button"
              onClick={() => setMood(null)}
              className="text-[14px] font-semibold text-cian-texto underline-offset-4 hover:underline"
            >
              Ver los {books.length}
            </button>
          </div>
        )}

        {hayFiltros && !momentoActivo && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setArea(null);
            }}
            className="mt-5 text-[14px] font-medium text-cian-texto underline-offset-4 hover:underline"
          >
            Quitar los filtros
          </button>
        )}

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {resultados.map((b) => (
            <BookCard key={b.id} book={b} onOpen={onOpen} />
          ))}
        </ul>

        {resultados.length === 0 && (
          <div className="mt-12 rounded-3xl bg-blanco px-6 py-16 text-center shadow-[var(--shadow-posada)]">
            <p className="font-libro text-[21px] text-tinta">No hay nada con eso.</p>
            <p className="mt-2 text-[15px] text-tinta-media">
              Prueba con otra palabra, o quita los filtros para ver los {books.length}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
