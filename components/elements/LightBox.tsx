"use client";
import React, { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface LightBoxImage {
  imageSrc: string;
  caption?: string;
}

interface LightBoxProps {
  images: (string | LightBoxImage)[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const normalizeImages = (
  images: (string | LightBoxImage)[],
): LightBoxImage[] => {
  return images.map((img, index) => {
    if (typeof img === "string") {
      return { imageSrc: img, caption: `Image ${index + 1}` };
    }
    return img;
  });
};

const LightBox: React.FC<LightBoxProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [wasOpen, setWasOpen] = useState(isOpen);
  const normalizedImages = normalizeImages(images);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1,
    );
  }, [normalizedImages.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1,
    );
  }, [normalizedImages.length]);

  // Reset to initial index when opening (using derived state pattern)
  if (isOpen && !wasOpen) {
    setCurrentIndex(initialIndex);
    setWasOpen(true);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  // Keyboard navigation: Esc to close, arrows to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, showNext, showPrev]);

  if (!images || images.length === 0 || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Close click on backdrop */}
      <button
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close lightbox"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Modal content */}
      <div className="relative z-10 max-w-6xl w-full px-4">
        <div className="flex items-center justify-center gap-4">
          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Main image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative max-h-[70vh] w-auto max-w-full">
              <Image
                src={normalizedImages[currentIndex]?.imageSrc}
                alt={
                  normalizedImages[currentIndex]?.caption ||
                  `Image ${currentIndex + 1}`
                }
                width={1200}
                height={800}
                className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
                priority
              />
            </div>
            <div className="text-center text-sm text-gray-100">
              {normalizedImages[currentIndex]?.caption && (
                <p className="font-medium">
                  {normalizedImages[currentIndex].caption}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {currentIndex + 1} / {normalizedImages.length}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        {/* Thumbnails inside modal */}
        <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-4 max-w-full py-2">
          {normalizedImages.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 rounded-md overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-105"
                  : "opacity-50 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={img.imageSrc}
                alt={img.caption || `Thumbnail ${index + 1}`}
                width={96}
                height={64}
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LightBox;
