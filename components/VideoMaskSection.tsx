'use client';

import { useRef, useEffect } from 'react';

export default function VideoMaskSection() {
  const container = useRef(null);
  const stickyMask = useRef(null);

  const initialMaskSize = 0.8;
  const targetMaskSize = 30;
  const easing = 0.15;
  let easedScrollProgress = 0;

  useEffect(() => {
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (stickyMask.current && container.current) {
      const maskSizeProgress = targetMaskSize * getScrollProgress();
      stickyMask.current.style.webkitMaskSize = (initialMaskSize + maskSizeProgress) * 100 + "%";
    }
    requestAnimationFrame(animate);
  };

  const getScrollProgress = () => {
    if (!stickyMask.current || !container.current) return 0;
    
    const scrollProgress = stickyMask.current.offsetTop / (container.current.getBoundingClientRect().height - window.innerHeight);
    const delta = scrollProgress - easedScrollProgress;
    easedScrollProgress += delta * easing;
    return easedScrollProgress;
  };

  return (
    <main className="video-mask-main">
      <div ref={container} className="video-mask-container">
        <div ref={stickyMask} className="video-mask-sticky">
          <video autoPlay muted loop>
            <source src="/nature.mp4" type="video/mp4"/>
          </video>
        </div>
      </div>
    </main>
  );
}
