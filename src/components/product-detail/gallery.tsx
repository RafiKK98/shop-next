"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 md:size-20",
              i === selected
                ? "border-primary opacity-100"
                : "border-base-200 opacity-60 hover:opacity-80",
            )}
            onClick={() => setSelected(i)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${title} thumbnail ${i + 1}`}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-base-200">
        <Image
          src={images[selected]}
          alt={`${title} — image ${selected + 1}`}
          width={800}
          height={800}
          className="size-full object-cover transition-opacity duration-300"
          priority
        />
      </div>
    </div>
  );
}
