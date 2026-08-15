import Image from "next/image";

export function ItneckLogo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/itneck/brand/logo.png"
        alt=""
        width={160}
        height={40}
        className={`h-8 w-auto sm:h-9 ${
          inverted ? "brightness-0 invert" : "dark:brightness-0 dark:invert"
        }`}
        priority
      />
      <span className="sr-only">ITneck</span>
    </span>
  );
}
