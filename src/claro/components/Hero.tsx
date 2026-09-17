import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { books, areas, type Book } from "../../data/books";
import { papelLibro, tintaLibro } from "../lib/lomo";
import { Atmosfera } from "./Atmosfera";
import { Cover } from "./Cover";
import { Estante } from "./Estante";

const ficcion = books.filter((b) => b.moods.includes("escapar")).length;

const ENTRADA = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero({ onAbrir }: { onAbrir: (b: Book) => void }) {
  // La vitrina arranca con el primero del estante y sigue al que se mira.
  const [mirado, setMirado] = useState<Book>(books[0]);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTexto = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative overflow-hidden pt-6 pb-0 sm:pt-10">
      <Atmosfera />

      <motion.div
        style={{ y: yTexto, opacity: opacidad }}
        className="relative mx-auto max-w-[1280px] px-5 sm:px-8"
      >
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
          className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16"
        >
          <div>
            <motion.span
              variants={ENTRADA}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/70 py-2 pr-5 pl-2.5 text-[13px] font-medium text-tinta-media shadow-[var(--shadow-posada)] backdrop-blur-md"
            >
              <span className="relative grid size-5 place-items-center">
                <span className="absolute size-2 rounded-full bg-cian" />
                <span className="absolute size-2 animate-ping rounded-full bg-cian" />
              </span>
              Novedades de septiembre
            </motion.span>

            <motion.h1
              variants={ENTRADA}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.3, 1] }}
              className="mt-7 max-w-[17ch] text-[clamp(2.25rem,4.8vw,3.6rem)] leading-[1.06] font-light tracking-[-0.02em] text-tinta"
            >
              Cuarenta y tres libros entraron este semestre.
            </motion.h1>

            <motion.p
              variants={ENTRADA}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.3, 1] }}
              className="mt-6 max-w-[50ch] text-pretty text-[17px] leading-[1.7] text-tinta-media sm:text-[18px]"
            >
              Ya están clasificados y en el estante, cada uno con su número. Recorre
              los lomos de abajo: al posarte en uno, el libro asoma.
            </motion.p>

            <motion.div
              variants={ENTRADA}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#necesitas"
                className="group relative overflow-hidden rounded-full bg-indigo px-7 py-4 text-[14.5px] font-semibold text-white shadow-[var(--shadow-flotante)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-0.5"
              >
                <span className="relative z-10">Buscar por lo que necesito</span>
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 transition-[left] duration-700 ease-out group-hover:left-[150%]"
                />
              </a>
              <a
                href="#catalogo"
                className="rounded-full bg-white/80 px-7 py-4 text-[14.5px] font-medium text-tinta shadow-[var(--shadow-posada)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-0.5 hover:text-cian-texto hover:shadow-[var(--shadow-flotante)]"
              >
                Ver los 43 títulos
              </a>
            </motion.div>

            <motion.dl
              variants={ENTRADA}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap gap-x-12 gap-y-5"
            >
              {[
                [books.length, "títulos nuevos"],
                [areas.length, "áreas del conocimiento"],
                [ficcion, "novelas"],
              ].map(([n, etiqueta]) => (
                <div key={etiqueta as string}>
                  <dt className="cifras text-[30px] leading-none font-light text-indigo">{n}</dt>
                  <dd className="mt-2 text-[13.5px] text-tinta-tenue">{etiqueta}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Vitrina: el libro que se está mirando en el estante */}
          <motion.aside
            variants={ENTRADA}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.3, 1] }}
            aria-live="polite"
            className="hidden lg:block"
          >
            <div className="relative [perspective:1400px]">
              <motion.span
                aria-hidden
                key={`halo-${mirado.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full blur-[55px]"
                style={{ background: `radial-gradient(circle, ${mirado.accent}44, transparent 70%)` }}
              />

              <button
                type="button"
                onClick={() => onAbrir(mirado)}
                className="group block w-full cursor-pointer text-left"
              >
                <div className="relative h-[300px] w-full">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={mirado.id}
                      initial={{ opacity: 0, y: 28, rotateX: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 210, damping: 26, mass: 0.7 }}
                      className="absolute inset-0 [transform-style:preserve-3d]"
                    >
                      <Cover
                        book={mirado}
                        priority
                        className="h-full w-full rounded-2xl p-4 shadow-[var(--shadow-alzada)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.3,1)] group-hover:-translate-y-1.5"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-5 min-h-[104px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={mirado.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.3, 1] }}
                    >
                      <span
                        className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold"
                        style={{
                          background: papelLibro(mirado.accent),
                          color: tintaLibro(mirado.accent),
                        }}
                      >
                        {mirado.area}
                      </span>
                      <p className="font-libro mt-3 text-[18px] leading-snug text-tinta">
                        {mirado.titulo}
                      </p>
                      <p className="mt-1 text-[14px] text-tinta-media">{mirado.autor}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      </motion.div>

      {/* El estante, a sangre: sigue más allá del borde de la pantalla */}
      <div className="relative mt-6 sm:mt-8">
        <Estante onMirar={setMirado} onAbrir={onAbrir} mirado={mirado} />
        <p className="mx-auto mt-5 max-w-[1280px] px-5 text-[13px] text-tinta-tenue sm:px-8">
          Los 43 lomos, en el orden en que están en la estantería: de 002.09 a
          S.G.&nbsp;378.166. Arrastra la fila para recorrerlos.
        </p>
      </div>
    </section>
  );
}
