# La música de fondo va aquí

Deja el archivo como **`ambiente.mp3`** en esta carpeta y pon
`MUSICA_DISPONIBLE = true` en [`src/lib/sonido.ts`](../../src/lib/sonido.ts).
No hace falta tocar nada más: el interruptor de la cabecera ya existe y la
CSP ya permite `media-src 'self'`.

## Qué buscar

- **Instrumental y sin percusión marcada.** Nada con voz: el visitante está
  leyendo títulos y sinopsis, y una letra compite con el texto.
- **En bucle limpio** (que el final enganche con el principio sin golpe).
- **2 a 4 minutos y menos de 3 MB.** La página pesa hoy ~2.4 MB; una pista de
  8 MB la triplicaría. Exporta en MP3 a 96–128 kbps mono: para música
  ambiental de fondo al 18 % de volumen no se nota la diferencia.

## De dónde sacarla, con licencia en regla

Por orden de menos fricción:

| Sitio | Licencia | Atribución |
|---|---|---|
| [Free Music Archive](https://freemusicarchive.org) (filtro CC0 / CC-BY) | Creative Commons | CC-BY sí, CC0 no |
| [ccMixter](https://ccmixter.org) | Creative Commons | según la pista |
| [Pixabay Music](https://pixabay.com/music/) | Licencia propia de Pixabay, uso libre | no obligatoria |
| [Uppbeat](https://uppbeat.io) | Gratis con crédito (plan gratuito) | sí |
| [YouTube Audio Library](https://www.youtube.com/audiolibrary) | Gratis, algunas con crédito | según la pista |

**Lo que no sirve**: Spotify, Apple Music, YouTube normal ni nada "de
internet". Poner música con derechos en la web de la universidad es un
problema legal real, no una formalidad.

**Si la pista pide atribución (CC-BY)**, el crédito va en el pie, junto a los
demás: nombre de la obra, autor, licencia y enlace. Es la condición de uso, no
un detalle opcional.

## Alternativa sin licencias

Si conseguir la pista se complica, el sitio funciona perfectamente solo con
los microsonidos de interfaz: se generan con la Web Audio API en
`src/lib/sonido.ts`, no son archivos y no dependen de nadie.
