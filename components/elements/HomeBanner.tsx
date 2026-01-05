"use client";

import { useEffect, useState } from "react";
import { RotatingText } from "./RotatingText";
import { CardStack } from "./CardStack";
import { Button } from "../ui/button";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";

type HomeBanner = {
  title: string;
  bannerHero: string;
  bannerUrl: string;
};

const HomeBanner = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [heroTexts, setHeroTexts] = useState<string[]>([]);
  const [imageSets, setImageSets] = useState<string[][]>([]);

  const fetchHomeBanner = async () => {
    try {
      const res =
        await apiClient.get<ApiResponse<HomeBanner[]>>("/home-banner");
      const heroTexts: string[] = [];
      const heroImages: string[][] = [];

      const heroIndexMap = new Map<string, number>();
      if (res) {
        res.data.data.forEach(({ bannerHero, bannerUrl }) => {
          if (!heroIndexMap.has(bannerHero)) {
            heroIndexMap.set(bannerHero, heroTexts.length);
            heroTexts.push(bannerHero);
            heroImages.push([]);
          }

          const index = heroIndexMap.get(bannerHero)!;
          heroImages[index].push(bannerUrl);
        });
        setHeroTexts(heroTexts);
        setImageSets(heroImages);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchHomeBanner();
  }, []);

  const heroImages = imageSets[currentTextIndex];

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
                texts={heroTexts}
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
              {heroImages && (
                <CardStack
                  images={heroImages}
                  interval={3000}
                  width="100%"
                  height="100%"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
