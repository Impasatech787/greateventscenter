"use client";

import { useState } from "react";
import { RotatingText } from "./RotatingText";
import { CardStack } from "./CardStack";
import { Button } from "../ui/button";

const HomeBanner = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const heroImageSets = [
    // Events
    [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464047736614-af63643285bf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=800&q=80",
    ],
    // Movies
    [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594908900066-3f47337549d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574267432644-f610a4b3a929?auto=format&fit=crop&w=800&q=80",
    ],
    // Weddings
    [
      "https://images.unsplash.com/photo-1763553113332-800519753e40?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519657502999-ab785d28a1f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    ],
  ];

  const heroImages = heroImageSets[currentTextIndex];

  return (
    <div className="min-h-screen lg:min-h-[90vh] bg-[#FDFBF9] overflow-hidden flex items-center pt-24 pb-12 lg:py-0">
      <div className="max-w-[1260px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 text-left lg:pt-0 z-10 relative pt-[10px] pr-[0px] pb-[0px] pl-[0px]">
            <h1 className="md:text-6xl lg:text-[84px] font-bold tracking-tight mb-6 not-italic leading-[1.1] lg:leading-[1.1] text-[48px]">
              <span className="text-[rgb(29,29,29)]">
                Your one-stop venue for{" "}
              </span>
              <br className="hidden lg:block" />
              <RotatingText
                texts={["events", "movies", "weddings"]}
                className="text-[#BB2327]"
                interval={3000}
                onIndexChange={setCurrentTextIndex}
              />
              <span className="text-[rgb(29,29,29)]">.</span>
            </h1>
            <p className="text-lg text-zinc-500 mb-8 leading-relaxed max-w-lg">
              Explore our premium halls and venues designed for events of all
              sizes. Check real-time availability and book instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button className="bg-[#BB2327] text-white hover:bg-[#a01d21] border border-secondary rounded-full text-base py-6 px-8 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-center box-border">
                Book Now
              </Button>
              <Button className="bg-white text-[#BB2327] hover:bg-zinc-50 border border-[#BB2327] rounded-full text-base py-6 px-8 font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 text-center box-border">
                Inquiry Now
              </Button>
            </div>


          </div>

          {/* Right: Polaroid Stack */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-[400px] md:h-[500px] lg:h-[550px] z-0 mt-8 lg:mt-0">
            <div className="relative w-full max-w-[320px] md:max-w-[400px] lg:max-w-[500px] h-full">
              <CardStack
                images={heroImages}
                interval={3000}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
