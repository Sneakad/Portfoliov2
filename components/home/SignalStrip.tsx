'use client';

import { useEffect, useRef, useState } from 'react';
import { BAYER, INK, PAPER, observeVisible, prefersReducedMotion, readAccent } from '@/lib/dither';
import type { TimelineSegment } from '@/data/home';

/**
 * signal.log — a dithered timeline whose density grows with every year shipped.
 * Thin gaps mark each role; hovering a role floods it with the accent colour and shows it below.
 */
export default function SignalStrip({ segments, start = 2021, end = 2027 }: { segments: TimelineSegment[]; start?: number; end?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hover = useRef({ on: false, x: 0, seg: -1 });
  const [seg, setSeg] = useState(-1);
  const span = end - start;
  const nextStart = segments[segments.length - 1]?.from ?? end - 0.5;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    let img: ImageData | null = null, raf = 0, visible = true;
    const t0 = performance.now();
    const stopObs = observeVisible(cv, (v) => (visible = v));
    const bounds = segments.slice(1).map((s) => s.from);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = reduced ? 1 : (now - t0) / 1000;
      const cell = 4;
      const W = Math.max(8, Math.round(cv.clientWidth / cell)), H = Math.max(8, Math.round(cv.clientHeight / cell));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (!img) img = ctx.createImageData(W, H);
      // dark strip: empty years stay ink, shipped density glows paper
      const d = img.data, pal = [PAPER, readAccent(cv), INK];
      const h = hover.current, active = h.on ? segments[h.seg] : null;
      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7], yn = y / H;
        for (let x = 0; x < W; x++) {
          const xn = x / W, yr = start + xn * span;
          let v: number;
          if (yr >= nextStart) {
            const bx = (yr - nextStart) / (end - nextStart);
            const edge = y === 0 || y === H - 1 || bx < 0.03 || bx > 0.985;
            if (edge) v = Math.floor((x + y) / 2 + t * 4) % 2 === 0 ? 0 : 1;
            else if (bx > 0.1 && bx < 0.16 && yn > 0.3 && yn < 0.7 && Math.floor(t * 2) % 2 === 0) v = 0;
            else v = active && active.from === nextStart ? 0.5 : 1;
          } else {
            const pn = (yr - start) / (nextStart - start);
            const base = 1 - 0.97 * Math.pow(pn, 1.15);
            const wave = (0.09 * Math.sin(pn * 46 - t * 1.4 + yn * 5) + 0.05 * Math.sin(pn * 13 + t * 0.6 - yn * 9)) * (0.3 + pn);
            v = base + wave;
            for (const b of bounds) if (Math.abs(yr - b) < 0.012 * (span / 6)) v = 1;
            if (active && yr >= active.from && yr < active.to && v < 1) v = 0.5 + (v - 0.5) * 0.25;
          }
          if (h.on && Math.abs(xn - h.x) < 0.0016) v = 0;
          v = v < 0 ? 0 : v > 1 ? 1 : v;
          let q = Math.floor(v * 2 + br[x & 7]);
          if (q > 2) q = 2;
          const c = pal[q], i = (y * W + x) * 4;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopObs(); };
  }, [segments, start, end, span, nextStart]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const xn = Math.max(0, Math.min(0.9999, (e.clientX - r.left) / r.width));
    const yr = start + xn * span;
    let idx = 0;
    segments.forEach((s, i) => { if (yr >= s.from && yr < s.to) idx = i; });
    hover.current = { on: true, x: xn, seg: idx };
    if (idx !== seg) setSeg(idx);
  };
  const onLeave = () => { hover.current = { on: false, x: 0, seg: -1 }; setSeg(-1); };

  const years = Array.from({ length: span }, (_, i) => start + i);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-4 font-mono text-[11px] tracking-[0.06em]">
        {segments.map((s) => (
          <span
            key={s.label}
            className="absolute -translate-x-1/2"
            style={{ left: `${(((s.from + s.to) / 2 - start) / span) * 100}%`, background: s.label === 'Next' ? 'var(--acc)' : undefined, padding: s.label === 'Next' ? '0 5px' : undefined }}
          >
            {s.label}
          </span>
        ))}
      </div>
      <div className="border border-ink">
        <div className="flex h-7 items-center justify-between border-b border-[#3A3934] bg-ink px-3 font-mono text-[11px] tracking-[0.06em] text-paper">
          <span>signal.log — density grows with every year shipped</span>
          <span>{start} ▸ next</span>
        </div>
        <div onPointerMove={onMove} onPointerLeave={onLeave} className="cursor-ew-resize bg-ink">
          <canvas
            ref={ref}
            role="img"
            aria-label="Dithered timeline that gets denser with every year and role, ending in an open slot marked Next."
            className="block h-[120px] w-full"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
      <div className="grid font-mono text-xs text-muted-ink" style={{ gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))` }}>
        {years.map((y) => <span key={y}>{y}</span>)}
      </div>
      <div className="flex min-h-[22px] items-center gap-2.5 font-mono text-[13px]">
        <span className="h-2 w-2 bg-ink" />
        <span className="px-1.5 py-0.5" style={{ background: seg >= 0 ? 'var(--acc)' : 'transparent' }}>
          {seg >= 0 ? segments[seg].readout : 'Hover the timeline to see each role'}
        </span>
      </div>
    </div>
  );
}
