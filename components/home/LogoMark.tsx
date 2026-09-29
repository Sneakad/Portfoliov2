import Image from 'next/image';

/** The Dither A mark (public/icon.svg, a 32×32 pixel grid). Decorative: the parent link carries the label. */
export default function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      unoptimized
      priority
      className={`block shrink-0 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
