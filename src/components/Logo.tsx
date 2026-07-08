export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="14" cy="14" r="4" fill="var(--signal-cyan)" />
        <circle
          cx="14"
          cy="14"
          r="10.5"
          stroke="var(--signal-cyan)"
          strokeWidth="1.5"
          strokeDasharray="4 3.5"
        />
        <circle cx="14" cy="3.5" r="2" fill="var(--ember-amber)" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-cloud">
        ITneck <span className="text-cyan">AI</span>
      </span>
    </span>
  );
}
