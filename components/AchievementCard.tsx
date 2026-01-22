'use client';

import { useTransform, useScroll, motion } from 'framer-motion';
import { useRef } from 'react';
import PlaceholderImage from './PlaceholderImage';

interface AchievementCardProps {
  title: string;
  subtitle?: string;
  description: string;
  src: string;
  link: string;
  color: string;
  i: number;
  progress: any;
  range: [number, number];
  targetScale: number;
}

const AchievementCard = ({ title, subtitle, description, src, link, color, i, progress, range, targetScale }: AchievementCardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  // Determine text color based on background color
  const textColor = color === '#FFFFFF' ? '#161514' : '#FFFFFF';
  const strokeColor = color === '#FFFFFF' ? '#161514' : '#FFFFFF';

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="flex flex-col lg:flex-row relative h-[500px] sm:h-[550px] lg:h-[600px] max-w-7xl w-full rounded-[15px] sm:rounded-[20px] lg:rounded-[25px] p-6 sm:p-8 lg:p-[60px] transform-origin-top"
        style={{backgroundColor: color, scale, top: `calc(-5vh + ${i * 25}px)`}}
      >
        {/* Mobile: Graphic at top, Desktop: Text on left */}
        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* Graphic section - appears first on mobile, second on desktop */}
          <div className="w-full lg:w-[40%] h-32 sm:h-48 lg:h-full flex items-center justify-center order-1 lg:order-2 mb-4 lg:mb-0">
            <div className="relative w-full h-full">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 400 400" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-full lg:h-full max-w-[400px] max-h-[400px]"
              >
              {i === 0 && (
                /* Dotted circle for first card */
                <>
                  {[...Array(90)].map((_, i) => {
                    const angle = (i * Math.PI / 45); // 90 dots around the circle
                    const radius = 160;
                    const x = 200 + Math.cos(angle) * radius;
                    const y = 200 + Math.sin(angle) * radius;
                    return (
                      <circle 
                        key={i}
                        cx={x} 
                        cy={y} 
                        r="3" 
                        fill={strokeColor}
                        opacity="0.8"
                      />
                    );
                  })}
                </>
              )}
              
              {i === 1 && (
                /* Dotted triangle for second card */
                <>
                  {[...Array(60)].map((_, i) => {
                    const side = Math.floor(i / 20); // 20 dots per side
                    const position = (i % 20) / 19; // 0 to 1 along the side
                    const size = 220;
                    const centerX = 200;
                    const centerY = 200;
                    
                    let x, y;
                    if (side === 0) {
                      // Bottom side
                      x = centerX - size/2 + (size * position);
                      y = centerY + size/2;
                    } else if (side === 1) {
                      // Right side
                      x = centerX + size/2 - (size * position * 0.5);
                      y = centerY - size/2 + (size * position * 0.866);
                    } else {
                      // Left side
                      x = centerX - size/2 + (size * position * 0.5);
                      y = centerY - size/2 + (size * position * 0.866);
                    }
                    
                    return (
                      <circle 
                        key={i}
                        cx={x} 
                        cy={y} 
                        r="3" 
                        fill={strokeColor}
                        opacity="0.8"
                      />
                    );
                  })}
                </>
              )}
              
              {i === 2 && (
                /* Dotted square for third card */
                <>
                  {[...Array(80)].map((_, i) => {
                    const side = Math.floor(i / 20); // 20 dots per side
                    const position = (i % 20) / 19; // 0 to 1 along the side
                    const size = 220;
                    const centerX = 200;
                    const centerY = 200;
                    
                    let x, y;
                    if (side === 0) {
                      // Top side
                      x = centerX - size/2 + (size * position);
                      y = centerY - size/2;
                    } else if (side === 1) {
                      // Right side
                      x = centerX + size/2;
                      y = centerY - size/2 + (size * position);
                    } else if (side === 2) {
                      // Bottom side
                      x = centerX + size/2 - (size * position);
                      y = centerY + size/2;
                    } else {
                      // Left side
                      x = centerX - size/2;
                      y = centerY + size/2 - (size * position);
                    }
                    
                    return (
                      <circle 
                        key={i}
                        cx={x} 
                        cy={y} 
                        r="3" 
                        fill={strokeColor}
                        opacity="0.8"
                      />
                    );
                  })}
                </>
              )}
              </svg>
            </div>
          </div>

          {/* Text content section - appears second on mobile, first on desktop */}
          <div className="flex flex-col justify-between w-full lg:w-[60%] h-full order-2 lg:order-1">
            {/* Header section */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-bold leading-tight" style={{color: textColor}}>
                {title}
              </h2>
              {subtitle && (
                <h3 className="text-lg sm:text-xl lg:text-[24px] font-semibold mt-2 sm:mt-3 lg:mt-4 opacity-90" style={{color: textColor}}>
                  {subtitle}
                </h3>
              )}
            </div>
            
            {/* Description section */}
            <div className="max-w-full lg:max-w-[500px] mt-4 sm:mt-6 lg:mt-8">
              <p className="text-sm sm:text-base lg:text-2xl leading-relaxed opacity-90" style={{color: textColor}}>
                {description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AchievementCard;
