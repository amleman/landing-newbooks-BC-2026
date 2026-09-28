<div align="center">

# 📚 Novedades — Biblioteca Central USAC

[![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-6-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/python-3.11+-3776AB?logo=python&logoColor=white&style=flat-square)](https://www.python.org)

[![Static Site](https://img.shields.io/badge/sitio-est%C3%A1tico-555?style=flat-square)](#)
[![Nginx](https://img.shields.io/badge/nginx-apache-009639?logo=nginx&logoColor=white&style=flat-square)](deploy)
[![License: MIT](https://img.shields.io/badge/licencia-MIT-yellow.svg?style=flat-square)](LICENSE)

### 🎓 Descubre las nuevas adquisiciones de la Biblioteca Central

Landing de las nuevas adquisiciones de la Biblioteca Central de la Universidad
de San Carlos de Guatemala: 43 títulos con portada, sinopsis, signatura y
enlace directo a su ficha en Biblos.

[Instalación](#-instalación-y-desarrollo) · [Despliegue](#-despliegue-en-un-servidor-linux) · [Seguridad](#-seguridad)

</div>

---

## 🧱 Stack

| Tecnología | Versión |
|---|---|
| Node.js | ≥ 20.19 (recomendado 22 LTS) |
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Motion | 13 |

Sitio completamente estático: sin backend, sin base de datos, sin sesiones.

## ✅ Requisitos

- Node.js ≥ 20.19 y npm.
- Un servidor Linux con Nginx o Apache para publicar (no requiere Node en producción).

## 🚀 Instalación y desarrollo

```bash
npm install
npm run dev
```

Vite sirve el sitio en `http://localhost:5173/`.

## 📦 Compilación

```bash
npm run build
```

Genera `dist/`: una carpeta de archivos estáticos (~2.4 MB) que se copia tal
cual al servidor. No necesita Node, backend ni base de datos en producción.

```bash
npm run preview   # sirve dist/ en local para verificarlo antes de publicar
```

## 🌐 Despliegue en un servidor Linux

1. Compilar el proyecto y copiar el contenido de `dist/` a la ruta que sirva
   el servidor web (por ejemplo `/var/www/novedades`).
2. Aplicar la configuración correspondiente de `deploy/`:

   | Servidor | Archivo | Dónde va |
   |---|---|---|
   | Nginx | `deploy/nginx.conf` | dentro del bloque `server` |
   | Apache | `deploy/.htaccess` | en la raíz de la carpeta publicada |

   Ambas configuran cabeceras de seguridad, caché, compresión, redirección a
   HTTPS y desactivan el listado de directorios.
3. Recargar el servidor:

   ```bash
   nginx -t && nginx -s reload
   # o, con Apache:
   a2enmod headers rewrite deflate && systemctl reload apache2
   ```

Solo debe publicarse el contenido de `dist/`. `tools/`, `brand/` y
`node_modules/` no deben copiarse al servidor.

## 📖 Actualizar el catálogo

Los datos no se escriben a mano: salen del `.xls` que exporta Biblos,
incluidas las portadas.

```bash
pip install xlrd olefile Pillow
python tools/import_excel.py "ruta/a/Lista de Libros Nuevos.xls"
```

El script extrae los datos y las portadas, y genera `src/data/books.ts`. Los
textos editoriales (ganchos, áreas y "momentos" de cada título) se definen a
mano en `tools/copy_editorial.py` antes de correr el import.

## 🗂️ Estructura

```
deploy/                 Configuración del servidor (nginx / apache)
tools/
  import_excel.py       Extrae datos y portadas del .xls -> src/data/books.ts
  copy_editorial.py     Ganchos, áreas y momentos por título (lo editable)
  build_assets.py       Fuentes a WOFF2 y recortes del logo
src/
  data/                 Datos generados y taxonomía de "momentos"
  lib/                  Utilidades (validación de enlaces, rutas)
  components/           Componentes de la interfaz
public/                 Lo que se publica: portadas, fuentes web, logos
```

## 🔒 Seguridad

La página no recibe datos de nadie: sin formularios, login, comentarios,
analítica ni scripts de terceros.

- Los enlaces a Biblos se validan contra una lista blanca de dominios, tanto
  al importar (`tools/import_excel.py`) como en el navegador (`src/lib/url.ts`).
- Sin `dangerouslySetInnerHTML`, `innerHTML` ni `eval`; todo el contenido del
  Excel se renderiza como texto escapado.
- Enlaces externos con `rel="noreferrer noopener"`.
- Sin cookies, `localStorage` de datos personales ni peticiones de red a
  terceros.
- Sin sourcemaps en producción.
- Cabeceras de seguridad estrictas (`deploy/`): CSP, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.

```bash
npm audit
npm outdated
```

Conviene correrlo antes de cada `npm run build`, ya que una vulnerabilidad en
una dependencia solo llega al visitante si se recompila y se republica.

Queda a cargo del servidor: certificado HTTPS válido (para activar
`Strict-Transport-Security`) y mantener el sistema operativo al día.

## 🔊 Sonido

La cabecera tiene un interruptor que activa música de fondo y microsonidos de
interfaz. Arranca siempre apagado y no se autoenciende, aunque la preferencia
se recuerde en `localStorage`. El crédito de la música (licencia con
atribución obligatoria) está en el pie de página.

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE), que detalla el material de terceros excluido
(tipografías, música, contenido de la Biblioteca).

<div align="center">

Diseño y desarrollo: **Anthony Alemán** — 2026

</div>
