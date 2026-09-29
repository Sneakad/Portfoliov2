'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BAYER, INK, prefersReducedMotion, rand, readAccent } from '@/lib/dither';
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
 * Simple → Dither: full-screen ASCII wipe. Glyphs sweep across left → right, the mode flips
 * while the screen is covered, then the glyphs sweep off to reveal the dithered site.
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
      const inP = Math.min(1, t / IN), outP = Math.max(0, Math.min(1, (t - IN - HOLD) / OUT));
      const ease = (x: number) => 1 - Math.pow(1 - x, 3);
      const front = ease(inP) * 1.25, back = ease(outP) * 1.25;
      for (let r = 0; r < rows; r++) {
        const fr = front - jitter[r], br = back - jitter[r];
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          if (u > fr || u < br - 0.25) continue;
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

/**
 * Dither → Simple: a calm white circle grows out of the button, the mode flips under it,
 * then it fades away to reveal the simple site.
 */
function SoftReveal({ x, y, onCovered, onDone }: { x: number; y: number; onCovered: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<'start' | 'grow' | 'fade'>('start');
  const cb = useRef({ onCovered, onDone });
  cb.current = { onCovered, onDone };

  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('grow')));
    const t1 = setTimeout(() => { cb.current.onCovered(); setPhase('fade'); }, 520);
    const t2 = setTimeout(() => cb.current.onDone(), 520 + 380);
    return () => { cancelAnimationFrame(r); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[100] bg-white"
      style={{
        clipPath: `circle(${phase === 'start' ? '0px' : '150vmax'} at ${x}px ${y}px)`,
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'clip-path 520ms cubic-bezier(.65,0,.35,1), opacity 380ms ease',
      }}
    />
  );
}


// The button body is drawn as dither pixels; this much canvas spills past the button so pixels can scatter out.
const BLEED = 10;

/**
 * The whole button as pixels: a solid ink block at rest. On hover it breaks up into flickering
 * ink/accent dither, its edges erode, pixels spill past the outline and rows tear sideways.
 */
function DitherBody({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const on = useRef(active);
  on.current = active;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const pal = [INK, readAccent(cv), INK];
    const cell = 2, pad = BLEED / cell;
    let raf = 0, k = 0, img: ImageData | null = null, lastStep = -1, rest = false;
    let cssW = cv.clientWidth, cssH = cv.clientHeight;
    const ro = new ResizeObserver(([en]) => { cssW = en.contentRect.width; cssH = en.contentRect.height; rest = false; });
    ro.observe(cv);
    const t0 = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      k += ((on.current ? 1 : 0) - k) * (on.current ? 0.2 : 0.14);
      if (!on.current && k < 0.02) k = 0;
      if (k === 0 && rest) return; // solid and already drawn
      const t = (now - t0) / 1000, step = Math.floor(t * 24); // flicker at ~24fps, not the display rate
      if (k > 0 && step === lastStep) return;
      lastStep = step;

      const W = Math.max(4, Math.round(cssW / cell)), H = Math.max(4, Math.round(cssH / cell));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (!img) img = ctx.createImageData(W, H);
      const d = img.data, x0 = pad, x1 = W - pad, y0 = pad, y1 = H - pad;
      // two torn rows slide sideways, and now and then the whole body jolts
      const tearA = y0 + ((rand(step, 1, 3) * (y1 - y0)) | 0), tearB = y0 + ((rand(step, 2, 5) * (y1 - y0)) | 0);
      const shA = ((rand(step, 3, 7) - 0.5) * 12 * k) | 0, shB = ((rand(step, 4, 9) - 0.5) * 8 * k) | 0;
      const jolt = rand(step, 5, 11) < 0.15 * k ? ((rand(step, 6, 13) - 0.5) * 4) | 0 : 0;

      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7];
        const off = jolt + (Math.abs(y - tearA) < 1.5 ? shA : 0) + (y === tearB ? shB : 0);
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4, sx = x - off;
          // distance outside the button rectangle, in cells (0 inside)
          const ox = sx < x0 ? x0 - sx : sx >= x1 ? sx - x1 + 1 : 0, oy = y < y0 ? y0 - y : y >= y1 ? y - y1 + 1 : 0;
          const out = Math.max(ox, oy);
          let v: number;
          if (out === 0) {
            // inside: the middle stays solid ink so the label is always readable; only a
            // 3-cell band at the edges crumbles into holes and accent pixels
            const edge = Math.min(sx - x0, x1 - 1 - sx, y - y0, y1 - 1 - y);
            v = 1;
            if (edge < 3) {
              const r = rand(sx, y, step + 7);
              if (r < k * (0.5 - edge * 0.15)) v = r < k * (0.25 - edge * 0.07) ? 0 : 0.5;
            }
          } else {
            // outside: stray pixels thrown off the body, thinning with distance
            v = rand(sx, y, step + 19) < k * 0.5 * (1 - out / pad) ** 2 ? 0.5 + rand(y, sx, step) * 0.5 : 0;
          }
          let q = v <= 0 ? 0 : Math.floor(v * 2 + br[((sx % 8) + 8) & 7]);
          if (q > 2) q = 2;
          if (q === 0) { d[i + 3] = 0; continue; }
          const c = pal[q];
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      rest = k === 0;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ inset: -BLEED, width: `calc(100% + ${BLEED * 2}px)`, height: `calc(100% + ${BLEED * 2}px)`, imageRendering: 'pixelated' }}
    />
  );
}

