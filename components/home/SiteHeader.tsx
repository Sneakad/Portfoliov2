'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/dither';
import { site } from '@/data/home';

const GLYPHS = '!<>-_\\/[]{}=+*^?#%&@$01';

/** Text that flickers through ASCII glyphs and locks in left to right while `active`. */
function useScramble(full: string, active: boolean) {
  const [text, setText] = useState(full);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (!active || prefersReducedMotion()) { setText(full); return; }
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
      <span aria-hidden="true">{text}</span>
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
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 md:h-20 md:px-10">
        <Link
          href={page === 'home' ? '#top' : '/'}
          aria-label="Aditya Mondal — home"
          onPointerEnter={() => setLogoOn(true)}
          onPointerLeave={() => setLogoOn(false)}
          className="flex items-center gap-3"
        >
          <span aria-hidden="true" className="grid grid-cols-[10px_10px] grid-rows-[10px_10px]">
            <span className="bg-ink" />
            <span className="bg-acc" />
            <span className="bg-acc" />
            <span className="bg-ink" />
          </span>
          <span aria-hidden="true" className="whitespace-pre font-pixel text-xl leading-none md:text-2xl">{logo}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-0.5 font-mono text-xs uppercase tracking-[0.08em] lg:flex">
          {links.map((l) => <NavLink key={l.label} {...l} />)}
          <NavLink label="GitHub ↗" href={site.github} external />
        </nav>
        <Link
          href="#contact"
          aria-label="Hire me"
          onPointerEnter={() => setHireOn(true)}
          onPointerLeave={() => setHireOn(false)}
          className="flex h-11 items-center gap-2.5 bg-ink px-5 text-[15px] font-medium text-paper transition-[transform,box-shadow] duration-150"
          style={{ transform: hireOn ? 'translate(-3px,-3px)' : 'none', boxShadow: hireOn ? '3px 3px 0 var(--acc)' : 'none' }}
        >
          <span aria-hidden="true" className="h-2 w-2 bg-acc" />
          <span aria-hidden="true" className="whitespace-pre font-mono">{hire}</span>
        </Link>
      </div>
    </header>
  );
}
