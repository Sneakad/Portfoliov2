'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  useEffect(() => {
    // Lenis drives itself from a single rAF loop. Driving it from two clocks
    // (rAF + gsap.ticker) makes its frame delta jump around and the scroll stutter.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 2,
      autoRaf: true,
    });

    // Expose Lenis globally for components that scroll programmatically
    (window as Window & { lenis?: Lenis }).lenis = lenis;

    return () => {
      lenis.destroy();
      delete (window as Window & { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
