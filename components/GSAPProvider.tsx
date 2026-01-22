'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

interface GSAPProviderProps {
  children: React.ReactNode;
}

const GSAPProvider = ({ children }: GSAPProviderProps) => {
  useEffect(() => {
    // Register GSAP plugins if needed
    // gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // Set default GSAP settings
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8
    });
  }, []);

  return <>{children}</>;
};

export default GSAPProvider;