/**
 * Navbar switch between the dithered site and the Simple view. Each header renders its own,
 * so `from` is the view it sits in.
 * - In the dithered header it's a plain nav button (accent fill on hover, like the other links).
 * - In the Simple header it's a small ink block whose edges crumble into dither on hover;
 *   the middle stays solid so the label is always readable.
 */
export default function ModeToggle({ from }: { from: SiteMode }) {
  const [hover, setHover] = useState(false);
  const [wipe, setWipe] = useState<null | { to: SiteMode; x: number; y: number }>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const simple = from === 'simple';
  const next: SiteMode = simple ? 'dither' : 'simple';
  const crumbling = simple && hover && !wipe && !prefersReducedMotion();

  const toggle = () => {
    if (wipe) return;
    setHover(false);
    if (prefersReducedMotion()) { applyMode(next); return; }
    const r = btn.current?.getBoundingClientRect();
    setWipe({ to: next, x: r ? r.left + r.width / 2 : window.innerWidth, y: r ? r.top + r.height / 2 : window.innerHeight });
  };

  const hoverProps = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  };

  return (
    <>
      {simple ? (
        <button
          ref={btn}
          type="button"
          onClick={toggle}
          {...hoverProps}
          aria-label="Switch to the dithered version of the site"
          className="relative flex h-9 items-center px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-paper outline-none focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-acc"
        >
          <DitherBody active={crumbling} />
          <span aria-hidden="true" className="relative whitespace-pre">Dither view</span>
        </button>
      ) : (
        <button
          ref={btn}
          type="button"
          onClick={toggle}
          aria-label="Switch to the simple, easy-to-read version of the site"
          // same lift as "Hire me" next to it: 3px up-left, 3px hard shadow
          className="flex h-11 items-center border border-ink bg-paper px-2.5 font-mono text-xs sm:px-3 uppercase tracking-[0.06em] transition-[transform,box-shadow] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:bg-acc hover:shadow-[3px_3px_0_var(--ink)]"
        >
          <span aria-hidden="true" className="hidden sm:inline">Simple view</span>
          <span aria-hidden="true" className="sm:hidden">Simple</span>
        </button>
      )}
      {wipe &&
        createPortal(
          wipe.to === 'dither' ? (
            <AsciiWipe onCovered={() => applyMode('dither')} onDone={() => setWipe(null)} />
          ) : (
            <SoftReveal x={wipe.x} y={wipe.y} onCovered={() => applyMode('simple')} onDone={() => setWipe(null)} />
          ),
          document.body,
        )}
    </>
  );
}
