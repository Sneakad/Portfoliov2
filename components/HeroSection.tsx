'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const size = isHovered ? 400 : 40;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation for the hero section
      gsap.fromTo(
        heroRef.current,
        { 
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.5
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      id="hero-section"
      className="h-[90vh] relative overflow-hidden flex items-center justify-center bg-gray-100"
    >
      {/* Mask Effect for Hero Text */}
      <motion.div 
        className="absolute inset-0 z-[10001]"
        style={{
          maskImage: "url('/mask.svg')",
          maskRepeat: "no-repeat",
          maskSize: "40px",
          background: "#FF6B35",
          color: "#161514",
        }}
        animate={{
          WebkitMaskPosition: `${mousePosition.x - (size/2)}px ${mousePosition.y - (size/2)}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div 
            className="text-center px-6"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-black leading-tight tracking-tight">
              I design digital<br />
              <span className="text-black">interfaces</span><br />
              that evolve
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Main Content Container - Background Layer */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center">
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-[#161514] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          I develop digital<br />
          <span className="text-[#FF6B35]">systems</span><br />
          that solve
        </motion.h1>
      </div>
    </section>
  );
};

export default HeroSection;
