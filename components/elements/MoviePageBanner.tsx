"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Images {
  bannerTitle: string;
  imageSrc: string;
}

const imageSrc: Images[] = [
  { bannerTitle: "Festival", imageSrc: "/MovieImage.png" },
  { bannerTitle: "Movies", imageSrc: "/MovieImage2.png" },
];

const CardStack = ({
  topIndex,
  isAnimating,
  returningIndex,
}: {
  topIndex: number;
  isAnimating: boolean;
  returningIndex: number | null;
}) => {
  const images = [...imageSrc, ...imageSrc, ...imageSrc];

  const getCardStyle = (index: number) => {
    const position = (index - topIndex + images.length) % images.length;
    const isTop = position === 0;
    const isReturning = index === returningIndex;

    const shouldHide = (isTop && isAnimating) || isReturning;

    return {
      zIndex: images.length - position,
      transform:
        isTop && isAnimating
          ? "translateX(300px) rotate(15deg)"
          : `translateX(0) rotate(0deg)`,
      opacity: shouldHide ? 0 : 1,
      top: `${position * 4}px`,
      transition: isReturning
        ? "none"
        : "transform 0.6s ease-in-out, opacity 0.6s ease-in-out",
    };
  };

  return (
    <div className="relative h-[550px] w-[450px] mx-auto">
      {images.map((movie, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-white px-2 pb-4 shadow-lg pt-1 rounded-lg overflow-hidden cursor-pointer"
          style={getCardStyle(index)}
        >
          <Image
            src={movie.imageSrc}
            alt="movie Image"
            width={320}
            height={520}
            className="h-full w-full object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

const MoviePageBanner = () => {
  const images = [...imageSrc, ...imageSrc, ...imageSrc];
  const [topIndex, setTopIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [returningIndex, setReturningIndex] = useState<number | null>(null);
  const [displayTitle, setDisplayTitle] = useState(imageSrc[0].bannerTitle);
  const [isTitleExiting, setIsTitleExiting] = useState(false);

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const runAnimation = useCallback(() => {
    setIsAnimating(true);
    setIsTitleExiting(true);

    // After swipe completes
    const swipeTimeout = setTimeout(() => {
      const prevIndex = topIndex;
      const newIndex = (topIndex + 1) % images.length;
      const actualIndex = newIndex % imageSrc.length;

      setTopIndex(newIndex);
      setReturningIndex(prevIndex);
      setIsAnimating(false);
      setDisplayTitle(imageSrc[actualIndex].bannerTitle);
      setIsTitleExiting(false);

      const returnTimeout = setTimeout(() => {
        setReturningIndex(null);
      }, 50);
      timeoutRefs.current.push(returnTimeout);
    }, 600);

    timeoutRefs.current.push(swipeTimeout);
  }, [topIndex, images.length]);

  useEffect(() => {
    const interval = setInterval(runAnimation, 3000);
    return () => clearInterval(interval);
  }, [runAnimation]);

  const titleStyle = {
    opacity: isTitleExiting ? 0 : 1,
    transform: isTitleExiting ? "translateY(-20px)" : "translateY(0)",
    transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
  };

  return (
    <div className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 h-420">
        <div className="flex items-center justify-between py-32">
          <div className="flex flex-col space-y-4 max-w-3xl">
            <h1 className="text-6xl font-bold">
              We have hall for
              <br />
              <span className="text-red-600 inline-block" style={titleStyle}>
                {displayTitle}
              </span>
            </h1>
            <p className="text-gray-600">
              A versatile venue with a spacious, dedicated hall ideal for
              hosting events, movie screenings, and beautiful weddings, making
              it your Perfect One-Stop Venue.
            </p>
          </div>

          <CardStack
            topIndex={topIndex}
            isAnimating={isAnimating}
            returningIndex={returningIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default MoviePageBanner;
