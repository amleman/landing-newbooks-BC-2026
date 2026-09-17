const CORREO = "bibliotecacentral@usac.edu.gt";
const DIRECCION =
  "Ciudad Universitaria Zona 12, Edificio de Recursos Educativos, Ciudad de Guatemala";

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

const datos = [
  ["Dónde", DIRECCION],
  ["Horario", "Lunes a viernes, de 8:00 a 19:00"],
  ["Qué llevar", "Carné de estudiante vigente"],
];

/** El pie es el único bloque oscuro: cierra la página y le da suelo. */
export function Footer() {
  return (
    <footer id="visitar" className="scroll-mt-20 bg-indigo text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div>
            <h2 className="max-w-[18ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] font-light">
              Los 43 están arriba. Falta que subas por uno.
            </h2>
            <p className="mt-6 max-w-[50ch] text-pretty text-[16px] leading-[1.75] text-white/72">
              Puedes reservarlos desde el catálogo en línea o llegar con la signatura
              anotada. Los dos caminos terminan igual.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://biblos.usac.edu.gt/opac/"
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full bg-white px-6 py-3.5 text-[14.5px] font-semibold text-indigo transition-colors duration-200 hover:bg-cian-papel"
              >
                Abrir el catálogo Biblos
              </a>
              <a
                href="#catalogo"
                className="rounded-full border border-white/28 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:border-white/70"
              >
                Volver a las novedades
              </a>
            </div>

            <dl className="mt-14 grid gap-8 sm:grid-cols-3">
              {datos.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[13px] font-semibold text-cian">{k}</dt>
                  <dd className="mt-2 text-[14.5px] leading-[1.65] text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:w-[16rem]">
            <img
              src="/logo-bc.webp"
              alt="Biblioteca Central"
              width={520}
              height={513}
              className="h-auto w-[124px]"
            />
            <p className="mt-5 text-[13px] leading-[1.7] text-white/60">
              Universidad de San Carlos de Guatemala
            </p>

            <h3 className="mt-9 text-[13px] font-semibold text-cian">Contacto</h3>
            <a
              href={"mailto:" + CORREO}
              className="mt-2 block text-[14.5px] break-all text-white underline-offset-4 hover:underline"
            >
              {CORREO}
            </a>

            <ul className="mt-7 flex gap-2.5">
              {redes.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={r.nombre + " de la Biblioteca Central"}
                    className="grid size-10 place-items-center rounded-full border border-white/22 text-white/80 transition-colors duration-200 hover:border-white hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
                      <path d={r.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-white/14 pt-7 text-[12.5px] leading-[1.7] text-white/50">
          Nuevas adquisiciones de septiembre de 2026. Las portadas y las sinopsis se
          reproducen con fines informativos y pertenecen a sus editoriales.
        </p>
      </div>
    </footer>
  );
}
