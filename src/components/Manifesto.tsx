import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Un libro nuevo no es un objeto en un estante. Es una pregunta que alguien más ya se hizo, peleó durante años y dejó respondida para ti. Está a cinco minutos de camino.";

function Word({
  word,
  start,
  end,
  progress,
}: {
  word: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const color = useTransform(progress, [start, end], ["#6f86a8", "#f3f0e7"]);
  return (
    <motion.span style={{ opacity, color }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.55"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div
          ref={ref}
          className="mx-auto max-w-[24ch] font-display text-[clamp(1.7rem,4.6vw,3.4rem)] leading-[1.26] font-light tracking-[-0.005em] sm:max-w-[26ch]"
        >
          {words.map((w, i) => (
            <Word
              key={`${w}-${i}`}
              word={w}
              start={i / words.length}
              end={(i + 2.5) / words.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(29,78,155,0.28), transparent 70%)" }}
      />
    </section>
  );
}
