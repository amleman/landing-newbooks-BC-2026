# Novedades · Biblioteca Central USAC

Landing de las nuevas adquisiciones de la Biblioteca Central de la Universidad
de San Carlos de Guatemala. 43 títulos, con portada, sinopsis, signatura y
enlace directo a su ficha en Biblos.

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion.
Sitio completamente estático: no hay backend, ni base de datos, ni sesiones.

---

## Arrancar el proyecto

```bash
npm install
npm run dev
```

Vite imprime dos direcciones:

```
  ➜  Local:    http://localhost:5173/
  ➜  Network:  http://10.84.2.188:5173/     ← ésta se abre desde el celular
```

La de **Network** funciona desde cualquier dispositivo conectado a la misma red
(el mismo wifi). Si el celular no carga, casi siempre es el Firewall de Windows:
la primera vez pregunta si permite Node.js en redes privadas y hay que decir que
sí. La IP cambia cuando la máquina se reconecta a la red, así que conviene mirar
lo que imprime Vite cada vez.

Para ver la versión compilada (la real, con la CSP puesta) también desde el
celular:

```bash
npm run build
npm run preview
```

> El servidor de `npm run dev` es **solo para desarrollo dentro de la red de la
> Biblioteca**. Nunca debe quedar expuesto a internet: lo que se publica es la
> carpeta `dist/`, servida por Nginx, Apache o IIS.

---

## Publicar

```bash
npm run build
```

Genera `dist/`: una carpeta de archivos estáticos (~2.4 MB) que se copia tal cual
al servidor. No necesita Node, ni backend, ni base de datos.

Junto a ella hay que poner la configuración del servidor, en `deploy/`:

| Servidor | Archivo | Dónde va |
|---|---|---|
| Nginx | `deploy/nginx.conf` | dentro del bloque `server` |
| Apache | `deploy/.htaccess` | en la raíz de la carpeta publicada |
| IIS | `deploy/web.config` | en la raíz de la carpeta publicada |

Los tres hacen lo mismo: cabeceras de seguridad, sin listados de directorio,
caché correcta y redirección a HTTPS (comentada hasta que haya certificado).

---

## Seguridad

La página no recibe datos de nadie: no hay formularios, ni login, ni comentarios,
ni analítica, ni scripts de terceros. Eso elimina de entrada casi toda la
superficie de ataque habitual. Lo que sí se hizo:

**En el código**

- **Enlaces validados en dos capas.** El campo `enlace` de cada libro viene del
  Excel, y acaba en un `href`. Un `javascript:...` o un dominio ajeno en esa
  celda sería un enlace vivo dentro del sitio de la Biblioteca. Se filtra al
  importar (`tools/import_excel.py`) y otra vez en el navegador
  (`src/lib/url.ts`): solo pasa `https://` hacia dominios de una lista blanca.
  Si un enlace no pasa, la ficha se muestra sin botón en vez de con un botón
  peligroso.
- **Sin `dangerouslySetInnerHTML`, sin `innerHTML`, sin `eval`.** Todo el texto
  del Excel se pinta como texto: React lo escapa solo. Un `<script>` dentro de
  una sinopsis se vería como texto literal, no se ejecutaría.
- **Todos los enlaces externos llevan `rel="noreferrer noopener"`**, así la
  pestaña de destino no puede manipular la nuestra ni ver de dónde viene.
- **Sin cookies, sin `localStorage`, sin peticiones de red.** Verificado sobre
  la compilación real: la página no contacta ni un solo dominio externo. No hay
  nada que interceptar ni nada que filtrar.
- **Sin sourcemaps en producción**: publicarlos entregaría el código original.

**En las cabeceras** (`deploy/`)

