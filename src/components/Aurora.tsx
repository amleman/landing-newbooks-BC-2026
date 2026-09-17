/** Halos azules que respiran detrás del contenido. Puro CSS, sin coste de JS. */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="anim-aurora absolute -left-[10%] top-[-15%] size-[46rem] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(29,78,155,0.55), transparent 68%)" }}
      />
      <div
        className="anim-aurora absolute -right-[12%] top-[20%] size-[38rem] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(76,143,224,0.34), transparent 70%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="anim-aurora absolute bottom-[-20%] left-[30%] size-[34rem] rounded-full blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(201,162,39,0.16), transparent 70%)",
          animationDelay: "-15s",
        }}
      />
    </div>
  );
}
