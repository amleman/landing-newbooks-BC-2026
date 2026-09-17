import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { featured, type Book } from "../data/books";
import { Cover } from "./Cover";
import { Reveal } from "./Reveal";
import { safeUrl } from "../lib/url";

function firstSentences(text: string, max = 240) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return (stop > 90 ? cut.slice(0, stop + 1) : cut.trimEnd() + "…").trim();
}

function Item({ book, index, onOpen }: { book: Book; index: number; onOpen: (b: Book) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yCover = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);
  const yGlow = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  // Inclinación 3D siguiendo el cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [13, -13]), { stiffness: 150, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-11, 11]), { stiffness: 150, damping: 18 });

  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className="relative grid items-center gap-10 border-t border-white/7 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-32"
    >
      <motion.div
        aria-hidden
        style={{ y: yGlow, background: `radial-gradient(circle, ${book.accent}2e, transparent 68%)` }}
        className={`pointer-events-none absolute top-1/2 -z-10 size-[34rem] -translate-y-1/2 rounded-full blur-[120px] ${
          flip ? "right-0" : "left-0"
        }`}
      />

      {/* Portada */}
      <motion.div
        style={{ y: yCover }}
        className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}
      >
        <div
          className="mx-auto w-[min(78vw,340px)] [perspective:1200px] lg:mx-0 lg:w-full lg:max-w-[400px]"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.button
            type="button"
            onClick={() => onOpen(book)}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            className="group relative block w-full cursor-pointer rounded-xl"
            aria-label={`Ver detalle de ${book.titulo}`}
          >
            <Cover
              book={book}
              variant="float"
              className="aspect-2/3 w-full"
              priority={index === 0}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[8%] bottom-[4%] -z-10 h-16 rounded-[50%] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `radial-gradient(ellipse, ${book.accent}88, transparent 70%)` }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Texto */}
      <div className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ background: `${book.accent}1f`, color: book.accent }}
            >
              {book.area}
            </span>
            <span className="font-mono text-[12px] tracking-tight text-mist-dim">
              {book.clasificacion}
            </span>
          </div>

          <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.3vw,2.45rem)] leading-[1.26] font-light tracking-[-0.005em] text-parchment">
            «{book.hook}»
          </blockquote>

          <div className="mt-7 flex items-baseline gap-3">
            <h3 className="font-display text-[19px] font-semibold text-parchment sm:text-[21px]">
              {book.titulo}
            </h3>
            <span className="text-[14.5px] text-mist">· {book.autor}</span>
          </div>

          <p className="mt-4 max-w-[58ch] text-pretty text-[15.5px] leading-[1.78] text-mist">
            {firstSentences(book.resumen)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpen(book)}
              className="rounded-full bg-parchment px-6 py-3 text-[13.5px] font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
            >
              Leer de qué trata
            </button>
            {safeUrl(book.enlace) && (
              <a
                href={safeUrl(book.enlace)!}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/16 px-6 py-3 text-[13.5px] font-medium text-parchment transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Ficha en Biblos <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </Reveal>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-8 -z-10 font-display text-[clamp(5rem,13vw,11rem)] leading-none font-light text-white/[0.03] select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Spotlight({ onOpen }: { onOpen: (b: Book) => void }) {
  return (
    // overflow-x-clip: los halos y el numeral sangran a proposito, pero no deben
    // ensanchar el documento (en movil Chrome aleja la pagina entera).
    <section id="destacados" className="relative scroll-mt-20 overflow-x-clip py-10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-[52rem] pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Selección destacada
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.95rem,4.6vw,3.2rem)] leading-[1.1] font-light tracking-[-0.005em] text-parchment">
            Cinco títulos que vale la pena
            <span className="block italic text-mist">abrir primero.</span>
          </h2>
        </Reveal>

        {featured.map((b, i) => (
          <Item key={b.id} book={b} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
