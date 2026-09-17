import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { books, areas } from "../data/books";
import { Reveal } from "./Reveal";

const ficcion = books.filter((b) => b.moods.includes("escapar")).length;

const items = [
  { value: books.length, suffix: "", label: "títulos ingresados", sub: "todos de 2024 en adelante" },
  { value: areas.length, suffix: "", label: "áreas del conocimiento", sub: "de medicina a literatura" },
  { value: ficcion, suffix: "", label: "novelas y ficción", sub: "para leer fuera del pensum" },
  { value: 100, suffix: "%", label: "disponibles en préstamo", sub: "con tu carné vigente" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative border-y border-white/7 bg-navy-950/60">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-2 divide-white/7 lg:grid-cols-4 lg:divide-x">
          {items.map((it, i) => (
            <Reveal
              key={it.label}
              delay={i * 0.08}
              className={`px-1 py-9 sm:py-12 lg:px-8 ${i % 2 === 0 ? "lg:pl-0" : ""} ${
                i < 2 ? "border-b border-white/7 lg:border-b-0" : ""
              } ${i % 2 === 1 ? "border-l border-white/7 pl-5 lg:pl-8" : ""}`}
            >
              <div className="font-display text-[clamp(2.4rem,6vw,4.1rem)] leading-none font-light text-parchment">
                <Counter to={it.value} suffix={it.suffix} />
              </div>
              <div className="mt-3 text-[14px] font-semibold tracking-tight text-sky-soft">
                {it.label}
              </div>
              <div className="mt-1 text-[13px] text-mist-dim">{it.sub}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
