"use client";

import { MOVIES, MovieStatus } from "@/app/data/movies";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "../ui/button";

const StatusBadge = ({ status }: { status: MovieStatus }) => {
  const isNowShowing = status === "NOW SHOWING";
  return (
    <span
      className={`
        px-3 py-1 text-xs font-semibold rounded-full
        ${
          isNowShowing
            ? "bg-green-500 text-white"
            : "bg-purple-500/80 text-white"
        }
      `}
    >
      {status}
    </span>
  );
};

const MovieCard = ({ movie }: { movie: (typeof MOVIES)[number] }) => {
  return (
    <div className="flex-shrink-0 w-[220px] group cursor-pointer">
      {/* Movie Poster */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-200">
        {/*Show blank image if movie.image is missing */}
        {!movie.image && (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        {movie.image && (
          <Image
            src={movie.image}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {/* Hover Overlay with Book Button */}
        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            asChild
            className="bg-red-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-red-700/90 transition-colors transform scale-90 group-hover:scale-100 duration-300"
          >
            <Link href={`/movies/${movie.slug}`} aria-label={`Book tickets for ${movie.title}`}>
              Book Now
            </Link>
          </Button>
        </div>
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={movie.status} />
        </div>
      </div>

      {/* Movie Info */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{movie.duration}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{movie.genre}</span>
        </div>
      </div>
    </div>
  );
};

const MovieLists = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  //One click should move the next movie card width plus gap not just a fixed 240px
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 220; // Width of each movie card
      const gap = 20; // Gap between movie cards
      scrollContainerRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: "smooth",
      });
    }
  };
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 220; // Width of each movie card
      const gap = 20; // Gap between movie cards
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Movies</h2>
            <p className="text-gray-500 text-sm">
              Latest releases and premieres
            </p>
          </div>
          <Link
            href="/movies"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Movie Cards Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {MOVIES.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Scroll Left Button - positioned on the poster area */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors z-10 -translate-x-1/2"
            style={{
              top: "calc((220px * 4 / 3) / 2)",
              transform: "translateX(-50%) translateY(-50%)",
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scroll Right Button - positioned on the poster area */}
          <button
            onClick={scrollRight}
            className="absolute right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors z-10"
            style={{
              top: "calc((220px * 4 / 3) / 2)",
              transform: "translateX(50%) translateY(-50%)",
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieLists;
