'use client';

import { useEffect, useRef } from 'react';
import { BAYER, INK, PAPER, grey, prefersReducedMotion, readAccent } from '@/lib/dither';

export type WinKind = 'trophy' | 'medal' | 'blocks';

type Draw = (o: CanvasRenderingContext2D, W: number, H: number, t: number, p: number) => void;

function sweep(o: CanvasRenderingContext2D, W: number, H: number, t: number, p: number) {
  if (p < 0.01) return;
  const sx = ((t * 0.6) % 1.6 - 0.3) * W;
  const g = o.createLinearGradient(sx - 14, 0, sx + 14, H);
  g.addColorStop(0, 'rgba(128,128,128,0)');
  g.addColorStop(0.5, `rgba(128,128,128,${0.9 * p})`);
  g.addColorStop(1, 'rgba(128,128,128,0)');
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = g;
  o.fillRect(0, 0, W, H);
  o.globalCompositeOperation = 'source-over';
}

const trophy: Draw = (o, W, H, t, p) => {
  const cx = W / 2, top = 8 + (p > 0.01 ? Math.sin(t * 3) * 1.2 * p : 0);
  const g = o.createLinearGradient(cx - 16, 0, cx + 16, 0);
  g.addColorStop(0, grey(0.12)); g.addColorStop(0.35, grey(0.55)); g.addColorStop(1, grey(0.05));
  o.fillStyle = g;
  o.beginPath();
  o.moveTo(cx - 15, top); o.lineTo(cx + 15, top);
  o.bezierCurveTo(cx + 15, top + 18, cx + 7, top + 24, cx + 2, top + 26);
  o.lineTo(cx + 2, top + 32); o.lineTo(cx - 2, top + 32); o.lineTo(cx - 2, top + 26);
  o.bezierCurveTo(cx - 7, top + 24, cx - 15, top + 18, cx - 15, top);
  o.closePath(); o.fill();
  o.strokeStyle = '#000'; o.lineWidth = 1.5;
  o.beginPath(); o.arc(cx - 15, top + 8, 5, Math.PI * 0.5, Math.PI * 1.5); o.stroke();
  o.beginPath(); o.arc(cx + 15, top + 8, 5, Math.PI * 1.5, Math.PI * 0.5); o.stroke();
  o.fillStyle = '#000'; o.fillRect(cx - 9, top + 32, 18, 4);
  o.fillStyle = grey(0.3); o.fillRect(cx - 12, top + 36, 24, 5);
  sweep(o, W, H, t, p);
};

const medal: Draw = (o, W, H, t, p) => {
  const cx = W / 2, cy = 31 + (p > 0.01 ? Math.sin(t * 3) * 1.2 * p : 0);
  o.fillStyle = grey(0.5);
  o.beginPath(); o.moveTo(cx - 10, 4); o.lineTo(cx - 3, 4); o.lineTo(cx + 2, cy - 12); o.lineTo(cx - 5, cy - 12); o.closePath(); o.fill();
  o.fillStyle = grey(0.15);
  o.beginPath(); o.moveTo(cx + 10, 4); o.lineTo(cx + 3, 4); o.lineTo(cx - 2, cy - 12); o.lineTo(cx + 5, cy - 12); o.closePath(); o.fill();
  const g = o.createRadialGradient(cx - 5, cy - 6, 1, cx, cy, 16);
  g.addColorStop(0, grey(0.6)); g.addColorStop(0.6, grey(0.3)); g.addColorStop(1, grey(0.05));
  o.fillStyle = g; o.beginPath(); o.arc(cx, cy, 15, 0, Math.PI * 2); o.fill();
  o.fillStyle = '#fff'; o.font = '800 17px sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText('2', cx, cy + 1);
  sweep(o, W, H, t, p);
};

const blocks: Draw = (o, W, H, t, p) => {
  const tt = p > 0.01 ? t : 0;
  const cube = (cx: number, cy: number, s: number, lift: number) => {
    cy -= lift;
    o.fillStyle = grey(0.55); o.beginPath(); o.moveTo(cx, cy - s); o.lineTo(cx + s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx - s, cy - s / 2); o.closePath(); o.fill();
    o.fillStyle = grey(0.3); o.beginPath(); o.moveTo(cx - s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx, cy + s); o.lineTo(cx - s, cy + s / 2); o.closePath(); o.fill();
    o.fillStyle = grey(0.05); o.beginPath(); o.moveTo(cx + s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx, cy + s); o.lineTo(cx + s, cy + s / 2); o.closePath(); o.fill();
  };
  const cx = W / 2, cy = H / 2 + 2;
  const pos: [number, number][] = [[-26, 4], [26, 4], [0, -12], [0, 18]];
  o.strokeStyle = '#000'; o.setLineDash([2, 2]);
  for (const [dx, dy] of pos) { o.beginPath(); o.moveTo(cx, cy); o.lineTo(cx + dx, cy + dy); o.stroke(); }
  o.setLineDash([]);
  pos.forEach(([dx, dy], j) => cube(cx + dx, cy + dy, 7, p > 0.01 ? Math.max(0, Math.sin(tt * 3 + j * 1.6)) * 3 * p : 0));
  cube(cx, cy, 11, p > 0.01 ? Math.sin(tt * 2) * 1.5 * p : 0);
  sweep(o, W, H, t, p);
};

const DRAW: Record<WinKind, Draw> = { trophy, medal, blocks };

/** Dithered win icon: still at rest, shines and bobs while its card is hovered. */
export default function WinIcon({ kind, active, label }: { kind: WinKind; active: boolean; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const reduced = prefersReducedMotion();
    let img: ImageData | null = null, p = 0, ct = 0, last = 0, raf = 0, drawn = false;

    const render = () => {
      const cell = 4;
      const W = Math.max(8, Math.round(cv.clientWidth / cell)), H = Math.max(8, Math.round(cv.clientHeight / cell));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (off.width !== W || off.height !== H) { off.width = W; off.height = H; }
      if (!img) img = ctx.createImageData(W, H);
      o.save();
      o.fillStyle = '#fff'; o.fillRect(0, 0, W, H);
      DRAW[kind](o, W, H, ct, p);
      o.restore();
      const src = o.getImageData(0, 0, W, H).data, d = img.data, pal = [INK, readAccent(cv), PAPER];
      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7];
        for (let x = 0; x < W; x++) {
          const j = (y * W + x) * 4;
          let q = Math.floor((src[j] / 255) * 2 + br[x & 7]);
          if (q > 2) q = 2;
          const c = pal[q];
          d[j] = c[0]; d[j + 1] = c[1]; d[j + 2] = c[2]; d[j + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const on = activeRef.current && !reduced;
      const tg = on ? 1 : 0;
      let nw = p + (tg - p) * 0.1;
      if (Math.abs(nw - tg) < 0.004) nw = tg;
      const moving = nw !== p;
      p = nw;
      if (on) ct += dt; else if (p === 0) ct = 0;
      if (!drawn || on || moving) { render(); drawn = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  return <canvas ref={ref} role="img" aria-label={label} className="block h-[220px] w-full border-b border-ink" style={{ imageRendering: 'pixelated' }} />;
}
