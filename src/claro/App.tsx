import { useCallback, useEffect, useState } from "react";
import type { Book, Mood } from "../data/books";
import { moodByKey } from "../data/taxonomy";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Necesitas } from "./components/Necesitas";
import { Cita } from "./components/Cita";
import { Recomendamos } from "./components/Recomendamos";
import { Catalogo } from "./components/Catalogo";
import { MoodModal } from "./components/MoodModal";
import { BookModal } from "./components/BookModal";
import { Footer } from "./components/Footer";

export default function App() {
  /** Filtro aplicado en el catálogo. */
  const [mood, setMood] = useState<Mood | null>(null);
  /** Fila de «qué necesitas» cuyo pop-up está abierto. */
  const [momento, setMomento] = useState<Mood | null>(null);
  /** Ficha de libro; puede quedar encima del pop-up anterior. */
  const [libro, setLibro] = useState<Book | null>(null);

  // Contador, no booleano: así volver a pulsar el mismo momento también baja.
  const [bajarAlCatalogo, setBajarAlCatalogo] = useState(0);

  const verEnCatalogo = useCallback((m: Mood) => {
    setMomento(null);
    setMood(m);
    setBajarAlCatalogo((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!bajarAlCatalogo) return;
    // Al aplicar el filtro, la retícula quita fichas y la página cambia de
    // alto. Si el scroll sale antes de que eso termine, el navegador lo
    // descarta y el visitante se queda donde estaba.
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
  const hayPopup = Boolean(momento || libro);
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

  return (
    <>
      <Nav />
      <main>
        <Hero onAbrir={setLibro} />
        <Necesitas onAbrir={setMomento} abierto={momento} />
        <Cita onAbrir={setLibro} />
        <Recomendamos onAbrir={setLibro} />
        <Catalogo mood={mood} setMood={setMood} onOpen={setLibro} />
      </main>
      <Footer />

      <MoodModal
        momento={momento ? moodByKey[momento] : null}
        onCerrar={cerrarMomento}
        onOpenBook={setLibro}
        onVerCatalogo={() => momento && verEnCatalogo(momento)}
        tapado={Boolean(libro)}
      />
      <BookModal book={libro} onClose={cerrarLibro} />
    </>
  );
}
