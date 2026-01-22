"use client";

import { useEffect, useRef } from "react";
import { useActiveSectionContext } from "@/context/active-section-context";

export function useSectionInView(sectionName: string, threshold = 0.75) {
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (timeOfLastClick > Date.now() - 1000) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(sectionName);
        }
      },
      {
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [setActiveSection, timeOfLastClick, sectionName, threshold]);

  return {
    ref,
  };
}
