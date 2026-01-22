'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

const Logo = () => {
  return (
    <motion.div
      className="fixed top-8 left-8 z-[100000] cursor-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    >
      <a 
        href="#" 
        className="block"
      >
        <Image 
          src="/adi-logo.svg" 
          alt="Adi Logo" 
          width={120} 
          height={40}
          className="w-auto h-10 md:h-12 object-contain"
          priority
        />
      </a>
    </motion.div>
  );
};

export default Logo;
