'use client';

import { useEffect, useRef, useState } from 'react';
import { BAYER, INK, PAPER, observeVisible, prefersReducedMotion, readAccent } from '@/lib/dither';
import type { TimelineSegment } from '@/data/home';

// Dither density per role ramps from sparse (oldest) to dense (newest); the last segment is the open "Next" slot.
const level = (i: number, roles: number) => 0.22 + (0.64 * i) / Math.max(1, roles - 1);

/**
 * signal.log — one clean dithered block per role on a dark strip, denser = more recent.
 * Hover (or tap) a block to flood it with the accent colour and read the role below.
 */
export default function SignalStrip({ segments, start = 2022, end = 2027 }: { segments: TimelineSegment[]; start?: number; end?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hovRef = useRef(-1);
  const [seg, setSeg] = useState(-1);
  const span = end - start;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    let img: ImageData | null = null, raf = 0, visible = false, lastKey = '';
    const t0 = performance.now();
    const stopObs = observeVisible(cv, (v) => (visible = v));
    const ACC = readAccent(cv);
    const cell = 4;
    let cssW = cv.clientWidth, cssH = cv.clientHeight;
    const ro = new ResizeObserver(([en]) => { cssW = en.contentRect.width; cssH = en.contentRect.height; });
    ro.observe(cv);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = reduced ? 0 : (now - t0) / 1000;
      const W = Math.max(8, Math.round(cssW / cell)), H = Math.max(8, Math.round(cssH / cell));
      // the strip only changes 6×/s (marching outline) or on hover, so skip identical frames
      const key = `${W}x${H}:${Math.floor(t * 6)}:${hovRef.current}`;
      if (key === lastKey) return;
      lastKey = key;
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (!img) img = ctx.createImageData(W, H);
      const d = img.data, hov = hovRef.current, last = segments.length - 1;
      const starts = segments.map((g) => Math.round(((g.from - start) / span) * W));
      const blink = Math.floor(t * 2) % 2 === 0;
      for (let x = 0; x < W; x++) {
        let i = 0;
        for (let k = 0; k < starts.length; k++) if (x >= starts[k]) i = k;
        const x0 = starts[i], x1 = i + 1 < starts.length ? starts[i + 1] : W, gap = i > 0 && x < x0 + 2;
        for (let y = 0; y < H; y++) {
          let c = INK;
          if (gap) c = INK;
          else if (i === last) {
            // open slot: marching dashed outline + blinking cursor
            const edge = y === 0 || y === H - 1 || x === x0 + 2 || x === W - 1;
            if (edge) c = (x + y + Math.floor(t * 6)) % 4 < 2 ? ACC : INK;
            else if (i === hov) c = (x + y) % 2 === 0 ? ACC : INK;
            else if (blink && x >= x0 + 5 && x <= x0 + 7 && y >= 4 && y <= H - 5) c = ACC;
          } else if (i === hov) c = ACC;
          else {
            const f = (x - x0) / Math.max(1, x1 - x0), L = level(i, last) + 0.08 * (f - 0.5);
            c = L > BAYER[y & 7][x & 7] ? PAPER : INK;
          }
          const j = (y * W + x) * 4;
          d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopObs(); ro.disconnect(); };
  }, [segments, start, span]);

  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const yr = start + Math.max(0, Math.min(0.9999, (e.clientX - r.left) / r.width)) * span;
    let idx = 0;
    segments.forEach((s, i) => { if (yr >= s.from) idx = i; });
    hovRef.current = idx;
    if (idx !== seg) setSeg(idx);
  };
  const clear = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return; // keep the tapped role visible on phones
    hovRef.current = -1;
    setSeg(-1);
  };

  const years = Array.from({ length: span }, (_, i) => start + i);
  const last = segments.length - 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3.5 border border-ink bg-ink px-4 pb-4 pt-5 text-paper md:px-6">
        <div className="flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B4B3AB]">
          <span>signal.log — each block is a role</span>
          <span className="hidden sm:inline">Hover a block</span>
        </div>
        <div onPointerMove={pick} onPointerDown={pick} onPointerLeave={clear} className="cursor-pointer touch-manipulation">
          <canvas
            ref={ref}
            role="img"
            aria-label={`Timeline from ${start}: ${last} blocks, one per role, each denser than the last, ending in an open slot marked Next.`}
            className="block h-16 w-full"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="relative hidden h-10 font-mono text-xs md:block">
          {segments.map((s, i) => {
            const on = i === seg, low = i % 2 === 1;
            return (
              <span
                key={s.label}
                className="absolute whitespace-nowrap border-l pl-1.5 leading-[18px]"
                style={{
                  left: `${((s.from - start) / span) * 100}%`,
                  top: low ? 20 : 0,
                  height: low ? 20 : 40,
                  borderColor: on ? 'var(--acc)' : '#3A3934',
                  color: on || i === last ? 'var(--acc)' : 'var(--paper)',
                }}
              >
                {s.label}
              </span>
            );
          })}
        </div>
        <div className="grid border-t border-[#3A3934] pt-2 font-mono text-[11px] text-[#8A8980]" style={{ gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))` }}>
          {years.map((y) => <span key={y}>{y}</span>)}
        </div>
      </div>
      <div className="flex min-h-[22px] items-center gap-2.5 font-mono text-[13px]" aria-live="polite">
        <span className="h-2 w-2 shrink-0 bg-ink" />
        <span className="px-1.5 py-0.5" style={{ background: seg >= 0 ? 'var(--acc)' : 'transparent' }}>
          {seg >= 0 ? segments[seg].readout : 'Hover a block to see the role'}
        </span>
      </div>
    </div>
  );
}
