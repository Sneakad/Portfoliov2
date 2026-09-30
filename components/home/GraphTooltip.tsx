'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Hover tooltip for the contribution graph. One listener on the grid (cells stay server-rendered and
 * carry `data-n` = count, `data-d` = date label), so it costs nothing per cell. Sits above the hovered
 * cell and is clamped to the graph's edges.
 */
export default function GraphTooltip({ children, variant = 'dither' }: { children: React.ReactNode; variant?: 'dither' | 'simple' }) {
  const box = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<null | { x: number; y: number; n: number; d: string }>(null);
  const [left, setLeft] = useState(0);

  // clamp using the bubble's real width (it varies with the date text), before the browser paints
  useLayoutEffect(() => {
    if (!tip || !bubble.current || !box.current) return;
    const half = bubble.current.offsetWidth / 2, W = box.current.offsetWidth;
    setLeft(Math.min(Math.max(tip.x, half), W - half));
  }, [tip]);

  const over = (e: React.PointerEvent) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-d]');
    const wrap = box.current;
    if (!cell || !wrap) return;
    const c = cell.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    setTip({ x: c.left + c.width / 2 - w.left, y: c.top - w.top, n: Number(cell.dataset.n), d: cell.dataset.d! });
  };

  const dither = variant === 'dither';
  return (
    <div ref={box} className="relative" onPointerOver={over} onPointerLeave={() => setTip(null)}>
      {children}
      {tip && (
        <div
          ref={bubble}
          role="tooltip"
          className={`pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center whitespace-nowrap ${dither ? '' : 'drop-shadow-md'}`}
          style={{ left, top: tip.y - 8 }}
        >
          <span className={dither ? 'flex flex-col gap-0.5 bg-ink px-3 py-2 font-mono text-[11px] text-paper' : 'flex flex-col gap-0.5 rounded-lg bg-ink px-3 py-2 text-xs text-white'}>
            <span className={dither ? 'font-semibold text-acc' : 'font-semibold text-acc'}>
              {tip.n === 0 ? 'No contributions' : `${tip.n} contribution${tip.n === 1 ? '' : 's'}`}
            </span>
            <span className={dither ? 'uppercase tracking-[0.06em] text-[#B4B3AB]' : 'text-[#BBBBBB]'}>{tip.d}</span>
          </span>
          <span aria-hidden="true" className="h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-ink" style={{ transform: `translateX(${tip.x - left}px)` }} />
        </div>
      )}
    </div>
  );
}
