"use client";
import { Button } from "../ui/button";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Info, Play, Star } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const heroMovies = [
  {
    id: 101,
    title: "The Grand Cinema Experience",
    genre: "Experience",
    description:
      "Immerse yourself in the ultimate movie-going experience with our state-of-the-art screens and sound systems.",
    image:
      "https://images.unsplash.com/photo-1751823886813-0cfc86cb9478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjB3aWRlJTIwY2luZW1hJTIwc2NyZWVufGVufDF8fHx8MTc2NDgyMjQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: "G",
    year: "2024",
    duration: "Unlimited",
  },
  {
    id: 102,
    title: "Holiday Magic Returns",
    genre: "Holiday",
    description:
      "Celebrate the season with our special screening of timeless holiday classics for the whole family.",
    image:
      "https://images.unsplash.com/photo-1638114103345-c088dab77d09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBob2xpZGF5JTIwbW92aWUlMjBzY2VuZXxlbnwxfHx8fDE3NjQ4MjI0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: "PG",
    year: "2024",
    duration: "Various",
  },
  {
    id: 103,
    title: "Action Packed Summer",
    genre: "Action",
    description:
      "Get ready for the most adrenaline-pumping blockbusters arriving this summer at Great Events Center.",
    image:
      "https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlciUyMHdpZGV8ZW58MXx8fHwxNzY0ODIyNDkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: "PG-13",
    year: "2024",
    duration: "Coming Soon",
  },
];

const MoviePageBanner = () => {
  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    centerMode: true,
    centerPadding: "10%",
    focusOnSelect: true,
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: "20px" }}>
        <ul
          style={{ margin: "0px" }}
          className="[&_li_button:before]:!text-white"
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          fade: true,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-12">
      {/* Hero Carousel */}
      <section className="relative mb-16 group overflow-hidden pt-8 bg-[rgba(255,255,255,0)]">
        <Slider {...heroSettings}>
          {heroMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-full h-[60vh] md:h-[70vh] lg:h-[90vh] outline-none px-2 md:px-4"
            >
              {/* Card Wrapper */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden transform transition-all duration-500 ring-1 ring-white/10">
                {/* Background Image */}
                <div className="absolute inset-0 bg-zinc-900">
                  <ImageWithFallback
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Cinematic Gradients - Left Heavy for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* Content Container - Aligned Left */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-8 md:px-16">
                    <div className="max-w-2xl">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        {/* Logo/Title Area */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center bg-[#BB2327] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
                              {movie.genre === "Experience"
                                ? "Experience"
                                : "New"}
                            </span>
                            {movie.genre && (
                              <span className="text-zinc-300 text-sm font-medium uppercase tracking-widest border-l border-zinc-500 pl-3">
                                {movie.genre}
                              </span>
                            )}
                          </div>

                          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                            {movie.title}
                          </h1>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-4 text-zinc-300 text-sm md:text-base font-medium">
                          <div className="flex items-center gap-1 text-[#BB2327]">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-white font-bold">4.9</span>
                          </div>
                          <span>•</span>
                          <span>{movie.year || "2024"}</span>
                          <span>•</span>
                          <span>{movie.duration || "2h 15m"}</span>
                          <span>•</span>
                          <span className="border border-zinc-600 px-2 py-0.5 rounded text-xs bg-zinc-900/50">
                            {movie.rating || "PG-13"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-zinc-300 line-clamp-3 leading-relaxed max-w-lg drop-shadow-md">
                          {movie.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                          <Button className="bg-white text-black hover:bg-zinc-200 font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                            <Play className="w-5 h-5 fill-current" />
                            Play Now
                          </Button>
                          <Button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold rounded-lg px-8 h-14 text-lg shadow-lg transition-all hover:scale-105">
                            <Info className="w-5 h-5 mr-2" />
                            Details
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
};

export default MoviePageBanner;
