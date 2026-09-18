import { useState } from "react";
import { activarSonido, sonar } from "../lib/sonido";

/**
 * El interruptor de sonido de la cabecera.
 *
 * No enciende nada al cargar la página aunque la visita anterior lo dejara
 * encendido: el navegador no permite sonar sin un gesto del visitante, y
 * aunque lo permitiera, empezar a sonar solo sería una emboscada. La
 * preferencia se guarda igualmente (la usa src/lib/sonido.ts), pero aquí el
 * botón siempre nace apagado.
 */
export function BotonSonido() {
  const [encendido, setEncendido] = useState(false);

  const alternar = () => {
    const nuevo = !encendido;
    activarSonido(nuevo);
    setEncendido(nuevo);
    // El sonido de confirmación solo tiene sentido al encender.
    if (nuevo) sonar("toque");
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={encendido}
      aria-label={encendido ? "Silenciar la página" : "Activar el sonido de la página"}
      title={encendido ? "Silenciar" : "Sonido"}
      className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
        encendido
          ? "border-sky/50 bg-usac/20 text-sky-soft"
          : "border-white/12 bg-navy-900/60 text-mist-dim hover:border-white/30 hover:text-mist"
      }`}
    >
      {/* Un altavoz dibujado a mano: son 3 trazos, no vale la pena una
          dependencia de iconos para esto. */}
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
        <path
          d="M4 9.5h3.2L11.5 6v12L7.2 14.5H4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {encendido ? (
          <>
            <path
              d="M15 9.3a3.8 3.8 0 0 1 0 5.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M17.6 6.8a7.4 7.4 0 0 1 0 10.4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M15.4 9.6l4.4 4.8m0-4.8l-4.4 4.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
