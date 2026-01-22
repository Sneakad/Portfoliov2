'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollSmoother plugin
    gsap.registerPlugin(ScrollSmoother);

    // Create smooth scroller
    if (containerRef.current) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: containerRef.current,
        content: containerRef.current.querySelector('.smooth-content') as HTMLElement,
        smooth: 1.5, // Smoothness factor (higher = smoother)
        effects: true, // Enable smooth effects
        normalizeScroll: true, // Normalize scroll across devices
        ignoreMobileResize: true, // Better mobile performance
        smoothTouch: 0.1, // Touch smoothness
      });
    }

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="smooth-wrapper h-screen overflow-hidden">
      <div className="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollProvider;
