/**
 * Los enlaces de las fichas vienen del Excel de Biblos, no de código nuestro.
 * Si una lista futura trae `javascript:...`, un `data:` o un dominio ajeno,
 * ese valor acabaría en un `href` y se convertiría en un enlace vivo dentro de
 * la página de la Biblioteca. Aquí se decide qué se considera un enlace válido.
 *
 * El import (tools/import_excel.py) ya filtra lo mismo; esta es la segunda
 * barrera, por si alguien edita src/data/books.ts a mano.
 */

/** Dominios a los que la página tiene permitido enlazar. */
const HOSTS_PERMITIDOS = new Set([
  "biblos.usac.edu.gt",
  "www.facebook.com",
  "www.instagram.com",
  "twitter.com",
  "x.com",
  "www.youtube.com",
  // Crédito obligatorio de la música de fondo (ver el pie de página).
  "pixabay.com",
  "www.pixabay.com",
  // Perfil de quien desarrolló el sitio (ver el «acerca de»).
  "www.linkedin.com",
  "linkedin.com",
]);

/**
 * Devuelve la URL si es https y apunta a un dominio permitido; si no, null.
 * Quien la use debe tratar el null como «no hay enlace» y no pintar el <a>.
 */
export function safeUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return null; // no es una URL absoluta: fuera
  }
  if (parsed.protocol !== "https:") return null;
  if (!HOSTS_PERMITIDOS.has(parsed.hostname.toLowerCase())) return null;
  return parsed.toString();
}
