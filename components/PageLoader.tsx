'use client'

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const PageLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setIsLoading(false), 200);
      }
    });

    // Animate decorative circles
    circleRefs.current.forEach((circle, index) => {
      gsap.fromTo(
        circle,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 0.1,
          duration: 1.2,
          delay: index * 0.15,
          ease: 'back.out(1.7)',
        }
      );

      // Pulse animation
      gsap.to(circle, {
        scale: 1.2,
        opacity: 0.05,
        duration: 2,
        delay: index * 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animate lines
    gsap.fromTo(
      linesRef.current?.children,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 0.2,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );

    // Animate logo entrance
    tl.fromTo(
      logoRef.current,
      { 
        scale: 0.8,
        opacity: 0,
        y: 30
      },
      { 
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'back.out(1.4)'
      }
    );

    // Animate counter entrance
    tl.fromTo(
      counterRef.current,
      { 
        opacity: 0,
        x: 30
      },
      { 
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out'
      },
      '-=0.5'
    );

    // Animate counter from 0 to 100
    tl.to(
      {},
      {
        duration: 2.5,
        onUpdate: function() {
          const prog = Math.round(this.progress() * 100);
          setProgress(prog);
        },
        ease: 'power2.inOut'
      }
    );

    // Exit animations
    tl.to(
      logoRef.current,
      {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in'
      },
      '+=0.3'
    );

    tl.to(
      counterRef.current,
      {
        x: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      },
      '-=0.5'
    );

    // Slide entire loader up
    tl.to(
      loaderRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut'
      },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[200000] bg-gradient-to-br from-[#0a0a0a] via-[#161514] to-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Decorative Circles */}
        <div 
          ref={(el) => { circleRefs.current[0] = el; }}
          className="absolute top-10 left-5 md:top-20 md:left-20 w-32 h-32 md:w-64 md:h-64 rounded-full border border-[#FF6B35]/20"
        />
        <div 
          ref={(el) => { circleRefs.current[1] = el; }}
          className="absolute bottom-20 right-10 md:bottom-32 md:right-32 w-48 h-48 md:w-96 md:h-96 rounded-full border border-[#FF6B35]/20"
        />
        <div 
          ref={(el) => { circleRefs.current[2] = el; }}
          className="absolute top-1/2 left-1/4 md:left-1/3 w-24 h-24 md:w-48 md:h-48 rounded-full border border-white/10"
        />
        
        {/* Decorative Lines */}
        <div ref={linesRef} className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B35]/20 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo */}
        <div ref={logoRef}>
          <Image 
            src="/adi-logo.svg" 
            alt="Adi Logo" 
            width={200} 
            height={80}
            className="w-auto h-12 sm:h-14 md:h-16 lg:h-20 object-contain"
            priority
          />
        </div>
      </div>

      {/* Counter in Bottom Right */}
      <div 
        ref={counterRef}
        className="fixed bottom-8 right-6 sm:bottom-10 sm:right-8 md:bottom-16 md:right-16 z-20"
      >
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tabular-nums leading-none">
            {progress}
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FF6B35] mb-1 sm:mb-2">
            %
          </span>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#FF6B35]/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
    </div>
  );
};

export default PageLoader;
