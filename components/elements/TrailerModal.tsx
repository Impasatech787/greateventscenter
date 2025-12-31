"use client";
import { X } from "lucide-react";

interface Props {
  videoId: string | null;
  onClose: () => void;
}

export default function TrailerModal({ videoId, onClose }: Props) {
  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
