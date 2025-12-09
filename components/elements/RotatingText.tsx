import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
}

export function RotatingText({
  texts,
  className = "",
  interval = 3000,
  onIndexChange,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, texts.length]);

  // Notify parent of index changes separately to avoid state updates during render
  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  // Function to highlight specific keywords in red
  const highlightKeywords = (text: string) => {
    const keywords = ["movie", "wedding", "venue"];
    const parts = text.split(/\b/); // Split by word boundaries

    return parts.map((part, i) => {
      const isKeyword = keywords.some(
        (keyword) => part.toLowerCase() === keyword.toLowerCase(),
      );

      if (isKeyword) {
        return (
          <span key={i} className="text-[#BB2327]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <span
      className={`inline-block relative overflow-hidden align-top ${className}`}
      style={{ minHeight: "1.2em" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="block w-full"
        >
          {highlightKeywords(texts[index])}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
