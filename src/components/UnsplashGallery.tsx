"use client";

import { useEffect, useState } from "react";

type Photo = {
  id: string;
  alt: string;
  thumb: string;
  url: string;
  author?: string;
  link?: string;
};

export default function UnsplashGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/unsplash?q=hair%20salon&perPage=6")
      .then((r) => r.json())
      .then((data) => setPhotos(data?.photos ?? []))
      .catch(() => setPhotos([]));
  }, []);

  if (!photos.length) return null;

  return (
    <div className="mt-4 mb-6">
      <div className="text-sm text-white/80 mb-3">Inspiracija (Unsplash)</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((p) => (
          <a
            key={p.id}
            href={p.link || "#"}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded border border-white/10"
            title={p.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.thumb || p.url}
              alt={p.alt}
              className="w-full h-28 object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}