import Image from "next/image";

export function Mascot({
  alt = "",
  tileClassName = "h-9 w-9",
  imageClassName = "h-7 w-7",
}: {
  alt?: string;
  tileClassName?: string;
  imageClassName?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#02376b] ${tileClassName}`}
    >
      <Image
        src="/brand/mascot.png"
        alt={alt}
        width={128}
        height={84}
        className={`object-contain ${imageClassName}`}
        priority
      />
    </span>
  );
}
