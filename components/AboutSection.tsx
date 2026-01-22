"use client";

import { useSectionInView } from "@/hooks/use-section-in-view";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/magicui/text-reveal";

export default function AboutSection() {
  const { ref } = useSectionInView("about");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const blackSectionScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const blackSectionOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  return (
    <section
      ref={ref}
      id="about"
      className="min-h-screen bg-[#FF6B35] py-8 rounded-t-[50px] relative overflow-hidden"
    >
      {/* Black section that scales from small to full width */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 bg-[#161514] z-10 flex items-center justify-center rounded-t-[50px]"
        style={{
          scale: blackSectionScale,
          opacity: blackSectionOpacity,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col justify-center">
          <div className="w-full flex flex-col justify-start items-start">
            {/* ABOUT ME heading - positioned above TextReveal */}
            <div className="pl-2 relative z-30">
              <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-200 font-bold uppercase">
                ABOUT ME{" "}
                <span className="text-[#FF6B35] font-bold text-2xl">·</span>
              </h2>
            </div>
          </div>

          {/* Main text with TextReveal - separate container */}
          <div className="text-2xl md:text-2xl lg:text-4xl xl:text-6xl 2xl:text-7xl text-gray-300 leading-tight font-medium relative z-10">
            <TextReveal
              className="[&_span]:text-gray-300 [&_span]:dark:text-gray-300 w-full"
              highlightWords={[
                "Aditya",
                "AI-integrated",
                "seamless",
                "user-friendly",
                "impactful",
              ]}
              highlightColor="#ff4400ff"
            >
              Hi, I'm Aditya, a creative software developer specializing in AI-integrated
              web applications, delivering seamless, user-friendly, and
              impactful solutions by combining advanced AI capabilities with
              innovative design.
            </TextReveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
