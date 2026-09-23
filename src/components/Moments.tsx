import { books, type Mood } from "../data/books";
import { moods } from "../data/taxonomy";
import { Reveal } from "./Reveal";
import { rutaPublica } from "../lib/rutas";

const FAN = [
  "group-hover:-translate-x-2.5 group-hover:-rotate-6",
  "group-hover:-translate-y-1.5",
  "group-hover:translate-x-2.5 group-hover:rotate-6",
];

type Props = {
  /** Abre el pop-up con los títulos de ese momento. */
  onAbrir: (m: Mood) => void;
  /** Momento cuyo pop-up está abierto, para marcar su tarjeta. */
  abierto: Mood | null;
};

export function Moments({ onAbrir, abierto }: Props) {
  return (
    <section id="momentos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-[62ch]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Empieza por aquí
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.95rem,4.6vw,3.2rem)] leading-[1.1] font-light tracking-[-0.005em] text-parchment">
            Nadie entra a una biblioteca por una materia
            <span className="block italic text-mist">Se entra por un motivo</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-[1.7] text-mist">
            Elige el tuyo y verás al instante los títulos nuevos que responden a eso.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3.5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {moods.map((m, i) => {
            const matches = books.filter((b) => b.moods.includes(m.key));
            const peek = matches.slice(0, 3);
            const seleccionado = abierto === m.key;

            return (
              <Reveal key={m.key} delay={i * 0.06} className="h-full">
                <button
                  type="button"
                  onClick={() => onAbrir(m.key)}
                  aria-haspopup="dialog"
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-navy-850/90 to-navy-950/70 p-6 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 sm:p-7 ${
                    seleccionado
                      ? "border-sky/60 shadow-[0_0_0_1px_rgba(70,180,232,0.25)]"
                      : "border-white/9 hover:border-sky/40"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl transition-opacity duration-700 ${
                      seleccionado ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                    style={{ background: "radial-gradient(circle, rgba(70,180,232,0.45), transparent 70%)" }}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`text-[26px] leading-none transition-colors duration-500 ${
                        seleccionado ? "text-gold" : "text-sky/70 group-hover:text-gold"
                      }`}
                    >
                      {m.glyph}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-colors duration-500 ${
                        seleccionado
                          ? "border-gold/40 text-gold-soft"
                          : "border-white/12 text-mist-dim group-hover:border-gold/40 group-hover:text-gold-soft"
                      }`}
                    >
                      {matches.length} títulos
                    </span>
                  </div>

                  <h3 className="relative mt-7 font-display text-[23px] leading-[1.2] font-normal tracking-tight text-parchment sm:text-[25px]">
                    {m.label}
                  </h3>
                  <p className="relative mt-2.5 text-[14.5px] leading-[1.6] text-sky-soft/90">{m.claim}</p>
                  <p className="relative mt-3 text-[13.5px] leading-[1.65] text-mist-dim">{m.detalle}</p>

                  <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors duration-300 ${
                        seleccionado ? "text-gold-soft" : "text-parchment/85 group-hover:text-gold-soft"
                      }`}
                    >
                      Ver los {matches.length}
                      <span
                        aria-hidden
                        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>

                    <div className="flex shrink-0 items-end">
                      {peek.map((b, idx) => (
                        <span
                          key={b.id}
                          className={`relative block aspect-2/3 w-12 overflow-hidden rounded-[5px] ring-1 ring-white/12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${FAN[idx]}`}
                          style={{
                            marginLeft: idx === 0 ? 0 : -16,
                            zIndex: peek.length - idx,
                            boxShadow: `0 10px 22px -10px ${b.accent}aa`,
                          }}
                        >
                          <img
                            src={rutaPublica(b.cover)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
