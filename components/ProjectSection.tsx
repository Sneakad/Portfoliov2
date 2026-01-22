"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from './magicui/text-reveal';
import { projects } from '@/data/projects';
import { useSectionInView } from '@/hooks/use-section-in-view';
import Image from 'next/image';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollSection = () => {
  const { ref } = useSectionInView("projects");
  const racesWrapperRef = useRef<HTMLDivElement>(null);
  const racesRef = useRef<HTMLDivElement>(null);

  // Function to get image path based on project title
  const getProjectImage = (title: string) => {
    const imageMap: { [key: string]: string } = {
      'Moneysense': '/moneyssense.jpg',
      'Lern': '/lern.png',
      'Storz': '/storz.png',
      'Codz': '/codz.png',
      'Crypt Art': '/cryptart.jpg',
      'Courzed': '/courzed.png',
      'Origin Resorts': '/originresorts.png'
    };
    return imageMap[title] || '/placeholder.jpg';
  };

  useEffect(() => {
    const races = racesRef.current;
    const racesWrapper = racesWrapperRef.current;

    if (!races || !racesWrapper) return;

    const getScrollAmount = () => {
      let racesWidth = races.scrollWidth;
      // Adjust margin based on screen size
      let marginLeft = window.innerWidth < 640 ? window.innerWidth * 0.1 : window.innerWidth * 0.05; // 10vw for mobile, 5vw for desktop
      return -(racesWidth - window.innerWidth + marginLeft);
    };

    const tween = gsap.to(races, {
      x: getScrollAmount,
      duration: 3,
      ease: "none"
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
      markers: false // Set to true for debugging
    });

    // Animation to change background color from black to transparent
    const backgroundAnimation = gsap.to(racesWrapper, {
      backgroundColor: "transparent",
      duration: 0.3,
      ease: "power2.out"
    });

    // Animation to change card colors from white to black
    const cardAnimation = gsap.to(".project-card", {
      backgroundColor: "#161514",
      duration: 0.3,
      ease: "power2.out"
    });

    // Animation to change text colors for readability
    const textAnimation = gsap.to(".project-description, .project-type", {
      color: "#ffffff",
      duration: 0.1,
      ease: "power2.out"
    });

    // Animation to change project title colors to orange
    const titleAnimation = gsap.to(".project-title", {
      color: "#FF6B35",
      duration: 0.1,
      ease: "power2.out"
    });

    // Create a separate ScrollTrigger for the background animation
    const backgroundScrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: "top 10%",
      animation: backgroundAnimation,
      scrub: 1,
      markers: false
    });

    // Create a separate ScrollTrigger for the card animation
    const cardScrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: "top 10%",
      animation: cardAnimation,
      scrub: 1,
      markers: false
    });

    // Create a separate ScrollTrigger for the text animation
    const textScrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: "top 10%",
      animation: textAnimation,
      scrub: 1,
      markers: false
    });

    // Create a separate ScrollTrigger for the title animation
    const titleScrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: "top 10%",
      animation: titleAnimation,
      scrub: 1,
      markers: false
    });

    // Optional: Add drag/touch support
    const observer = ScrollTrigger.observe({
      target: racesWrapper,
      type: "pointer,touch",
      onDrag: (self) => {
        gsap.to(window, { 
          scrollTo: { y: `+=${self.deltaX * 10}` },
          duration: 0.3
        });
      }
    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
      backgroundScrollTrigger.kill();
      cardScrollTrigger.kill(); // Added cardScrollTrigger to cleanup
      textScrollTrigger.kill(); // Added textScrollTrigger to cleanup
      titleScrollTrigger.kill(); // Added titleScrollTrigger to cleanup
      observer.kill();
      tween.kill();
      backgroundAnimation.kill();
      cardAnimation.kill(); // Added cardAnimation to cleanup
      textAnimation.kill(); // Added textAnimation to cleanup
      titleAnimation.kill(); // Added titleAnimation to cleanup
    };
  }, []);

  return (
    <section ref={ref} id="projects">
        {/* Text section */}
        <div className="bg-[#161514] pb-4 pt-20 sm:pt-32 lg:pt-42">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-center px-4 sm:px-6 lg:px-0">
            <div className="w-full flex flex-col justify-start items-start">
              {/* PROJECTS heading - positioned above content */}
              <div className="pl-2 relative z-30">
                <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-200 font-bold uppercase">
                  PROJECTS{" "}
                  <span className="text-[#FF6B35] font-bold text-2xl">·</span>
                </h2>
              </div>
            </div>
            
            {/* Main text with TextReveal */}
            <div className="pb-8 sm:pb-12 lg:pb-16 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl text-gray-300 leading-tight relative z-10">
              <TextReveal 
                className="[&_span]:text-gray-300 [&_span]:dark:text-gray-300 w-full"
                highlightWords={["cool", "projects", "built", "check"]}
                highlightColor="#ff4400ff"
              >
                Here are some cool projects I built. Take a look at what I've been working on.
              </TextReveal>
            </div>
          </div>
        </div>
      
      {/* Main horizontal scroll section */}
      <div className="overflow-hidden bg-[#161514]" ref={racesWrapperRef}>
        <div className="w-fit flex flex-nowrap gap-4 sm:gap-6 lg:gap-8 p-2 ml-[10vw] sm:ml-[5vw] justify-start" ref={racesRef}>
          {projects.map((project, index) => (
            <a
              key={`project-${index}`}
              href={project.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card w-[85vw] sm:w-[80vw] lg:w-[75vw] max-w-[650px] min-w-[300px] sm:min-w-[400px] lg:min-w-[550px] h-[70vh] sm:h-[75vh] bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl flex-shrink-0 relative overflow-hidden pointer-events-auto block transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="p-4 sm:p-6 lg:p-12 h-full flex flex-col justify-between">
                <h3 className="project-title text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 sm:mb-4 lg:mb-6 text-[#FF6B35] leading-tight">
                  {project.title}
                </h3>
                
                {/* Project Image */}
                <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4 sm:mb-6 lg:mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={getProjectImage(project.title)}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 80vw, 75vw"
                  />
                </div>
                
                <p className="project-description text-sm sm:text-base lg:text-xl leading-relaxed mb-4 sm:mb-6 lg:mb-8 text-gray-600 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                  {project.techStack.map((tech, techIndex) => (
                    <span 
                      key={`tech-${index}-${techIndex}`} 
                      className="bg-[#ff6b35] text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm lg:text-base font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollSection;
