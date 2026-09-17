import { fileURLToPath } from "node:url";
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
  "media-src 'none'",
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
 * En GitHub Pages, en cambio, un repositorio se publica dentro de una
 * subcarpeta (`https://<usuario>.github.io/<repo>/`), así que todas las rutas
 * de assets tienen que llevar ese prefijo o el navegador las pide a la raíz y
 * recibe 404. El workflow de .github/workflows/deploy.yml pone
 * `VITE_BASE=/<repo>/` antes de compilar; en local no hace falta nada.
 *
 * En el código, cualquier ruta de `public/` se arma con `rutaPublica()`
 * (src/lib/rutas.ts), que lee este mismo valor en tiempo de ejecución.
 */
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,

  plugins: [react(), tailwindcss(), cspMeta()],

  build: {
    // Sin sourcemaps: publicarlos entregaría el código original al visitante.
    sourcemap: false,

    // Dos propuestas en paralelo, cada una con su propia página:
    //   index.html → versión oscura   (src/)
    //   claro.html → versión clara    (src/claro/)
    // No comparten ni componentes ni hoja de estilos; sí los datos de
    // src/data/, la validación de enlaces de src/lib/ y todo lo de public/.
    rollupOptions: {
      input: {
        oscura: fileURLToPath(new URL("./index.html", import.meta.url)),
        clara: fileURLToPath(new URL("./claro.html", import.meta.url)),
      },
    },
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
