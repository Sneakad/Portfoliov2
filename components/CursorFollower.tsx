'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isOverProjectCard, setIsOverProjectCard] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch device on client side
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    const updateMousePosition = (e: MouseEvent) => {
      const { target, pageX, pageY } = e;
      
      // Check if the mouse cursor is over the hero section
      const heroSection = document.querySelector('#hero-section');
      const isOverHeroSection = heroSection?.contains(target as Node);
      
      // Check if the mouse cursor is over the navbar
      const navbar = document.querySelector('[data-navbar]');
      const isOverNavbar = navbar?.contains(target as Node);
      
      setIsOverHero(isOverHeroSection);
      
      // Don't update cursor position if over hero section or navbar
      if (isOverHeroSection || isOverNavbar) {
        return;
      }
      
      mouseX = pageX;
      mouseY = pageY;
      setMousePosition({ x: pageX, y: pageY });
    };

    // GSAP animation loop for smooth cursor following
    const cursorAnimation = gsap.to({}, {
      duration: 0.02,
      repeat: -1,
      onRepeat: function () {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;

        if (followerRef.current) {
          gsap.set(followerRef.current, {
            left: posX - 20,
            top: posY - 20
          });
        }

        if (cursorRef.current) {
          gsap.set(cursorRef.current, {
            left: mouseX,
            top: mouseY
          });
        }
      }
    });

    const handleProjectCardEnter = () => {
      console.log('Project card hover enter');
      setIsHovered(true);
      setIsOverProjectCard(true);
      if (cursorRef.current) {
        cursorRef.current.classList.add('active');
      }
      if (followerRef.current) {
        followerRef.current.classList.add('active');
      }
    };

    const handleProjectCardLeave = () => {
      console.log('Project card hover leave');
      setIsHovered(false);
      setIsOverProjectCard(false);
      if (cursorRef.current) {
        cursorRef.current.classList.remove('active');
      }
      if (followerRef.current) {
        followerRef.current.classList.remove('active');
      }
    };

    const handleInteractiveElementEnter = () => {
      setIsHovered(true);
      if (cursorRef.current) {
        cursorRef.current.classList.add('hover');
      }
      if (followerRef.current) {
        followerRef.current.classList.add('hover');
      }
    };

    const handleInteractiveElementLeave = () => {
      setIsHovered(false);
      if (cursorRef.current) {
        cursorRef.current.classList.remove('hover');
      }
      if (followerRef.current) {
        followerRef.current.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    // Function to setup project card listeners
    const setupProjectCardListeners = () => {
      const projectCards = document.querySelectorAll('.project-card');
      console.log('Found project cards:', projectCards.length);
      
      projectCards.forEach((el, index) => {
        console.log(`Setting up listeners for project card ${index}`);
        el.addEventListener('mouseenter', handleProjectCardEnter);
        el.addEventListener('mouseleave', handleProjectCardLeave);
      });
    };

    // Initial setup
    setupProjectCardListeners();

    // Setup listeners again after a short delay to ensure DOM is ready
    setTimeout(setupProjectCardListeners, 1000);

    // Add hover detection for other interactive elements (excluding navbar and project cards)
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      // Skip elements that are inside the navbar or are project cards
      const isInNavbar = el.closest('[data-navbar]');
      const isProjectCard = el.closest('.project-card');
      if (!isInNavbar && !isProjectCard) {
        el.addEventListener('mouseenter', handleInteractiveElementEnter);
        el.addEventListener('mouseleave', handleInteractiveElementLeave);
      }
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      cursorAnimation.kill();
      
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(el => {
        el.removeEventListener('mouseenter', handleProjectCardEnter);
        el.removeEventListener('mouseleave', handleProjectCardLeave);
      });
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleInteractiveElementEnter);
        el.removeEventListener('mouseleave', handleInteractiveElementLeave);
      });
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor */}
      <div 
        ref={cursorRef}
        className="cursor"
        style={{
          opacity: isOverHero ? 0 : 1,
        }}
      />

      {/* Cursor follower */}
      <div 
        ref={followerRef}
        className="cursor-follower"
        style={{
          opacity: isOverHero ? 0 : 1,
        }}
      />
    </>
  );
}
