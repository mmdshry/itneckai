const pillars = [
  {
    label: "Problem",
    text: "Busy work quietly consumes time, attention, and expensive human capacity.",
  },
  {
    label: "Solution",
    text: "Ai.neck finds the friction, redesigns the workflow, and applies the right automation or AI.",
  },
  {
    label: "Result",
    text: "Your people get time back for customers, decisions, creativity, and growth.",
  },
] as const;

export function BrandSummary() {
  return (
    <section className="border-y border-line bg-surface" aria-label="What Ai.neck is for">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.label}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
                {pillar.label}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-navy">{pillar.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl font-display text-xl font-semibold tracking-tight text-navy md:text-2xl">
          Do not ask, “Where can we use AI?” Ask, “Where are your people losing time?”
        </p>
      </div>
    </section>
  );
}
