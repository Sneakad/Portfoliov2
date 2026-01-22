'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSectionContext } from '@/context/active-section-context';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Lenis from 'lenis';

const FloatingNavbar = () => {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Get Lenis instance from window with a small delay to ensure it's initialized
    const getLenisInstance = () => {
      if (typeof window !== 'undefined') {
        lenisRef.current = (window as any).lenis;
      }
    };
    
    // Try immediately
    getLenisInstance();
    
    // If not found, try again after a short delay
    if (!lenisRef.current) {
      setTimeout(getLenisInstance, 100);
    }
  }, []);

  const navItems = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Achievements', href: '#achievements', id: 'achievements' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-[99999] flex justify-end md:justify-center" data-navbar>
      {/* Desktop Navigation */}
      <motion.div
        className="relative p-1  rounded-full border border-gray-200 border-opacity-40 bg-white bg-opacity-90 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] flex items-center hidden md:flex"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 30,
        }}
      >
        <nav className="flex items-center w-full">
          {navItems.map((item, index) => (
            <motion.div
              className="relative flex-1"
              key={item.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <a
                className={clsx(
                  "flex items-center justify-center h-full px-4 py-3 text-sm font-medium transition-colors rounded-full relative z-10",
                  {
                    "text-black": activeSection === item.id,
                    "text-gray-900 hover:text-[#FF6B35] transition-colors duration-500": activeSection !== item.id,
                  }
                )}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                  setTimeOfLastClick(Date.now());
                  
                  // Smooth scroll to section using Lenis
                  const targetSection = document.getElementById(item.id);
                  console.log('Scrolling to section:', item.id, 'Target:', targetSection, 'Lenis:', lenisRef.current);
                  
                  if (targetSection && lenisRef.current) {
                    lenisRef.current.scrollTo(targetSection, {
                      offset: -100, // Offset for navbar height
                      duration: 2.5,
                      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                  } else if (targetSection) {
                    // Fallback to native smooth scrolling if Lenis is not available
                    console.log('Using fallback smooth scroll');
                    targetSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    console.error('Target section not found:', item.id);
                  }
                }}
              >
                {item.name}

                {item.id === activeSection && (
                  <motion.span
                    className="bg-[#FF6B35] rounded-full absolute inset-0 -z-10"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.div
        className="relative h-[2.5rem] px-4 mr-4 rounded-full border border-gray-200 border-opacity-40 bg-white bg-opacity-90 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] flex items-center justify-between md:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 30,
        }}
      >
        {/* Logo/Brand */}

        {/* Hamburger Menu Button */}
        <motion.button
          className="flex flex-col justify-center items-center w-6 h-6"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className="w-5 h-0.5 bg-gray-900 rounded-full mb-0.5"
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.span
            className="w-5 h-0.5 bg-gray-900 rounded-full mb-0.5"
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.span
            className="w-5 h-0.5 bg-gray-900 rounded-full"
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </motion.button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#161514]/50 backdrop-blur-sm z-[99998] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-24 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200/40 overflow-hidden"
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="py-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <a
                      className={clsx(
                        "flex items-center px-6 py-4 text-gray-900 font-medium transition-colors relative",
                        {
                          "bg-[#FF6B35] text-white": activeSection === item.id,
                          "hover:bg-gray-100": activeSection !== item.id,
                        }
                      )}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(item.id);
                        setTimeOfLastClick(Date.now());
                        setIsMobileMenuOpen(false);
                        
                        // Smooth scroll to section using Lenis
                        const targetSection = document.getElementById(item.id);
                        console.log('Mobile: Scrolling to section:', item.id, 'Target:', targetSection, 'Lenis:', lenisRef.current);
                        
                        if (targetSection && lenisRef.current) {
                          lenisRef.current.scrollTo(targetSection, {
                            offset: -100,
                            duration: 2.5,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                          });
                        } else if (targetSection) {
                          // Fallback to native smooth scrolling if Lenis is not available
                          console.log('Mobile: Using fallback smooth scroll');
                          targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        } else {
                          console.error('Mobile: Target section not found:', item.id);
                        }
                      }}
                    >
                      {item.name}
                      {item.id === activeSection && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B35]"
                          layoutId="mobileActiveSection"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </a>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNavbar;
