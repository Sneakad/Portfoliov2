'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';

export default function WorkSection() {
  const { ref } = useSectionInView("work");
  
  return (
    <section ref={ref} id="work" className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full flex flex-col justify-start items-start">
          {/* WORK heading - positioned above content */}
          <div className="pl-2 relative z-30">
            <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
              WORK{" "}
              <span className="text-[#FF6B35] font-bold text-2xl">·</span>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-100 rounded-lg p-8 h-64 flex items-center justify-center">
              <p className="text-xl font-semibold text-gray-600">Work Item {item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
