import Image from "next/image";

interface ProductCardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ProductCardImage({ src, alt, priority }: ProductCardImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-t-box bg-base-200">
      <Image
        src={src}
        alt={alt}
        width={640}
        height={480}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
      />
      {/* gradient overlay at bottom for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
