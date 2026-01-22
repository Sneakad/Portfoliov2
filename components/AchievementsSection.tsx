'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';
import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import { achievements } from '@/data/achievements';
import AchievementCard from './AchievementCard';
import { TextReveal } from './magicui/text-reveal';

export default function AchievementsSection() {
  const { ref } = useSectionInView("achievements");
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={ref} id="achievements" className="min-h-screen bg-transparent">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
          <div className="w-full flex flex-col justify-start items-start">
            {/* ACHIEVEMENTS heading - positioned above content */}
            <div className="pl-2 relative z-30">
              <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
                ACHIEVEMENTS{" "}
                <span className="text-[#FF6B35] font-bold text-2xl">·</span>
              </h2>
            </div>
          </div>
        </div>
        
        <div ref={container}>
          {achievements.map((achievement, i) => {
            const targetScale = 1 - ((achievements.length - i) * 0.05);
            return (
              <AchievementCard 
                key={`achievement_${i}`} 
                i={i} 
                {...achievement} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
