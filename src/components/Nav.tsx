import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { rutaPublica } from "../lib/rutas";
import { BotonSonido } from "./BotonSonido";

const links = [
  { href: "#momentos", label: "Momentos" },
  { href: "#destacados", label: "Destacados" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#visitar", label: "Visitar" },
];

/** Separador fino entre el bloque de la Biblioteca y los logos institucionales. */
function Filete() {
  return <span aria-hidden className="hidden h-8 w-px shrink-0 bg-white/14 xl:block" />;
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,backdrop-filter,border-color] duration-500 ${
          solid
            ? "border-b border-white/8 bg-navy-950/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:h-[72px] sm:px-8">
          {/* Fila institucional: USAC · Biblioteca Central · acreditaciones.
              Los logos secundarios solo aparecen desde xl: por debajo no cabrían
              junto a los enlaces y el botón de Biblos. */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <img
              src={rutaPublica("/LOGOTIPOS_USAC_LOGO-2-OFICIAL-BLANCO-1024x440.png")}
              alt="Universidad de San Carlos de Guatemala"
              width={1024}
              height={440}
              className="hidden h-10 w-auto shrink-0 opacity-90 xl:block"
            />

            <Filete />

            <a href="#inicio" className="group flex shrink-0 items-center gap-3">
              <img
                src={rutaPublica("/logo-mark.webp")}
                alt=""
                aria-hidden="true"
                width={240}
                height={179}
                className="h-9 w-auto shrink-0 transition-opacity duration-300 group-hover:opacity-80 sm:h-10"
              />
              <span className="block text-[17px] leading-none font-semibold tracking-[0.015em] whitespace-nowrap text-parchment">
                Biblioteca Central
              </span>
              <span className="sr-only">Ir al inicio</span>
            </a>

            <Filete />

            <img
              src={rutaPublica("/hceres.png")}
              alt="Acreditación internacional Hcéres"
              width={222}
              height={223}
              className="hidden h-10 w-auto shrink-0 opacity-90 xl:block"
            />
            <img
              src={rutaPublica("/cropped-Nuevo-Logotipo-CEAI.png")}
              alt="CEAI UDUALC · Consejo de Evaluación y Acreditación Internacional"
              width={841}
              height={561}
              className="hidden h-12 w-auto shrink-0 opacity-90 xl:block"
            />
          </div>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-full px-3.5 py-2 text-[14px] font-medium text-mist transition-colors duration-300 hover:text-parchment"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2.5">
          <BotonSonido />

          <a
            href="https://biblos.usac.edu.gt/opac/"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative overflow-hidden rounded-full border border-sky/35 bg-usac/15 px-4 py-2 text-[13.5px] font-semibold text-sky-soft transition-all duration-300 hover:border-sky/70 hover:bg-usac/30 hover:text-parchment sm:px-5"
          >
            <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
              <span>
                <span className="hidden sm:inline">Catálogo </span>Biblos
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>
          </div>
        </nav>
      </div>

      <motion.div
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-navy-700 via-usac to-gold"
      />
    </header>
  );
}
