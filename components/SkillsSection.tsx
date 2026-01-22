'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useSectionInView } from '@/hooks/use-section-in-view';
import { 
  Code2, 
  Database, 
  Palette, 
  Globe, 
  Zap, 
  GitBranch, 
  Coffee, 
  Leaf, 
  Flame, 
  Target, 
  Image, 
  Box,
  Settings,
  Wrench,
  FileCode,
  Layers,
  Workflow,
  Server,
  Triangle
} from 'lucide-react';

export default function SkillsSection() {
  const { ref } = useSectionInView("skills");
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  return (
    <section ref={ref} id="skills" className="overflow-hidden bg-[#161514] py-0">
      <div className='h-[2vh]'/>
      
      {/* TECH STACK heading */}
      <div className="w-full flex flex-col justify-start items-start max-w-7xl mx-auto px-4 sm:px-6 md:px-0 mb-8">
        <div className="w-full flex flex-col justify-start items-start">
          {/* TECH STACK AND TOOLS heading - positioned above content */}
          <div className="pl-2 relative z-30">
            <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-200 font-bold uppercase">
              TECH STACK AND TOOLS{" "}
              <span className="text-[#FF6B35] font-bold text-2xl">·</span>
            </h2>
          </div>
        </div>
      </div>
      
      <div ref={container}>
        {/* Mobile: 6 rows, Tablet: 4 rows, Desktop: 3 rows */}
        <div className="block lg:hidden">
          {/* Mobile and Tablet Layout - More rows */}
          <Slide direction={'right'} left={"-5%"} progress={scrollYProgress} rowIndex={0} totalRows={6} isMobile={true}/>
          <Slide direction={'left'} left={"-25%"} progress={scrollYProgress} rowIndex={1} totalRows={6} isMobile={true}/>
          <Slide direction={'right'} left={"-45%"} progress={scrollYProgress} rowIndex={2} totalRows={6} isMobile={true}/>
          <Slide direction={'left'} left={"-65%"} progress={scrollYProgress} rowIndex={3} totalRows={6} isMobile={true}/>
          <Slide direction={'right'} left={"-85%"} progress={scrollYProgress} rowIndex={4} totalRows={6} isMobile={true}/>
          <Slide direction={'left'} left={"-105%"} progress={scrollYProgress} rowIndex={5} totalRows={6} isMobile={true}/>
        </div>
        
        <div className="hidden lg:block">
          {/* Desktop Layout - Original 3 rows */}
          <Slide direction={'right'} left={"-5%"} progress={scrollYProgress} rowIndex={0} totalRows={3} isMobile={false}/>
          <Slide direction={'left'} left={"-55%"} progress={scrollYProgress} rowIndex={1} totalRows={3} isMobile={false}/>
          <Slide direction={'right'} left={"-95%"} progress={scrollYProgress} rowIndex={2} totalRows={3} isMobile={false}/>
        </div>
      </div>
      <div className='h-[10vh]' />
    </section>
  );
}

interface SlideProps {
  direction: 'left' | 'right';
  left: string;
  progress: any;
  rowIndex: number;
  totalRows: number;
  isMobile: boolean;
}

const Slide = ({ direction, left, progress, rowIndex, totalRows, isMobile }: SlideProps) => {
  const directionValue = direction === 'left' ? -1 : 1;
  const translateX = useTransform(progress, [0, 1], [150 * directionValue, -150 * directionValue]);

  return (
    <motion.div 
      style={{ x: translateX, left }} 
      className="relative flex whitespace-nowrap"
    >
      <Phrase rowIndex={rowIndex} totalRows={totalRows} isMobile={isMobile} />
      <Phrase rowIndex={rowIndex} totalRows={totalRows} isMobile={isMobile} />
      <Phrase rowIndex={rowIndex} totalRows={totalRows} isMobile={isMobile} />
    </motion.div>
  );
};

const Phrase = ({ rowIndex, totalRows, isMobile }: { rowIndex: number; totalRows: number; isMobile: boolean }) => {
  const allTechnologies = [
    { name: 'JavaScript', icon: Code2 },
    { name: 'TypeScript', icon: FileCode },
    { name: 'React.js', icon: Zap },
    { name: 'Next.js', icon: Triangle },
    { name: 'Node.js', icon: Server },
    { name: 'Bun', icon: Globe },
    { name: 'Hono', icon: Palette },
    { name: 'Langchain', icon: Layers },
    { name: 'Webflow', icon: Workflow },
    { name: 'Shopify', icon: GitBranch },
    { name: 'C++', icon: Settings },
    { name: 'Tailwind', icon: Wrench },
    { name: 'Shadcn', icon: Coffee },
    { name: 'MongoDB', icon: Leaf },
    { name: 'SQL', icon: Database },
    { name: 'Firebase', icon: Flame },
    { name: 'Figma', icon: Target },
    { name: 'Photoshop', icon: Image },
    { name: 'Blender', icon: Box }
  ];

  // Distribute technologies across the specified number of rows
  const techsPerRow = Math.ceil(allTechnologies.length / totalRows);
  const startIndex = rowIndex * techsPerRow;
  const endIndex = startIndex + techsPerRow;
  const technologies = allTechnologies.slice(startIndex, endIndex);

  return (
    <div className='px-3 flex gap-3 items-center'>
      {technologies.map((tech, index) => {
        const IconComponent = tech.icon;
        return (
          <div key={index} className='flex gap-3 items-center'>
            <p className='text-[4.5vw] sm:text-[3vw] font-bold text-[#FF6B35] whitespace-nowrap'>{tech.name}</p>
            <span className="relative h-[4.5vw] sm:h-[3vw] aspect-square rounded-full overflow-hidden bg-[#FF6B35] flex items-center justify-center">
              <IconComponent className="text-white w-[2.25vw] sm:w-[1.5vw] h-[2.25vw] sm:h-[1.5vw]" />
            </span>
          </div>
        );
      })}
    </div>
  );
};
