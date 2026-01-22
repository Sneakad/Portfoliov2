import React from 'react'

export default function Footer() {
  return (
    <div 
      className='relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]'
      style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
      <div className='fixed bottom-0 h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full'>
        <div className='bg-[#FF6B35] py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-6 lg:py-12 lg:px-12 h-full w-full flex flex-col justify-between relative overflow-hidden'>
          {/* Background geometric shapes */}
          <div className='absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-black/10 transform rotate-45 translate-x-12 -translate-y-12 sm:translate-x-16 sm:-translate-y-16 md:translate-x-32 md:-translate-y-32 lg:translate-x-48 lg:-translate-y-48'></div>
          <div className='absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-black/5 transform -rotate-12 -translate-x-8 translate-y-8 sm:-translate-x-12 sm:translate-y-12 md:-translate-x-24 md:translate-y-24 lg:-translate-x-32 lg:translate-y-32'></div>
          
          {/* <HeaderSection /> */}
          <NavigationSection />
          <LargeTextSection />
          <FooterSection />
        </div>
      </div>
    </div>
  )
}

const HeaderSection = () => {
    return (
        <div className='flex justify-between items-start mb-16'>
            <div>
                <h1 className='text-black text-4xl font-bold mb-2'>ADITYA</h1>
                <p className='text-black text-xl'>PORTFOLIO</p>
            </div>
            <div className='bg-black rounded-full p-4'>
                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                </svg>
            </div>
        </div>
    )
}

const NavigationSection = () => {
    return (
        <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-16 mb-8 sm:mb-12 md:mb-16 lg:mb-20 relative z-10'>
            <div>
                <h3 className='text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6'>NAVIGATION</h3>
                <div className='flex flex-col gap-1.5 sm:gap-2 md:gap-3'>
                    <a href="#hero-section" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>HOME</a>
                    <a href="#projects" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>PROJECTS</a>
                    <a href="#experience" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>EXPERIENCE</a>
                    <a href="#skills" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>SKILLS</a>
                    <a href="#achievements" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>ACHIEVEMENTS</a>
                    <a href="#contact" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>CONTACT</a>
                </div>
            </div>
            <div>
                <h3 className='text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6'>GET IN TOUCH</h3>
                <div className='flex flex-col gap-1.5 sm:gap-2 md:gap-3'>
                    <a href="https://www.linkedin.com/in/aditya-mondal2/" target="_blank" rel="noopener noreferrer" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>LINKEDIN</a>
                    <a href="https://discord.com/users/sneakad" target="_blank" rel="noopener noreferrer" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>DISCORD</a>
                    <a href="https://twitter.com/sneakad4" target="_blank" rel="noopener noreferrer" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>X</a>
                    <a href="https://github.com/Sneakad" target="_blank" rel="noopener noreferrer" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>GITHUB</a>
                    <a href="https://www.behance.net/adityamondal2" target="_blank" rel="noopener noreferrer" className='text-black text-xs sm:text-sm md:text-sm hover:underline cursor-pointer transition-all duration-200 hover:translate-x-1'>BEHANCE</a>
                </div>
            </div>  
        </div>
    )
}

const LargeTextSection = () => {
    return (
        <div className='mb-3 sm:mb-4 md:mb-6 lg:mb-8'>
            <h1 className='text-[22vw] xs:text-[22vw] sm:text-[22vw] md:text-[18vw] lg:text-[20vw] leading-[0.75] sm:leading-[0.8] font-bold text-black/80 select-none tracking-[0.05em] xs:tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] uppercase'>
                aditya
            </h1>
        </div>
    )
}

const FooterSection = () => {
    return (
        <div className='border-t border-black/20 pt-2 sm:pt-3 md:pt-4 lg:pt-6 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-3 sm:gap-4'>
            <div className='flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 sm:gap-8'>
                <p className='text-black text-xs sm:text-sm font-medium'>©2026 ADITYA</p>
            </div>
        </div>
    )
}
