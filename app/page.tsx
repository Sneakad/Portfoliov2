'use client'
import FloatingNavbar from '@/components/FloatingNavbar';
import HeroSection from '@/components/HeroSection';
import GSAPProvider from '@/components/GSAPProvider';
import AboutSection from '@/components/AboutSection';
import VideoMaskSection from '@/components/VideoMaskSection';
import SkillsSection from '@/components/SkillsSection';
import HorizontalScrollSection from '@/components/ProjectSection';
import ExperienceSection from '@/components/ExperienceSection';
import AchievementsSection from '@/components/AchievementsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AnimatedMenu from '@/components/AnimatedMenu';
import Logo from '@/components/Logo';
import PageLoader from '@/components/PageLoader';
import { useEffect } from "react";
import Lenis from 'lenis';

export default function Home() {

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <GSAPProvider>
      <PageLoader />
      <main>
        <Logo />
        <AnimatedMenu />
        <div className="min-h-screen" style={{ backgroundColor: '#E9E9E9' }}>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <HorizontalScrollSection />
          <ExperienceSection />
          <AchievementsSection />
          <ContactSection />
        </div>
        <Footer />
      </main>
    </GSAPProvider>
  );
}
