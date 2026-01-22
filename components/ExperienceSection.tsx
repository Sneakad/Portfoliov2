'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';
import { TextReveal } from './magicui/text-reveal';
import { useState } from 'react';
import { experiences } from '@/data/experiences';

export default function ExperienceSection() {
  const { ref } = useSectionInView("experience");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  return (
    <section ref={ref} id="experience" className="min-h-screen bg-transparent py-20 sm:py-32 lg:py-40">
      <div className="w-full flex flex-col justify-start items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="w-full flex flex-col justify-start items-start">
          {/* EXPERIENCE heading - positioned above content */}
          <div className="pl-2 relative z-30">
            <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
              EXPERIENCE{" "}
              <span className="text-[#FF6B35] font-bold text-2xl">·</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center px-4 sm:px-6 lg:px-0">
        {/* Experience Timeline */}
        <div className="mt-2 sm:mt-4 w-full mx-auto">
          <div className="w-full">
            {experiences.map((experience, index) => (
              <div 
                key={`experience-${index}`}
                className={`flex flex-col sm:flex-row items-start sm:items-center py-6 sm:py-8 px-2 sm:px-4 cursor-pointer relative overflow-hidden h-auto sm:h-32 transition-all duration-300 ${
                  index < experiences.length - 1 ? 'border-b border-gray-300' : ''
                }`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Background overlay that slides from middle */}
                <div 
                  className={`absolute inset-0 bg-[#FF6B35] transition-transform duration-500 ease-out ${
                    hoveredRow === index ? 'transform scale-y-100' : 'transform scale-y-0'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-7xl mx-auto gap-4 sm:gap-0">
                  {/* Year - Left side on desktop, top on mobile */}
                  <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-colors duration-500 ${
                    hoveredRow === index ? 'text-white' : 'text-[#ED4C22] sm:text-black'
                  }`}>
                    {experience.year}
                  </div>
                  
                  {/* Job details - Right side on desktop, bottom on mobile */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2 transition-colors duration-500 leading-tight ${
                      hoveredRow === index ? 'text-white' : 'text-black'
                    }`}>
                      {experience.title}
                    </div>
                    <div className={`text-base sm:text-lg md:text-xl transition-colors duration-500 ${
                      hoveredRow === index ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      {experience.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
