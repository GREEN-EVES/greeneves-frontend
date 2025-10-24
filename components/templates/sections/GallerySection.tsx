"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface GallerySectionProps {
  config: {
    columns?: 2 | 3 | 4;
    showLightbox?: boolean;
  };
  photos: { id: string; url: string; title?: string; description?: string }[];
}

export default function GallerySection({ config, photos }: GallerySectionProps) {
  const { columns = 3, showLightbox = true } = config;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  if (!photos || photos.length === 0) {
    return null; // Don't render if no photos
  }

  const openLightbox = (index: number) => {
    if (showLightbox) {
      setCurrentImage(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const gridColsClass = {
    2: "grid-cols-2 md:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">
            Gallery
          </h2>
          <div className={`grid ${gridColsClass} gap-4`}>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.url}
                  alt={photo.title || `Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl hover:opacity-70 transition-opacity"
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={photos[currentImage].url}
              alt={photos[currentImage].title || `Photo ${currentImage + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {photos[currentImage].title && (
              <p className="text-white mt-4 text-lg">{photos[currentImage].title}</p>
            )}
            {photos[currentImage].description && (
              <p className="text-white/70 mt-2">{photos[currentImage].description}</p>
            )}
            <p className="text-white/50 mt-4 text-sm">
              {currentImage + 1} / {photos.length}
            </p>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl hover:opacity-70 transition-opacity"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
