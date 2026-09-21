import { useCallback, useEffect, useState } from "react";
import type { Book, Mood } from "./data/books";
import { moodByKey } from "./data/taxonomy";
import { sonar } from "./lib/sonido";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Manifesto } from "./components/Manifesto";
import { Moments } from "./components/Moments";
import { Spotlight } from "./components/Spotlight";
import { Catalog } from "./components/Catalog";
import { BookModal } from "./components/BookModal";
import { MoodModal } from "./components/MoodModal";
import { Footer } from "./components/Footer";
import { AcercaDe } from "./components/AcercaDe";

export default function App() {
  /** Filtro aplicado en el catálogo de abajo. */
  const [mood, setMood] = useState<Mood | null>(null);
  /** Momento cuyo pop-up está abierto. */
  const [momento, setMomento] = useState<Mood | null>(null);
  /** Ficha de libro abierta; puede quedar encima del pop-up de momento. */
  const [libro, setLibro] = useState<Book | null>(null);
  /** El «acerca de»: qué es este sitio, por qué existe y quién lo hizo. */
  const [acercaDe, setAcercaDe] = useState(false);

  // Contador, no booleano: así volver a pulsar el mismo momento también baja.
  const [bajarAlCatalogo, setBajarAlCatalogo] = useState(0);

  /** Desde un «momento»: cierra el pop-up, filtra el catálogo y baja hasta él. */
  const verEnCatalogo = useCallback((m: Mood) => {
    setMomento(null);
    setMood(m);
    setBajarAlCatalogo((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!bajarAlCatalogo) return;
    // Al aplicar el filtro, la retícula quita tarjetas y toda la página cambia
    // de alto. Si el scroll sale antes de que eso termine, el navegador lo
    // descarta y el visitante se queda donde estaba. Se espera a que asiente.
    const t = setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(t);
  }, [bajarAlCatalogo]);

  /**
   * Un único candado para el scroll de la página.
   *
   * Antes lo hacía cada pop-up por su cuenta (`MoodModal` y `BookModal`, cada
   * uno guardando y restaurando `document.body.style.overflow`). Con los dos
   * abiertos a la vez, el segundo guardaba como valor «anterior» el `hidden`
   * que había puesto el primero, y al cerrarlos la página se quedaba sin
   * scroll. Aquí hay un solo dueño de esa propiedad y da igual cuántos
   * pop-ups haya encima: se bloquea si hay alguno y se suelta cuando no queda
   * ninguno.
   */
  const hayPopup = Boolean(momento || libro || acercaDe);
  useEffect(() => {
    if (!hayPopup) return;
    // Los microsonidos salen de aquí, no de cada pop-up: un solo sitio que
    // sabe cuándo se abre y cuándo se cierra algo. `sonar` no hace nada si el
    // visitante no ha encendido el sonido.
    sonar("abrir");
    return () => sonar("cerrar");
  }, [hayPopup]);

  useEffect(() => {
    if (!hayPopup) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [hayPopup]);

  // Referencias estables: si se recrearan en cada render, los efectos de los
  // pop-ups (teclado y foco) se desmontarían y remontarían sin motivo.
  const cerrarMomento = useCallback(() => setMomento(null), []);
  const cerrarLibro = useCallback(() => setLibro(null), []);
  const abrirAcercaDe = useCallback(() => setAcercaDe(true), []);
  const cerrarAcercaDe = useCallback(() => setAcercaDe(false), []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Manifesto />
        <Moments onAbrir={setMomento} abierto={momento} />
        <Spotlight onOpen={setLibro} />
        <Catalog mood={mood} setMood={setMood} onOpen={setLibro} />
      </main>
      <Footer onAcercaDe={abrirAcercaDe} />

      <MoodModal
        momento={momento ? moodByKey[momento] : null}
        onCerrar={cerrarMomento}
        onOpenBook={setLibro}
        onVerCatalogo={() => momento && verEnCatalogo(momento)}
        tapado={Boolean(libro)}
      />
      <BookModal book={libro} onClose={cerrarLibro} />
      <AcercaDe abierto={acercaDe} onCerrar={cerrarAcercaDe} />
    </>
  );
}