- `Content-Security-Policy` estricta: todo `'self'`, `connect-src 'none'`,
  `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Si alguien
  lograra inyectar una etiqueta en el HTML, el navegador se negaría a
  ejecutarla. La compilación ya la incluye como `<meta>`; la cabecera del
  servidor la refuerza y añade `frame-ancestors`, que en `<meta>` no funciona.
- `X-Frame-Options: DENY` + `frame-ancestors 'none'` — contra clickjacking:
  nadie puede meter la página dentro de un iframe para engañar a un visitante.
- `X-Content-Type-Options: nosniff` — el navegador respeta el tipo declarado y
  no intenta adivinarlo.
- `Referrer-Policy: strict-origin-when-cross-origin` — al salir hacia Biblos no
  se filtra la ruta completa.
- `Permissions-Policy` — se renuncia explícitamente a cámara, micrófono,
  ubicación, pagos y USB, que la página no usa.
- Cabeceras de versión del servidor eliminadas, y listados de directorio
  desactivados.

**Mantenimiento**

```bash
npm audit          # hoy: 0 vulnerabilidades
npm outdated
```

Conviene correrlo cada vez que se toque el proyecto. Como no hay backend, una
vulnerabilidad en una dependencia solo puede llegar al visitante si se
recompila y se vuelve a publicar: revisar antes de cada `npm run build`.

**Lo que queda fuera de este repositorio** y depende del servidor de la
Biblioteca: tener HTTPS con certificado válido (y entonces descomentar
`Strict-Transport-Security`), el sistema operativo al día, y que la carpeta
publicada contenga **solo** el contenido de `dist/` — nunca `tools/`, `brand/`,
`node_modules/` ni el repositorio.

---

## Cómo se cargan los libros

Los datos **no se escriben a mano**. Salen del mismo `.xls` que exporta Biblos,
incluidas las portadas, que van incrustadas dentro del archivo de Excel.

```bash
pip install xlrd olefile Pillow
python tools/import_excel.py "ruta/a/Lista de Libros Nuevos.xls"
```

El script hace tres cosas:

1. Lee la hoja `report com` (clasificación, autor, título, resumen, enlace) y
   valida cada enlace.
2. Extrae las portadas incrustadas, las reduce a 560 px de ancho y las guarda
   como WebP en `public/covers/` (los 19 MB del Excel quedan en ~1.4 MB).
3. Escribe `src/data/books.ts` con todo lo anterior más, por cada portada, su
   **color de acento** (el que tiñe los halos y las etiquetas de esa ficha) y un
   **placeholder** de 14 px que se pinta mientras carga la imagen real.

### Cuando llegue la lista del próximo semestre

1. Abre `tools/copy_editorial.py` y escribe, para cada número de fila:
   - `HOOKS` — el gancho: una línea que diga qué se lleva quien abra ese libro.
   - `AREAS` — el área temática que se muestra en la ficha.
   - `_MOOD_MAP` — a qué «momentos» pertenece (ver abajo).
   - `FEATURED` — los cinco que abren la sección «Destacados».
2. Corre `python tools/import_excel.py <nuevo .xls>`.
3. `npm run build`.

Un título sin gancho no rompe nada: la ficha funciona igual, solo pierde la
frase de venta.

---

## Marca

Los originales viven en `brand/` y **no se publican**: todo lo que está en
`public/` se copia tal cual a `dist/`, y ahí solo deben ir los derivados que la
página usa. Para regenerarlos:

```bash
pip install fonttools brotli Pillow
python tools/build_assets.py
```

**Tipografías.** Las dos son propias, servidas desde el propio servidor: no se
carga nada de Google Fonts, así que la página funciona sin internet y no filtra
la visita a un tercero. Los `.ttf/.otf` se convierten a WOFF2 (271 KB en total).

- **Neulis Cursive** — la letra del logotipo. Se reserva para los titulares
  grandes: el hero, los encabezados de sección, las citas y los ganchos. Tiene
  mucho carácter (la `ll` con lazo, la `r` curva) y por eso no se usa por debajo
  de unos 17 px: a cuerpo pequeño cansa la lectura.
- **Josefin Sans** — toda la interfaz y el texto corrido: menú, botones,
  etiquetas, títulos de tarjeta, autores y sinopsis. Es variable, así que un
  solo archivo cubre de Thin a Bold.

**Logo.** `brand/new_logo_bc.png` es un pliego carta con el logo en blanco.
`build_assets.py` lo recorta y saca `logo-bc.webp` (completo, para el pie),
`logo-mark.webp` (solo el isotipo, para la cabecera) y los favicons.

**Color.** Los dos colores institucionales salen del logo a color:
**#26295c** (índigo) y **#1599d6** (cian). Toda la escala de azul marino se
construyó sobre el tono del índigo, así que el fondo de la página es el mismo
azul de la marca, apagado. El dorado (`#c9a227`) es un acento añadido para los
títulos y las etiquetas: es lo único que no viene de la identidad. Todo está en
el bloque `@theme` de `src/styles.css`.

