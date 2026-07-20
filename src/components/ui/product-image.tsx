import { IMAGES } from "@/constants";
import { cn } from "@/utils/cn";
import Image from "next/image";
import type { ComponentProps } from "react";

interface ProductImageProps extends Omit<
  ComponentProps<typeof Image>,
  "src" | "alt"
> {
  src?: string | null;
  alt: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  priority,
  ...props
}: ProductImageProps) {
  if (!src)
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-base-200 rounded-box",
          className,
        )}
        aria-label={alt}
      >
        <span className="text-base-content/30 text-sm">No image</span>
      </div>
    );

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      priority={priority}
      placeholder="blur"
      blurDataURL={IMAGES.blurDataUrl}
      {...props}
    />
  );
}
