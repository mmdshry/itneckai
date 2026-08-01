import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/brand/ai-neck-logo.png"
        alt=""
        width={196}
        height={44}
        className="h-8 w-auto dark:brightness-0 dark:invert sm:h-9"
        priority
      />
      <span className="sr-only">ai.neck</span>
    </span>
  );
}
