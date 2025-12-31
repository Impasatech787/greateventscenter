"use client";
import { useState } from "react";
import { Film } from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";
import TrailerModal from "@/components/elements/TrailerModal";
import { Button } from "../ui/button";
import { movie as Movie } from "@/app/generated/prisma";

export default function WatchTrailerButton({ movie }: { movie: Movie }) {
  const [open, setOpen] = useState(false);

  const videoId = extractYouTubeId(movie.trailerUrl);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={!videoId}
        className="flex-1 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md 
        border border-white/20 font-semibold rounded-xl px-6 sm:px-8 min-h-14 sm:min-h-16
        text-base sm:text-lg shadow-lg transition-all duration-300 hover:scale-[1.02]
        flex items-center justify-center"
      >
        <Film className="w-5 h-5 mr-2.5" />
        Watch Trailer
      </Button>

      {open && (
        <TrailerModal videoId={videoId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
