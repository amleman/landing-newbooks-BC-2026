import { books } from "../data/books";
import { Aurora } from "./Aurora";
import { Reveal } from "./Reveal";
import { rutaPublica } from "../lib/rutas";

const CORREO = "bibliotecacentral@usac.edu.gt";
const DIRECCION =
  "Ciudad Universitaria Zona 12, Edificio de Recursos Educativos, Ciudad de Guatemala";

/**
 * Crédito de la música de fondo, exigido por la licencia de Pixabay con la
 * que se descargó la pista (los parámetros utm_ son los que da Pixabay en su
 * texto de atribución; se dejan tal cual para que el crédito sea el que ellos
 * piden). Si algún día se quita la música, esto se quita con ella.
 */
const AUTOR_MUSICA =
  "https://pixabay.com/users/sigmamusicart-36860929/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=412597";
const PIXABAY =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=412597";

const datos = [
  { k: "Dónde", v: DIRECCION },
  { k: "Horario", v: "Lunes a viernes · 8:00 a 19:00 h" },
  { k: "Qué llevar", v: "Carné de estudiante vigente" },
];

/** Iconos de marca dibujados en línea: no hay que cargar ninguna librería. */
const redes = [
  {
    nombre: "Facebook",
    url: "https://www.facebook.com/BiblioUSACentral",
    path: "M14 8.5h2V5.6h-2.4c-2.3 0-3.6 1.4-3.6 3.7V11H8v3h2v7h3v-7h2.3l.4-3H13V9.6c0-.8.3-1.1 1-1.1Z",
  },
  {
    nombre: "Instagram",
    url: "https://www.instagram.com/bibliocentralusac",
    path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0ZM16 3.5H8A4.5 4.5 0 0 0 3.5 8v8A4.5 4.5 0 0 0 8 20.5h8a4.5 4.5 0 0 0 4.5-4.5V8A4.5 4.5 0 0 0 16 3.5Zm2.9 12.5a2.9 2.9 0 0 1-2.9 2.9H8A2.9 2.9 0 0 1 5.1 16V8A2.9 2.9 0 0 1 8 5.1h8A2.9 2.9 0 0 1 18.9 8v8Z",
  },
  {
    nombre: "X",
    url: "https://twitter.com/bibliocentralu1",
    path: "M17.2 4h2.6l-5.7 6.5L20.8 20h-5.2l-4.1-5.4L6.7 20H4.1l6.1-7-6-9h5.3l3.7 4.9L17.2 4Zm-.9 14.4h1.4L8.2 5.5H6.7l9.6 12.9Z",
  },
  {
    nombre: "YouTube",
    url: "https://www.youtube.com/@bibliousac",
    path: "M21.3 8.1a2.4 2.4 0 0 0-1.7-1.7C18.1 6 12 6 12 6s-6.1 0-7.6.4A2.4 2.4 0 0 0 2.7 8.1C2.3 9.6 2.3 12 2.3 12s0 2.4.4 3.9a2.4 2.4 0 0 0 1.7 1.7C5.9 18 12 18 12 18s6.1 0 7.6-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-3.9.4-3.9s0-2.4-.4-3.9ZM10.1 14.9V9.1l5.1 2.9-5.1 2.9Z",
  },
];

export function Footer({ onAcercaDe }: { onAcercaDe: () => void }) {
  return (
    <footer id="visitar" className="relative scroll-mt-20 overflow-hidden border-t border-white/8">
      <Aurora className="opacity-55" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-[60ch]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            El último paso
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-light tracking-[-0.005em] text-parchment">
            Los {books.length} están en estantería
            <span className="block italic text-mist">Falta que vengas por uno</span>
          </h2>
          <p className="mt-7 max-w-[52ch] text-pretty text-[16px] leading-[1.75] text-mist">
            Puedes reservarlos desde el catálogo en línea o llegar directamente con la signatura
            anotada. Cualquiera de los dos caminos termina igual: con el libro en tu mochila.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://biblos.usac.edu.gt/opac/"
              target="_blank"
              rel="noreferrer noopener"
              className="group relative overflow-hidden rounded-full bg-parchment px-7 py-3.5 text-[14.5px] font-semibold text-navy-950 transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="relative z-10">Abrir el catálogo Biblos ↗</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#catalogo"
              className="rounded-full border border-white/18 px-7 py-3.5 text-[14.5px] font-medium text-parchment transition-colors duration-300 hover:border-white/45 hover:bg-white/6"
            >
              Volver a las novedades
            </a>
          </div>
        </Reveal>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/9 bg-white/8 sm:grid-cols-3">
          {datos.map((d) => (
            <div key={d.k} className="bg-navy-950 px-6 py-7">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                {d.k}
              </dt>
              <dd className="mt-2.5 text-[15px] leading-[1.6] text-parchment">{d.v}</dd>
            </div>
          ))}
        </dl>

        {/* ── Identidad y contacto ─────────────────────────────────────── */}
        <div className="mt-20 grid gap-12 border-t border-white/8 pt-12 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
          <div>
            <img
              src={rutaPublica("/logo-bc.webp")}
              alt="Biblioteca Central"
              width={520}
              height={513}
              className="h-auto w-[132px]"
            />
            <p className="mt-5 w-[15.5rem] text-[12px] leading-[1.75] uppercase tracking-[0.11em] text-mist-dim">
              Universidad de San Carlos de Guatemala
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                Contacto
              </h3>
              <a
                href={`mailto:${CORREO}`}
                className="mt-3 inline-block text-[15px] text-sky-soft underline-offset-4 transition-colors duration-300 hover:text-parchment hover:underline"
              >
                {CORREO}
              </a>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.65] text-mist">{DIRECCION}</p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                Síguenos
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {redes.map((r) => (
                  <li key={r.nombre}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${r.nombre} de la Biblioteca Central`}
                      className="group grid size-11 place-items-center rounded-full border border-white/12 text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-sky/50 hover:bg-usac/15 hover:text-parchment"
                    >
                      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                        <path d={r.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-[34ch] text-[12px] leading-[1.7] text-mist-dim lg:text-right">
            <p>
              Listado de nuevas adquisiciones, septiembre&nbsp;2026.
              <br />
              Portadas y sinopsis con fines informativos, propiedad de sus respectivas editoriales.
            </p>

            {/* Crédito de la música de fondo. No es cortesía: es la condición
                de la licencia con la que se descargó la pista. Si cambia la
                música (src/lib/sonido.ts), cambia esto. */}
            <p className="mt-3">
              <button
                type="button"
                onClick={onAcercaDe}
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-mist hover:decoration-white/50"
              >
                Acerca de este sitio
              </button>
            </p>

            <p className="mt-3">
              Música de{" "}
              <a
                href={AUTOR_MUSICA}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-mist hover:decoration-white/50"
              >
                Mikhail Smusev
              </a>{" "}
              en{" "}
              <a
                href={PIXABAY}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-mist hover:decoration-white/50"
              >
                Pixabay
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
