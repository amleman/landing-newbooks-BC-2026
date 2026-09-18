/**
 * El sonido de la página: música ambiental opcional y microsonidos de interfaz.
 *
 * Tres decisiones que conviene no revertir sin pensarlo:
 *
 * 1. **Arranca siempre apagado.** Los navegadores bloquean el audio automático
 *    (Chrome y Safari lo exigen desde hace años), pero además esto es la web
 *    de una biblioteca: mucha gente la va a abrir desde una sala de lectura o
 *    con la oficina en silencio. El sonido suena solo si alguien lo pide.
 * 2. **Un único interruptor** para todo. Nada de un control para la música y
 *    otro para los clics: quien quiere silencio lo quiere completo.
 * 3. **Los microsonidos se sintetizan aquí**, con la Web Audio API, en vez de
 *    descargar archivos. Son dos tonos cortísimos; generarlos no pesa nada,
 *    no añade peticiones de red y evita el lío de licencias de los bancos de
 *    efectos. La música sí es un archivo, porque una melodía no se sintetiza
 *    de forma decente en cuatro líneas.
 */

import { rutaPublica } from "./rutas";

/** Dónde se recuerda la preferencia entre visitas. */
const CLAVE = "bc-sonido";

/**
 * La pista de fondo.
 *
 * Mientras no haya archivo, esto se queda en `false` y el interruptor enciende
 * solo los microsonidos. No se intenta cargar «por si acaso» a propósito: la
 * CSP prohíbe peticiones de red (`connect-src 'none'`), así que no hay forma
 * limpia de preguntar si el archivo existe, y un intento fallido dejaría un
 * 404 rojo en la consola de todos los visitantes.
 *
 * Para activarla: deja el archivo en `public/audio/ambiente.mp3` y pon
 * MUSICA_DISPONIBLE en true. Nada más.
 */
const MUSICA_DISPONIBLE = false;
const MUSICA = "/audio/ambiente.mp3";

/** Volumen de la música: fondo real, no primer plano. */
const VOLUMEN_MUSICA = 0.18;

type Tipo = "abrir" | "cerrar" | "toque";

/** Frecuencia y duración de cada microsonido, en Hz y segundos. */
const TONOS: Record<Tipo, { hz: number; hasta: number; dur: number; vol: number }> = {
  abrir: { hz: 392, hasta: 587, dur: 0.16, vol: 0.05 },
  cerrar: { hz: 494, hasta: 330, dur: 0.14, vol: 0.04 },
  toque: { hz: 660, hasta: 660, dur: 0.06, vol: 0.025 },
};

let ctx: AudioContext | null = null;
let musica: HTMLAudioElement | null = null;
let activo = false;

/** Qué dejó elegido el visitante la última vez. */
export function preferenciaGuardada(): boolean {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    // Ventana privada o almacenamiento bloqueado: se asume silencio.
    return false;
  }
}

export function sonidoActivo(): boolean {
  return activo;
}

/**
 * Enciende o apaga todo el sonido.
 *
 * Debe llamarse desde un gesto del visitante (un clic): el navegador solo
 * permite crear y reanudar el AudioContext dentro de uno.
 */
export function activarSonido(encender: boolean): void {
  activo = encender;

  try {
    localStorage.setItem(CLAVE, encender ? "1" : "0");
  } catch {
    // Que no se pueda recordar la preferencia no impide usarla ahora.
  }

  if (!encender) {
    musica?.pause();
    return;
  }

  if (!MUSICA_DISPONIBLE) return;

  if (!musica) {
    musica = new Audio(rutaPublica(MUSICA));
    musica.loop = true;
    musica.volume = VOLUMEN_MUSICA;
    // Sin archivo de música la página se queda solo con los microsonidos.
    musica.addEventListener("error", () => {
      musica = null;
    });
  }
  // Puede rechazarse si el navegador no considera esto un gesto válido.
  void musica?.play().catch(() => {});
}

/**
 * Un microsonido de interfaz. No hace nada si el sonido está apagado, así que
 * quien lo llama no tiene que preguntar antes.
 */
export function sonar(tipo: Tipo): void {
  if (!activo) return;

  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();

    const { hz, hasta, dur, vol } = TONOS[tipo];
    const ahora = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(hz, ahora);
    if (hasta !== hz) osc.frequency.exponentialRampToValueAtTime(hasta, ahora + dur);

    // Envolvente suave: un tono que arranca o corta en seco suena a "clic" de
    // error. Sube en 12 ms y se apaga exponencialmente.
    const gan = ctx.createGain();
    gan.gain.setValueAtTime(0.0001, ahora);
    gan.gain.exponentialRampToValueAtTime(vol, ahora + 0.012);
    gan.gain.exponentialRampToValueAtTime(0.0001, ahora + dur);

    osc.connect(gan).connect(ctx.destination);
    osc.start(ahora);
    osc.stop(ahora + dur + 0.02);
  } catch {
    // Web Audio no disponible: la página sigue funcionando sin sonido.
  }
}
