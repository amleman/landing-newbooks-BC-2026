import type { Mood } from "./books";

export type MoodDef = {
  key: Mood;
  label: string;
  chip: string;
  claim: string;
  detalle: string;
  glyph: string;
};

/**
 * Los "momentos" son la puerta de entrada emocional: el visitante no busca
 * una materia, busca resolver algo. Cada momento agrupa los títulos que
 * responden a esa intención.
 */
export const moods: MoodDef[] = [
  {
    key: "entender",
    label: "Quiero entender el mundo",
    chip: "Entender el mundo",
    claim: "Las ideas que explican por qué el presente se siente así.",
    detalle:
      "Ensayo contemporáneo, historia del libro y análisis político. Para las preguntas que no aparecen en el pensum.",
    glyph: "◐",
  },
  {
    key: "aprobar",
    label: "Necesito aprobar el semestre",
    chip: "Aprobar el semestre",
    claim: "Los textos que tus catedráticos citan de memoria.",
    detalle:
      "Ediciones vigentes de los tratados base de ciencias, ingeniería y derecho. Los mismos que aparecen en la bibliografía obligatoria.",
    glyph: "◑",
  },
  {
    key: "cuidar",
    label: "Voy a cuidar vidas",
    chip: "Cuidar vidas",
    claim: "De la molécula al paciente que verás mañana.",
    detalle:
      "Fisiología, bioquímica, farmacología, inmunología y parasitología en sus ediciones de referencia.",
    glyph: "◒",
  },
  {
    key: "escapar",
    label: "Quiero escapar un rato",
    chip: "Escapar un rato",
    claim: "Historias para leer sin ver el reloj.",
    detalle:
      "Fantasía, romance histórico, distopía y los últimos títulos de Allende, García Márquez y Pérez-Reverte.",
    glyph: "◓",
  },
  {
    key: "justicia",
    label: "Voy a ejercer justicia",
    chip: "Ejercer justicia",
    claim: "Del primer curso al examen técnico profesional.",
    detalle:
      "Derecho guatemalteco: nociones generales, introducción al estudio del derecho y análisis constitucional.",
    glyph: "◔",
  },
  {
    key: "cuerpo",
    label: "Quiero mover el cuerpo",
    chip: "Mover el cuerpo",
    claim: "Tu postura y tu entrenamiento, con evidencia detrás.",
    detalle:
      "Movilidad, dolor de espalda y técnica de natación explicados sin promesas mágicas.",
    glyph: "◕",
  },
];

export const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m])) as Record<Mood, MoodDef>;
