'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/dither';
import { site } from '@/data/home';
import ModeToggle, { getMode } from './ModeToggle';
import LogoMark from './LogoMark';

const GLYPHS = '!<>-_\\/[]{}=+*^?#%&@$01';

/** Text that flickers through ASCII glyphs and locks in left to right while `active`. */
function useScramble(full: string, active: boolean) {
  const [text, setText] = useState(full);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (!active || prefersReducedMotion() || getMode() === 'simple') { setText(full); return; }
    let f = 0;
    timer.current = setInterval(() => {
      f++;
      const lock = Math.floor(f / 1.5);
      let out = '';
      for (let i = 0; i < full.length; i++) {
        const ch = full[i];
        out += ch === ' ' || i < lock ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setText(out);
      if (lock >= full.length && timer.current) { clearInterval(timer.current); setText(full); }
    }, 32);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [active, full]);

  return text;
}

/**
 * Scrambled text that never changes the layout: the real text stays in place (invisible) to hold
 * the width, and the scramble is drawn over it. Glyphs in proportional fonts differ in width,
 * so without this the whole header shifts while it scrambles.
 */
function ScrambleText({ full, text, className = '' }: { full: string; text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block whitespace-pre ${className}`}>
      <span className="invisible">{full}</span>
      <span className="absolute left-0 top-0">{text}</span>
    </span>
  );
}

function NavLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const [on, setOn] = useState(false);
  const text = useScramble(label, on);
  const props = {
    'aria-label': label,
    onPointerEnter: () => setOn(true),
    onPointerLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false),
    className: 'flex gap-1 whitespace-pre px-2 py-2.5 transition-colors',
    style: { background: on ? 'var(--acc)' : 'transparent' },
  };
  const inner = (
    <>
      <span aria-hidden="true" style={{ color: on ? 'var(--ink)' : 'transparent' }}>[</span>
      <ScrambleText full={label} text={text} />
      <span aria-hidden="true" style={{ color: on ? 'var(--ink)' : 'transparent' }}>]</span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" {...props}>{inner}</a>
  ) : (
    <Link href={href} {...props}>{inner}</Link>
  );
}

export default function SiteHeader({ page = 'home' }: { page?: 'home' | 'project' }) {
  const base = page === 'home' ? '' : '/';
  const [logoOn, setLogoOn] = useState(false);
  const [hireOn, setHireOn] = useState(false);
  const logo = useScramble('aditya.mondal', logoOn);
  const hire = useScramble('Hire me', hireOn);

  const links = [
    { label: '01 Experience', href: `${base}#experience` },
    { label: '02 Projects', href: `${base}#projects` },
    { label: '03 Wins', href: `${base}#wins` },
    { label: '04 Stack', href: `${base}#stack` },
    { label: '05 Contact', href: `${base}#contact` },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-6 md:h-20 md:px-10">
        <Link
          href={page === 'home' ? '#top' : '/'}
          aria-label="Aditya Mondal, home"
          onPointerEnter={() => setLogoOn(true)}
          onPointerLeave={() => setLogoOn(false)}
          className="flex min-h-11 min-w-0 items-center gap-2 sm:gap-3"
        >
          <LogoMark size={32} className="h-7 w-7 sm:h-8 sm:w-8" />
          <ScrambleText full="aditya.mondal" text={logo} className="font-pixel text-lg leading-none sm:text-xl md:text-2xl" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-0.5 font-mono text-xs uppercase tracking-[0.08em] lg:flex">
          {links.map((l) => <NavLink key={l.label} {...l} />)}
          {/* GitHub is also in the hero + contact; hidden on small laptops so all six nav items fit */}
          <span className="hidden xl:contents"><NavLink label="GitHub ↗" href={site.github} external /></span>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ModeToggle from="dither" />
        <Link
          href="#contact"
          aria-label="Hire me"
          onPointerEnter={() => setHireOn(true)}
          onPointerLeave={() => setHireOn(false)}
          className="flex h-11 items-center gap-2.5 bg-ink px-3 text-[15px] font-medium text-paper transition-[transform,box-shadow] duration-150 sm:px-5"
          style={{ transform: hireOn ? 'translate(-3px,-3px)' : 'none', boxShadow: hireOn ? '3px 3px 0 var(--acc)' : 'none' }}
        >
          <span aria-hidden="true" className="hidden h-2 w-2 bg-acc sm:block" />
          <ScrambleText full="Hire me" text={hire} className="font-mono" />
        </Link>
        </div>
      </div>
    </header>
  );
}
