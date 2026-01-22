'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';

export default function ApproachSection() {
  const { ref } = useSectionInView("approach");
  
  return (
    <section ref={ref} id="approach" className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full flex flex-col justify-start items-start">
          {/* APPROACH heading - positioned above content */}
          <div className="pl-2 relative z-30">
            <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
              APPROACH{" "}
              <span className="text-[#FF6B35] font-bold text-2xl">·</span>
            </h2>
          </div>
        </div>
        {/* Approach content will go here */}
      </div>
    </section>
  );
}
