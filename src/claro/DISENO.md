# Versión clara — notas de diseño

Segunda propuesta para la misma landing. Convive con la oscura sin tocarla:
`index.html` es la oscura, `claro.html` es esta. No comparten componentes ni
hoja de estilos; sí comparten los datos (`src/data/`), la validación de enlaces
(`src/lib/url.ts`) y los assets de `public/`.

## De dónde sale

Un boletín de novedades de una biblioteca universitaria pública. El lector es
un estudiante que pasa entre clases. El trabajo de la página es que descubra un
libro que no sabía que existía y suba a buscarlo.

El vernáculo de ese mundo es **el estante ordenado por signatura**: un libro
nuevo no llega a una vitrina, llega a una posición exacta entre 002.09 y
S.G. 378.166. De ahí sale la pieza central.

## La pieza: el estante

Los 43 lomos, en orden real de signatura, cada uno con el color dominante de su
propia portada (el que ya extrae `tools/import_excel.py` del Excel). El
degradado que llevan encima —luz en el canto izquierdo, sombra en el derecho—
es lo que les da volumen; sin él serían rectángulos planos.

- Se monta solo al cargar, lomo a lomo.
- Al posarse en uno, se levanta y el libro aparece en la vitrina de la derecha,
  con muelle y con un halo de su propio color.
- La fila se arrastra con el ratón y se desliza en táctil.
- Al hacer clic se abre la ficha.

Los anchos y las alturas salen del título de cada libro, así que el ritmo es
irregular pero siempre el mismo.

## Color

Nada de crema: el papel es **frío**, derivado del cian de la marca, y lleva
veladuras de color que se mueven despacio detrás del contenido.

| Nombre | Hex | Papel |
|---|---|---|
| `hoja` | `#F4F7FB` | fondo |
| `blanco` | `#FFFFFF` | paneles flotantes |
| `tinta` | `#101733` | texto |
| `indigo` | `#26295C` | institucional (del logo) |
| `cian` | `#1599D6` | lo interactivo; en texto baja a `#0C6E9E` |

El resto de la cromía sale de las propias portadas, así que es información y no
decoración. El pie es el único bloque oscuro: cierra la página y le da suelo.

### Contraste

Los acentos del Excel se calcularon para brillar sobre azul marino; sobre papel
varios eran ilegibles. Hay tres derivados en `src/claro/lib/lomo.ts`:

- `tonoLomo` — la tela del lomo. El techo de luminosidad (0.30) no es estético:
  es lo que hace que el título en blanco supere 4.5:1 en los 43 lomos.
- `tintaLibro` — el mismo tono como texto sobre blanco. Mínimo medido: 5.9:1.
- `papelLibro` — el fondo clarísimo de las etiquetas de área.

## Tipografía

Las mismas dos familias de la marca, con los papeles cambiados respecto a la
oscura, para que las dos propuestas no se confundan:

- **Josefin Sans Light** a cuerpos grandes hace los titulares.
- **Neulis Cursive** queda para lo que es *libro*: títulos de obra, lomos y
  citas. Es la voz bibliográfica.

En la versión oscura es al revés. Misma marca, dos temperamentos.

## Movimiento

Es lo que separa esta versión del primer borrador, que salió plano y quieto:

- Entrada escalonada del hero (chip, titular, texto, botones, cifras).
- Parallax del texto del hero al hacer scroll.
- Cada sección aparece al entrar en pantalla (`Reveal`).
- Paneles y fichas que se levantan con sombra al pasar el cursor.
- Cambio de libro en la vitrina con muelle y cruce de opacidad.
- Veladuras de fondo que respiran; solo traslación y opacidad, que la GPU
  compone sin volver a dibujar el desenfoque.

Todo se apaga con `prefers-reduced-motion`.

## Estructura

1. **Hero** — titular, cifras, vitrina y el estante a sangre.
2. **¿Qué necesitas resolver?** — los seis momentos como lista de filas, no como
   rejilla de tarjetas: se lee de corrido, que es como se escoge entre seis.
   Cada fila abre un pop-up con sus títulos.
3. **La signatura** — enseña a leer un número de estante, con el libro del
   ejemplo (612 H174:14) al lado.
4. **Si solo te llevas uno** — uno grande y cuatro menores. La asimetría es el
   juicio editorial hecho estructura; por eso no van numerados.
5. **Los 43, uno por uno** — buscador pegajoso, filtros y rejilla.
6. **Pie** — en índigo, con el logo blanco, contacto y redes.
