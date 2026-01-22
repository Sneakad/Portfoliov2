"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
  highlightWords?: string[];
  highlightColor?: string;
}

export const TextReveal: FC<TextRevealProps> = ({ 
  children, 
  className, 
  highlightWords = [], 
  highlightColor = "#FF6B35" 
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end 0.7"]
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  const words = children.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-8xl items-center bg-transparent py-[1rem]"
        }
      >
        <span
          ref={targetRef}
          className={
            "flex flex-wrap font-bold text-black/20 dark:text-white/20"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            const cleanWord = word.replace(/[.,!?;:]/, '');
            const isHighlighted = highlightWords.includes(cleanWord);
            return (
              <Word 
                key={i} 
                progress={scrollYProgress} 
                range={[start, end]}
                isHighlighted={isHighlighted}
                highlightColor={highlightColor}
              >
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlighted?: boolean;
  highlightColor?: string;
}

const Word: FC<WordProps> = ({ children, progress, range, isHighlighted = false, highlightColor = "#FF6B35" }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span
        style={{ 
          opacity: opacity,
          color: isHighlighted ? highlightColor : undefined
        }}
        className={isHighlighted ? "" : "text-gray-300 dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};
