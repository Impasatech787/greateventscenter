import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";

interface CardStackProps {
  images: string[];
  interval?: number;
  className?: string;
  width?: string;
  height?: string;
}

export function CardStack({
  images,
  interval = 3000,
  className = "",
  width = "320px",
  height = "380px",
}: CardStackProps) {
  const [cards, setCards] = useState(images);

  useEffect(() => {
    setCards(images);
  }, [images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCards((prev) => {
        const newArray = [...prev];
        const first = newArray.shift(); // Remove first
        if (first) newArray.push(first); // Add to end
        return newArray;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  // We only render the top 3 cards for the visual stack
  // But we need to be careful about keys to ensure React tracks them correctly for animations
  const visibleCards = cards.slice(0, 3);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <AnimatePresence mode="popLayout">
        {visibleCards.map((image, index) => {
          // Deterministic "random" based on image string to prevent re-render jitter
          const seed = image.length + (image.charCodeAt(0) || 0);
          const exitX = seed % 2 === 0 ? 600 : -600;
          const exitRotate = seed % 2 === 0 ? 15 : -15;

          return (
            <motion.div
              key={image}
              layout
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{
                scale: index === 0 ? 1 : index === 1 ? 0.95 : 0.9,
                y: index === 0 ? 0 : index === 1 ? 10 : 20,
                rotate: index === 0 ? 0 : index === 1 ? -2 : 2,
                opacity: 1,
                zIndex: 30 - index * 10,
              }}
              exit={{
                x: exitX,
                y: 50,
                rotate: exitRotate,
                opacity: 0,
                scale: 1.1,
                zIndex: 50, // Ensure exiting card stays on top
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }}
              transition={{ duration: 0.5 }}
              className={`absolute top-0 left-0 w-full h-full bg-white p-3 pb-12 shadow-xl rounded-md border border-zinc-100 ${
                index === 0 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                transformOrigin: "center bottom",
              }}
            >
              <div className="w-full h-full bg-zinc-100 overflow-hidden rounded-sm">
                <ImageWithFallback
                  src={image}
                  alt="Gallery"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