---

## Estructura

```
brand/                  Originales de marca. NO se publican.
deploy/                 Configuración del servidor (nginx / apache / iis)
tools/
  import_excel.py       Extrae datos y portadas del .xls -> src/data/books.ts
  copy_editorial.py     Ganchos, áreas y momentos por título (lo editable)
  build_assets.py       Fuentes a WOFF2 y recortes del logo
src/
  data/
    books.ts            GENERADO. No editar a mano.
    taxonomy.ts         Definición de los seis «momentos»
  lib/
    url.ts              Lista blanca de enlaces permitidos
  components/
    Nav.tsx             Cabecera con el logo y la barra de progreso
    Hero.tsx            Portada con el muro de cubiertas en deriva
    Stats.tsx           Cifras con conteo al entrar en pantalla
    Manifesto.tsx       Frase que se ilumina palabra por palabra con el scroll
    Moments.tsx         Las seis puertas de entrada emocionales
    MoodModal.tsx       Pop-up con los títulos de un momento
    Spotlight.tsx       Cinco fichas editoriales grandes, con parallax
    Catalog.tsx         Buscador + filtros + retícula de los 43
    BookCard.tsx        Tarjeta; al pasar el cursor revela el gancho
    BookModal.tsx       Ficha completa: sinopsis, signatura y enlace a Biblos
    Footer.tsx          Cómo llegar, contacto y redes
    Cover.tsx           Portadas de proporciones distintas en una retícula pareja
public/                 Lo que se publica: portadas, fuentes web, logos
```

## Los «momentos»

En vez de pedirle al visitante que sepa de antemano qué materia busca, la
página le pregunta qué necesita: *entender el mundo*, *aprobar el semestre*,
*cuidar vidas*, *escapar un rato*, *ejercer justicia*, *mover el cuerpo*.

Al elegir uno se abre un pop-up con esos títulos, igual que la ficha de un
libro: la respuesta llega de inmediato, sin salir de donde estaba. Desde ahí,
«Ver estos N en el catálogo» aplica el filtro abajo y baja hasta él, y el
catálogo recibe con un rótulo que dice qué está mostrando. Antes el clic solo
bajaba en silencio hasta el buscador y parecía que al visitante le tocaba
buscar por su cuenta.

Los momentos se definen en dos lugares que deben coincidir:

- `src/data/taxonomy.ts` — el texto que se ve (etiqueta, promesa, descripción).
- `tools/copy_editorial.py` — qué libro pertenece a cuál (`MOOD_KEYS`, `_MOOD_MAP`).

## Decisiones de diseño

- **Las portadas no se recortan.** Vienen en proporciones muy distintas
  (verticales, cuadradas). Cada una se muestra completa sobre un fondo oscuro
  teñido con su propio color dominante, así la retícula queda pareja sin perder
  ningún título.
- **Rendimiento.** El muro de cubiertas del inicio se detiene solo cuando sale
  de pantalla; las animaciones de fondo usan únicamente traslación y opacidad,
  que la GPU compone sin volver a dibujar el desenfoque.
- **`prefers-reduced-motion`.** Quien tenga desactivadas las animaciones en su
  sistema ve la página completa y quieta.

## Pendiente

- Confirmar el horario y el edificio en `src/components/Footer.tsx`
  (ahora: lunes a viernes, 8:00 a 19:00 h).
- Certificado HTTPS en el servidor y, con él, descomentar
  `Strict-Transport-Security` en el archivo de `deploy/` que corresponda.
