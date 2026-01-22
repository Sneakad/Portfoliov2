'use client'

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const AnimatedMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mainLinksRef = useRef<(HTMLLIElement | null)[]>([]);
  const socialLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const mainLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' }
  ];
  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aditya-mondal2/', icon: 'LI' },
    { name: 'Discord', url: 'https://discord.com/users/sneakad', icon: 'DC' },
    { name: 'X', url: 'https://twitter.com/sneakad4', icon: 'X' },
    { name: 'GitHub', url: 'https://github.com/Sneakad', icon: 'GH' },
    { name: 'Behance', url: 'https://www.behance.net/adityamondal2', icon: 'BE' },
  ];

  useEffect(() => {
    // Create the timeline
    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // Set initial states
    gsap.set(overlayRef.current, { yPercent: -100 });
    gsap.set(mainLinksRef.current, { y: 100, opacity: 0 });
    gsap.set(socialLinksRef.current, { opacity: 0, y: 30, scale: 0.8 });

    // Build the animation timeline
    tl.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.6,
      ease: 'power3.inOut',
    })
      .to(
        mainLinksRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      )
      .to(
        socialLinksRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      timelineRef.current?.play();
    } else {
      document.body.style.overflow = '';
      timelineRef.current?.reverse();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={handleToggle}
        className={`fixed top-8 right-8 z-[100000] w-14 h-14 flex flex-col justify-center items-center gap-1.5 group rounded-full transition-all duration-500 ease-out ${
          isOpen ? 'bg-[#FF6B35] rotate-90 scale-110' : 'bg-white/90 hover:bg-[#FF6B35]/10 hover:scale-105 backdrop-blur-sm border border-gray-200/40 shadow-lg'
        }`}
        aria-label="Toggle menu"
        style={{ pointerEvents: 'auto', cursor: 'none' }}
      >
        <span
          className={`block w-8 h-0.5 transition-all duration-500 ease-out ${
            isOpen ? 'rotate-45 translate-y-2 bg-white' : 'bg-black group-hover:bg-[#FF6B35]'
          }`}
        />
        <span
          className={`block w-8 h-0.5 transition-all duration-500 ease-out ${
            isOpen ? 'opacity-0 bg-white' : 'bg-black group-hover:bg-[#FF6B35]'
          }`}
        />
        <span
          className={`block w-8 h-0.5 transition-all duration-500 ease-out ${
            isOpen ? '-rotate-45 -translate-y-2 bg-white' : 'bg-black group-hover:bg-[#FF6B35]'
          }`}
        />
        {!isOpen && (
          <span className="absolute -bottom-6 right-0 text-[10px] uppercase tracking-wider text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Menu
          </span>
        )}
      </button>

      {/* Full-Screen Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black z-[99999] overflow-hidden"
        style={{ 
          pointerEvents: isOpen ? 'auto' : 'none',
          cursor: 'none'
        }}
      >
        <div
          ref={menuRef}
          className="w-full h-full flex flex-col justify-center items-center px-4 md:px-8 py-12 overflow-y-auto"
        >
          {/* Main Navigation Links */}
          <nav className="my-auto w-full max-w-6xl px-4">
            <ul className="flex flex-col items-center gap-1 md:gap-3 w-full">
              {mainLinks.map((link, index) => (
                <li
                  key={link.name}
                  ref={(el) => {
                    mainLinksRef.current[index] = el;
                  }}
                  className="menu-link-item w-full max-w-full"
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="menu-link text-white font-bold uppercase leading-[1] tracking-tight transition-all duration-500 ease-out relative flex items-center justify-center w-full"
                    style={{ 
                      fontFamily: 'var(--font-red-hat-display), sans-serif',
                      fontSize: 'clamp(3rem, 7vw, 6.5rem)'
                    }}
                  >
                    <span 
                      className="menu-number text-[#FF6B35]/50 font-normal flex-shrink-0 transition-all duration-500 ease-out mr-3 md:mr-5"
                      style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.3rem)' }}
                    >
                      0{index + 1}
                    </span>
                    <span className="relative transition-all duration-500 ease-out whitespace-nowrap">
                      {link.name}
                      <span className="menu-link-underline"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="mt-auto w-full px-4">
            <div className="w-full max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-4 text-white/40 text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-inter), "Helvetica", sans-serif' }}>
                    Connect
                  </span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                {socialLinks.map((link, index) => (
                  <a
                    key={link.name}
                    ref={(el) => {
                      socialLinksRef.current[index] = el;
                    }}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link group relative"
                    title={link.name}
                  >
                    <div className="social-icon-wrapper relative w-14 h-14 flex items-center justify-center">
                      <div className="social-icon-bg absolute inset-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-500 group-hover:border-[#FF6B35] group-hover:bg-[#FF6B35]/20 group-hover:scale-110 group-hover:rotate-6"></div>
                      <span className="relative z-10 text-white text-sm font-bold transition-all duration-500 group-hover:text-[#FF6B35] group-hover:scale-110" style={{ fontFamily: 'var(--font-inter), "Helvetica", sans-serif' }}>
                        {link.icon}
                      </span>
                    </div>
                    <span className="social-label absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/0 text-[10px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 group-hover:text-[#FF6B35] group-hover:-bottom-7" style={{ fontFamily: 'var(--font-inter), "Helvetica", sans-serif' }}>
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .menu-link {
          display: inline-flex;
          position: relative;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          max-width: 100%;
          will-change: transform;
        }

        .menu-link:hover {
          transform: scale(1.05);
        }

        .menu-link:hover > span:last-child {
          background: linear-gradient(
            120deg,
            #ffffff 0%,
            #FF6B35 50%,
            #FF8C42 100%
          );
          background-size: 200% auto;
          animation: gradientShift 2s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 25px rgba(255, 107, 53, 0.6));
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        .menu-number {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, color;
        }

        .menu-link:hover .menu-number {
          color: #FF6B35;
          transform: scale(1.2);
        }

        .menu-link-underline {
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35 0%, #FF8C42 100%);
          transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 2px;
          box-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
          will-change: width;
        }

        .menu-link:hover .menu-link-underline {
          width: 100%;
        }

        .social-link {
          position: relative;
          cursor: none;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .social-link:hover {
          transform: translateY(-8px);
        }

        .social-icon-wrapper {
          position: relative;
        }

        .social-icon-bg {
          will-change: transform, border-color, background-color;
        }

        .social-icon-bg::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF6B35, #FF8C42, #FF6B35);
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.5s ease;
          animation: gradientRotate 3s ease infinite;
          z-index: -1;
        }

        @keyframes gradientRotate {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .social-link:hover .social-icon-bg::before {
          opacity: 0.6;
        }

        .social-label {
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .menu-link:hover {
            transform: scale(1.03);
          }
          
          .menu-link-underline {
            height: 2px;
            bottom: -4px;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedMenu;
