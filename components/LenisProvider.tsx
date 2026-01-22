'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';

interface LenisProviderProps {
  children: React.ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2, // Smoothness duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      direction: 'vertical', // Scroll direction
      gestureDirection: 'vertical', // Gesture direction
      smooth: true, // Enable smooth scrolling
      smoothTouch: false, // Disable smooth scrolling on touch devices for better performance
      touchMultiplier: 2, // Touch sensitivity multiplier
      infinite: false, // Disable infinite scrolling
    });

    // Expose Lenis instance globally for other components to use
    if (typeof window !== 'undefined') {
      // Small delay to ensure Lenis is fully initialized
      setTimeout(() => {
        (window as any).lenis = lenisRef.current;
        console.log('Lenis initialized and exposed to window:', lenisRef.current);
      }, 50);
    }

    // Integrate Lenis with GSAP
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Optional: Add GSAP ticker integration
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      if (typeof window !== 'undefined') {
        delete (window as any).lenis;
      }
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
