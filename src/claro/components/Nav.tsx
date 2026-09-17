import { useEffect, useState } from "react";

const enlaces = [
  { href: "#necesitas", texto: "Qué necesitas" },
  { href: "#recomendamos", texto: "Recomendaciones" },
  { href: "#catalogo", texto: "Los 43" },
  { href: "#visitar", texto: "Visitar" },
];

export function Nav() {
  const [posado, setPosado] = useState(false);

  useEffect(() => {
    const alScroll = () => setPosado(window.scrollY > 40);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        posado ? "cristal shadow-[0_1px_0_rgb(16_23_51_/_0.06),0_8px_24px_-16px_rgb(16_23_51_/_0.25)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3">
          <img
            src="/logo-color.webp"
            alt="Biblioteca Central, Universidad de San Carlos de Guatemala"
            width={720}
            height={228}
            className="h-10 w-auto sm:h-11"
          />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {enlaces.map((e) => (
            <li key={e.href}>
              <a
                href={e.href}
                className="text-[14.5px] font-medium text-tinta-media transition-colors duration-200 hover:text-cian-texto"
              >
                {e.texto}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://biblos.usac.edu.gt/opac/"
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-full bg-indigo px-5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap text-white shadow-[var(--shadow-posada)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.3,1)] hover:-translate-y-0.5 hover:bg-indigo-hondo hover:shadow-[var(--shadow-flotante)]"
        >
          Buscar en Biblos
        </a>
      </nav>
    </header>
  );
}
