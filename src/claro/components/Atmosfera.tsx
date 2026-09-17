/** Veladuras de color que respiran detrás del contenido. Puro CSS. */
export function Atmosfera({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="velo absolute -top-[26%] -left-[12%] size-[58rem] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(53,182,238,0.34), transparent 68%)" }}
      />
      <div
        className="velo absolute -top-[10%] right-[-14%] size-[46rem] rounded-full blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(38,41,92,0.20), transparent 70%)",
          animationDelay: "-9s",
        }}
      />
      <div
        className="velo absolute bottom-[-30%] left-[28%] size-[42rem] rounded-full blur-[160px]"
        style={{
          background: "radial-gradient(circle, rgba(21,153,214,0.18), transparent 70%)",
          animationDelay: "-17s",
        }}
      />
    </div>
  );
}
