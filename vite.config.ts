import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Política de seguridad de contenido.
 *
 * La página es estática y no habla con nadie: no hay API, ni formularios, ni
 * analítica, ni scripts de terceros. Esta política dice exactamente eso, así
 * que si alguien lograra colar una etiqueta en el HTML, el navegador se
 * negaría a ejecutarla.
 *
 *   default-src 'self'   nada se carga de fuera del propio servidor
 *   img-src … data:      las portadas y el placeholder en base64
 *   style-src 'self'     el CSS va en un archivo aparte; no hay <style>
 *   connect-src 'none'   la página no hace ni una sola petición de red
 *   media-src 'self'     la música de fondo, servida por la propia página
 *   object-src 'none'    sin <object>, <embed> ni Flash heredado
 *   base-uri 'none'      nadie puede reescribir la base de las rutas
 *   form-action 'none'   no hay formularios: ninguno puede enviarse
 *
 * frame-ancestors no funciona en <meta>: contra el clickjacking hace falta
 * la cabecera HTTP. Está en los tres archivos de deploy/.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "media-src 'self'",
  "worker-src 'none'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Inyecta la CSP solo en la compilación de producción: en desarrollo, Vite
 * necesita websockets y estilos en línea para recargar en caliente.
 */
function cspMeta(): Plugin {
  return {
    name: "csp-meta",
    apply: "build",
    transformIndexHtml(html) {
      // Detrás del charset: esa declaración tiene que caer en el primer KB.
      const charset = '<meta charset="UTF-8" />';
      return html.replace(
        charset,
        `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
      );
    },
  };
}

/**
 * Prefijo de rutas del sitio.
 *
 * En un servidor propio la landing vive en la raíz del dominio y esto es "/".
 * GitHub Pages, en cambio, publica un repositorio dentro de una subcarpeta
 * (`https://<usuario>.github.io/<repo>/`), así que todas las rutas de assets
 * tienen que llevar ese prefijo o el navegador las pide a la raíz y recibe
 * 404.
 *
 * No hace falta configurar nada: en GitHub Actions la variable
 * `GITHUB_REPOSITORY` viene como "usuario/repo", y de ahí sale el prefijo
 * solo — si algún día se renombra el repositorio, esto sigue funcionando.
 * `VITE_BASE` queda como escape a mano (por ejemplo para un dominio propio,
 * donde el prefijo vuelve a ser "/").
 *
 * Ojo con probar `VITE_BASE=/algo/` desde Git Bash en Windows: convierte el
 * valor a una ruta de Windows y rompe la compilación. Usa PowerShell, o
 * mejor `GITHUB_REPOSITORY=usuario/repo` para simular Pages en local.
 *
 * Vite reescribe con este prefijo lo que él mismo ve: las rutas del HTML y
 * las `url()` del CSS. Las que viven como cadena de texto en el JSX o en
 * src/data/books.ts pasan por `rutaPublica()` (src/lib/rutas.ts).
 */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.VITE_BASE ?? (repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/");

export default defineConfig({
  base,

  plugins: [react(), tailwindcss(), cspMeta()],

  build: {
    // Sin sourcemaps: publicarlos entregaría el código original al visitante.
    sourcemap: false,
  },

  server: {
    // host: true publica el servidor de desarrollo en la red local para poder
    // abrirlo desde el teléfono. Es SOLO para desarrollo dentro de la red de
    // la Biblioteca: lo que se publica en internet es la carpeta dist/.
    host: true,
    port: 5173,
    strictPort: true,
    fs: {
      // Impide que el servidor de desarrollo sirva archivos de fuera del
      // proyecto si alguien pide una ruta con ../
      strict: true,
    },
  },

  preview: {
    // `npm run preview` sirve la compilación real, también accesible en red.
    host: true,
    port: 4173,
  },
});
