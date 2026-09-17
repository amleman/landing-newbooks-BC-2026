/**
 * Arma la URL de un archivo de `public/` respetando el prefijo del sitio.
 *
 * Las rutas absolutas escritas a mano (`/logo-mark.webp`, `/covers/01.webp`)
 * funcionan mientras la landing viva en la raíz del dominio, pero en GitHub
 * Pages el sitio se sirve dentro de una subcarpeta y esas rutas apuntarían
 * fuera del sitio. Vite reescribe las referencias que él mismo ve (las del
 * HTML y las del CSS), pero no las que son solo cadenas de texto dentro del
 * JSX o de `src/data/books.ts`: esas pasan por aquí.
 *
 * `import.meta.env.BASE_URL` es el `base` de vite.config.ts y siempre acaba
 * en "/": vale "/" en desarrollo y "/<repo>/" en la compilación de Pages.
 */
export function rutaPublica(ruta: string): string {
  return `${import.meta.env.BASE_URL}${ruta.replace(/^\/+/, "")}`;
}
