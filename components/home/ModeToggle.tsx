'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { prefersReducedMotion } from '@/lib/dither';
import { MODE_KEY as KEY } from '@/lib/mode';

export type SiteMode = 'dither' | 'simple';
const RAMP = ' .:-=+*#%@';
const GLYPHS = '01<>{}[]/\\=+*#%&@$?!;:';

export const getMode = (): SiteMode =>
  typeof document !== 'undefined' && document.documentElement.dataset.mode === 'simple' ? 'simple' : 'dither';

function applyMode(m: SiteMode) {
  const root = document.documentElement;
  if (m === 'simple') root.dataset.mode = 'simple';
  else delete root.dataset.mode;
  try { localStorage.setItem(KEY, m); } catch { /* storage blocked: mode just won't persist */ }
  window.dispatchEvent(new CustomEvent('site-mode', { detail: m }));
}

/**
 * Full-screen ASCII wipe: glyphs sweep across the screen left → right, the mode flips
 * while the screen is covered, then the glyphs sweep off to reveal the other version.
 */
function AsciiWipe({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ onCovered, onDone });
  cb.current = { onCovered, onDone };

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue('--ink').trim() || '#111110';
    const paper = cs.getPropertyValue('--paper').trim() || '#F1F0EA';
    const acc = cs.getPropertyValue('--acc').trim() || '#C5FA6E';
    const mono = cs.getPropertyValue('--font-geist-mono').trim() || 'monospace';
    const cw = 12, ch = 18, cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    const jitter = Array.from({ length: rows }, () => Math.random() * 0.12);
    const IN = 480, HOLD = 120, OUT = 520;
    let covered = false, raf = 0;
    const t0 = performance.now();
    ctx.font = `600 14px ${mono}`;
    ctx.textBaseline = 'top';

    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);
      // front edge position (0..1 across the screen, +0.25 so the ragged edge fully clears)
      const inP = Math.min(1, t / IN), outP = Math.max(0, Math.min(1, (t - IN - HOLD) / OUT));
      const ease = (x: number) => 1 - Math.pow(1 - x, 3);
      const front = ease(inP) * 1.25, back = ease(outP) * 1.25;
      for (let r = 0; r < rows; r++) {
        const fr = front - jitter[r], br = back - jitter[r];
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          if (u > fr || u < br - 0.25) continue;
          // density ramps up behind the incoming edge and down ahead of the outgoing one
          const dIn = Math.min(1, (fr - u) / 0.25), dOut = Math.min(1, (u - (br - 0.25)) / 0.25);
          const dens = Math.min(dIn, dOut);
          ctx.fillStyle = ink;
          ctx.globalAlpha = Math.min(1, dens * 1.4);
          ctx.fillRect(c * cw, r * ch, cw, ch);
          ctx.globalAlpha = 1;
          const edge = dens < 0.35;
          const ch0 = edge ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : RAMP[Math.min(RAMP.length - 1, (dens * (RAMP.length - 1) * (0.6 + Math.random() * 0.4)) | 0)];
          if (ch0 === ' ') continue;
          ctx.fillStyle = edge ? acc : paper;
          ctx.fillText(ch0, c * cw + 1, r * ch + 2);
        }
      }
      if (!covered && t >= IN) { covered = true; cb.current.onCovered(); }
      if (t < IN + HOLD + OUT + 60) raf = requestAnimationFrame(frame);
      else cb.current.onDone();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[100] h-screen w-screen" />;
}

/** Header switch between the dithered site and a plain, easy-to-read version. */
export default function ModeToggle() {
  const [mode, setMode] = useState<SiteMode>('dither');
  const [wiping, setWiping] = useState<SiteMode | null>(null);

  useEffect(() => {
    setMode(getMode());
    const on = (e: Event) => setMode((e as CustomEvent<SiteMode>).detail);
    window.addEventListener('site-mode', on);
    return () => window.removeEventListener('site-mode', on);
  }, []);

  const next: SiteMode = mode === 'simple' ? 'dither' : 'simple';
  const toggle = () => {
    if (wiping) return;
    if (prefersReducedMotion()) { applyMode(next); return; }
    setWiping(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={mode === 'simple'}
        title={mode === 'simple' ? 'Switch back to the dithered version' : 'Switch to a simple, easy-to-read version'}
        className="flex h-11 items-center gap-2 border border-ink px-3 font-mono text-xs uppercase tracking-[0.06em] transition-colors hover:bg-acc"
      >
        <span aria-hidden="true" className="grid grid-cols-2 gap-px">
          <span className={`h-1.5 w-1.5 ${mode === 'simple' ? 'bg-ink' : 'bg-acc outline outline-1 outline-ink'}`} />
          <span className="h-1.5 w-1.5 bg-ink" />
          <span className="h-1.5 w-1.5 bg-ink" />
          <span className={`h-1.5 w-1.5 ${mode === 'simple' ? 'bg-ink' : 'bg-acc outline outline-1 outline-ink'}`} />
        </span>
        <span className="hidden sm:inline">{mode === 'simple' ? 'Dither view' : 'Simple view'}</span>
        <span className="sm:hidden">{mode === 'simple' ? 'Dither' : 'Simple'}</span>
      </button>
      {wiping &&
        createPortal(
          <AsciiWipe onCovered={() => applyMode(wiping)} onDone={() => setWiping(null)} />,
          document.body,
        )}
    </>
  );
}
