"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainImage = images[selectedIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-slate-300">
          image
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Image
          src={mainImage.url}
          alt={mainImage.alt ?? "Product image"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
        />
        <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-primary"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `Product thumbnail ${index + 1}`}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
