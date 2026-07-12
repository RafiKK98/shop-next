"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/constants";
import type { HomeCategory } from "@/actions/categories-page";
import Image from "next/image";
import Link from "next/link";

export function CategoriesPageContent() {
  const [categories, setCategories] = useState<HomeCategory[] | null>(null);

  useEffect(() => {
    (async () => {
      const { loadCategoriesPage } = await import("@/actions/categories-page");
      const result = await loadCategoriesPage();
      setCategories(result);
    })();
  }, []);

  if (categories === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const image =
          !category.image || category.image.startsWith("/images/")
            ? "https://picsum.photos/seed/" + category.slug + "/640/480"
            : category.image;
        return (
          <Link
            key={category.id}
            href={ROUTES.categoryDetail(category.slug)}
            className="group relative overflow-hidden rounded-xl bg-base-200 transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-video overflow-hidden">
              <Image
                src={image}
                alt={category.name}
                width={640}
                height={360}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-xl font-semibold text-white">
                {category.name}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                {category.productCount} products
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
