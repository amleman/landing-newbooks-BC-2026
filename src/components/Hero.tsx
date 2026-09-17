import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { books } from "../data/books";
import { CoverWall } from "./CoverWall";
import { Aurora } from "./Aurora";
import { RevealWords } from "./Reveal";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0">
        <CoverWall />
      </div>
      <Aurora className="opacity-70" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 py-1.5 pl-2 pr-4 backdrop-blur-md"
        >
          <span className="relative grid size-6 place-items-center">
            <span className="absolute size-2 rounded-full bg-gold" />
            <span
              className="absolute size-2 rounded-full bg-gold"
              style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
            />
          </span>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-mist">
            <span className="hidden sm:inline">Nuevas adquisiciones</span>
            <span className="sm:hidden">Novedades</span> · Septiembre 2026
          </span>
        </motion.div>

        <h1 className="max-w-[16ch] font-display text-[clamp(2.6rem,7.2vw,6.1rem)] leading-[1.02] font-light tracking-[-0.005em] text-parchment">
          <RevealWords text="Acaban de llegar" delay={0.12} />
          <span className="mt-1 block">
            <motion.span
              initial={{ opacity: 0, scale: 0.86, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-br from-gold-soft via-gold to-[#8a6d14] bg-clip-text font-semibold italic text-transparent"
            >
              {books.length} libros
            </motion.span>
            <RevealWords text=" a tu biblioteca." delay={0.78} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-[54ch] text-pretty text-[17px] leading-[1.75] text-mist sm:text-[18.5px]"
        >
          Ninguno de estos títulos estaba aquí el semestre pasado. Están en estantería,
          disponibles para préstamo y esperando a que alguien los abra primero.
          <span className="text-parchment"> Que seas tú.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3.5"
        >
          <a
            href="#momentos"
            className="group relative overflow-hidden rounded-full bg-parchment px-7 py-3.5 text-[14.5px] font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99]"
          >
            <span className="relative z-10">¿Qué estás buscando hoy?</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#catalogo"
            className="rounded-full border border-white/18 px-7 py-3.5 text-[14.5px] font-medium text-parchment backdrop-blur-md transition-colors duration-300 hover:border-white/45 hover:bg-white/6"
          >
            Ver los {books.length} títulos
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-7 z-10 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-mist-dim">
            Desplaza
          </span>
          <span className="relative h-9 w-[22px] rounded-full border border-white/22">
            <span
              className="absolute left-1/2 top-2 size-1 -translate-x-1/2 rounded-full bg-sky"
              style={{ animation: "scroll-hint 1.9s ease-in-out infinite" }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
