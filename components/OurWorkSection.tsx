'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';

export default function OurWorkSection() {
  const { ref } = useSectionInView("work");

  return (
    <section ref={ref} id="work" className="min-h-screen bg-[#161514] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with dot and title */}
        <div className="mb-16">
          <div className="w-full flex flex-col justify-start items-start">
            {/* OUR WORK heading - positioned above content */}
            <div className="pl-2 relative z-30">
              <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
                OUR WORK{" "}
                <span className="text-[#FF6B35] font-bold text-2xl">·</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left side - Main text */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-white">
              Global teams trust us to take on complex challenges, push creative boundaries, and move fast when it matters most. We bring clarity, momentum, and a little heat to every project.
            </h1>
          </div>

          {/* Right side - Number */}
          <div className="lg:col-span-4 flex justify-end">
            <span className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-[#FF6B35] opacity-80">
              (01)
            </span>
          </div>
        </div>

        {/* Bottom divider line */}
        <div className="mt-16 pt-8">
          <div className="w-full h-px bg-gray-600"></div>
        </div>
      </div>
    </section>
  );
}
