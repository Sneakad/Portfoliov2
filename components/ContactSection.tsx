'use client';

import { useSectionInView } from '@/hooks/use-section-in-view';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from './magicui/text-reveal';
import { Mail, Phone, MapPin, Send, ArrowRight, Sparkles } from 'lucide-react';
import { sendEmail } from '@/actions/sendEmail';
import toast, { Toaster } from 'react-hot-toast';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const { ref } = useSectionInView("contact");
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const magneticButtonRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState({
    senderEmail: '',
    message: ''
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const form = formRef.current;
    const magneticButton = magneticButtonRef.current;

    if (!section || !title || !form || !magneticButton) return;

    // Title animation with morphing effect
    const titleAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      }
    });

    titleAnimation
      .from(title.children, {
        y: 100,
        opacity: 0,
        rotationX: 90,
        transformOrigin: "bottom",
        stagger: 0.1,
        duration: 1,
        ease: "back.out(1.7)"
      })
      .to(title, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.5");

    // Form elements stagger animation
    const formElements = form.querySelectorAll('.form-element');
    gsap.fromTo(formElements, 
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
        rotationY: 15
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: form,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Magnetic button effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = magneticButton.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(magneticButton, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(magneticButton, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    magneticButton.addEventListener('mousemove', handleMouseMove);
    magneticButton.addEventListener('mouseleave', handleMouseLeave);

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      const handleFocus = () => {
        gsap.to(input, {
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(255, 107, 53, 0.2)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleBlur = () => {
        gsap.to(input, {
          scale: 1,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup
    return () => {
      magneticButton.removeEventListener('mousemove', handleMouseMove);
      magneticButton.removeEventListener('mouseleave', handleMouseLeave);
      inputs.forEach((input) => {
        input.removeEventListener('focus', () => {});
        input.removeEventListener('blur', () => {});
      });
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (formData: FormData) => {
    // Animate button on submit
    if (magneticButtonRef.current) {
      gsap.to(magneticButtonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }

    const { data, error } = await sendEmail(formData);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Email sent successfully!");
    
    // Reset form
    setFormData({
      senderEmail: '',
      message: ''
    });
  };

  return (
    <section ref={ref} id="contact" className="relative min-h-screen bg-transparent">
      <Toaster />
      <div ref={sectionRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header Section */}
          <div className="w-full flex flex-col justify-start items-start mb-0">
             <div className="relative z-30 pl-2">
              <h2 className="text-sm md:text-lg tracking-[0.3em] text-gray-900 font-bold uppercase">
              CONTACT{" "}
                <span className="text-[#FF6B35] font-bold text-2xl">·</span>
              </h2>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-left mb-12 sm:mb-16 lg:mb-20">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight">
              LET'S <span className="text-[#FF6B35]">TALK</span>
            </div>
            <div className="mt-4 sm:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl">
              Ready to collaborate on something innovative? Let's build something extraordinary together.
            </div>
          </div>

          {/* Two Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Left Card - Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Send Message
              </h3>
              <form 
                ref={formRef} 
                action={async (formData) => {
                  await handleSubmit(formData);
                }} 
                className="space-y-4 sm:space-y-6"
              >
                {/* Email Field */}
                <div className="form-element">
                  <label htmlFor="senderEmail" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Mail
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all duration-300 text-sm sm:text-base text-gray-900"
                    placeholder="Your email"
                    required
                    maxLength={500}
                  />
                </div>

                {/* Message Field */}
                <div className="form-element">
                  <label htmlFor="message" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all duration-300 text-sm sm:text-base text-gray-900 resize-none"
                    placeholder="Your text"
                    required
                    maxLength={5000}
                  />
                </div>

                {/* Submit Button */}
                <div className="form-element pt-2 sm:pt-4">
                  <button
                    ref={magneticButtonRef}
                    type="submit"
                    className="w-full py-3 sm:py-4 bg-[#FF6B35] text-white font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-[#e55a2b] transition-all duration-300"
                  >
                    Send Mail
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card - Social Media */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Connect With Me
              </h3>
              
              <div className="flex flex-col space-y-4 sm:space-y-5">
                <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 tracking-tight">
                    LINKEDIN
                  </h3>
                  <div className="w-full h-0.5 bg-gray-200 group-hover:bg-[#FF6B35] group-hover:h-1 transition-all duration-300 mt-1"></div>
                </div>
                
                <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 tracking-tight">
                    DISCORD
                  </h3>
                  <div className="w-full h-0.5 bg-gray-200 group-hover:bg-[#FF6B35] group-hover:h-1 transition-all duration-300 mt-1"></div>
                </div>
                
                <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 tracking-tight">
                    X
                  </h3>
                  <div className="w-full h-0.5 bg-gray-200 group-hover:bg-[#FF6B35] group-hover:h-1 transition-all duration-300 mt-1"></div>
                </div>
                
                <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 tracking-tight">
                    GITHUB
                  </h3>
                  <div className="w-full h-0.5 bg-gray-200 group-hover:bg-[#FF6B35] group-hover:h-1 transition-all duration-300 mt-1"></div>
                </div>
                
                <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 hover:text-[#FF6B35] transition-colors duration-300 tracking-tight">
                    BEHANCE
                  </h3>
                  <div className="w-full h-0.5 bg-gray-200 group-hover:bg-[#FF6B35] group-hover:h-1 transition-all duration-300 mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
