"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-square w-full rounded-xl bg-base-200">
        <div className="text-center text-base-content/40">
          <svg
            className="mx-auto size-12"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <p className="mt-2 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {images.length > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 md:size-20",
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
                fill
                className="size-full object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
      <div className="relative shrink-0 aspect-square w-full overflow-hidden rounded-xl bg-base-200 lg:w-0 lg:grow">
        <Image
          src={images[selected]}
          alt={`${title} — image ${selected + 1}`}
          fill
          className="size-full object-fill transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
