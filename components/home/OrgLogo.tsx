import Image from 'next/image';
import type { OrgLogoImg } from '@/data/home';

// Wordmarks sit on a badge in the colour they were made for (or the brand colour given as `bg`).
const BADGE = { dark: 'bg-ink', light: 'bg-white' } as const;

/**
 * A company's official logo (from /public/company_logos), filling a fixed-size spot so every row lines up.
 * `tile` = the square in the Experience list; `avatar` = the Simple view's circle.
 * Decorative: the company name is always shown next to it.
 */
export default function OrgLogo({ logo, variant }: { logo: OrgLogoImg; variant: 'tile' | 'avatar' }) {
  const shape = variant === 'avatar' ? 'rounded-full' : '';
  const box = `flex h-full w-full items-center justify-center overflow-hidden ${shape}`;

  if (logo.tile === 'cover') {
    return (
      <span className={box}>
        <Image src={logo.src} alt="" aria-hidden="true" width={logo.w} height={logo.h} unoptimized className="h-full w-full object-cover" />
      </span>
    );
  }
  // a wide wordmark is hard to read in a small square, so use the logo's own icon when there is one
  const mark = logo.mark;
  return (
    <span className={`${box} ${logo.bg ? '' : BADGE[logo.tile]}`} style={logo.bg ? { background: logo.bg } : undefined}>
      <Image
        src={mark ?? logo.src}
        alt=""
        aria-hidden="true"
        width={mark ? 52 : logo.w}
        height={mark ? 52 : logo.h}
        unoptimized
        className={mark ? 'h-[64%] w-[64%]' : 'h-auto w-[80%]'}
      />
    </span>
  );
}
