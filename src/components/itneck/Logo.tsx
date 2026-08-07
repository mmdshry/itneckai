import Image from "next/image";

export function ItneckLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/itneck/brand/logo.png"
        alt=""
        width={160}
        height={40}
        className="h-8 w-auto dark:brightness-0 dark:invert sm:h-9"
        priority
      />
      <span className="sr-only">ITneck</span>
    </span>
  );
}
