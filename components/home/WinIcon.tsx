'use client';

import { useEffect, useRef } from 'react';
import { BAYER, INK, PAPER, grey, prefersReducedMotion, readAccent } from '@/lib/dither';

export type WinKind = 'trophy' | 'medal' | 'blocks';

type Draw = (o: CanvasRenderingContext2D, W: number, H: number, t: number, p: number) => void;

// Still at rest; on hover each icon does its own thing (no glare sweep).
const trophy: Draw = (o, W, H, t, p) => {
  const cx = W / 2, on = p > 0.01;
  const hop = on ? Math.abs(Math.sin(t * 4)) * 7 * p : 0, tilt = on ? Math.sin(t * 4) * 0.14 * p : 0;
  const top = 14 - hop;
  if (on) {
    // confetti bursting out of the cup
    for (let i = 0; i < 12; i++) {
      const ph = (t * 0.85 + i * 0.083) % 1, dir = (i % 2 ? 1 : -1) * (0.5 + (i % 5) * 0.35);
      o.globalAlpha = p;
      o.fillStyle = i % 3 === 0 ? '#000' : grey(0.5);
      o.fillRect(Math.round(cx + dir * ph * 16), Math.round(top + 2 - ph * 20 + ph * ph * 26), 2, 2);
      o.globalAlpha = 1;
    }
  }
  o.fillStyle = grey(0.3); o.fillRect(cx - 12 + hop, 51, 24 - hop * 2, 3);
  o.save(); o.translate(cx, top + 30); o.rotate(tilt); o.translate(-cx, -(top + 30));
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
  o.restore();
};

const medal: Draw = (o, W, H, t, p) => {
  const cx = W / 2, on = p > 0.01, cy = 33;
  const ang = on ? Math.sin(t * 3.2) * 0.38 * p : 0;
  o.save(); o.translate(cx, 2); o.rotate(ang); o.translate(-cx, -2);
  o.fillStyle = grey(0.5);
  o.beginPath(); o.moveTo(cx - 10, 2); o.lineTo(cx - 3, 2); o.lineTo(cx + 2, cy - 12); o.lineTo(cx - 5, cy - 12); o.closePath(); o.fill();
  o.fillStyle = grey(0.15);
  o.beginPath(); o.moveTo(cx + 10, 2); o.lineTo(cx + 3, 2); o.lineTo(cx - 2, cy - 12); o.lineTo(cx + 5, cy - 12); o.closePath(); o.fill();
  const g = o.createRadialGradient(cx - 5, cy - 6, 1, cx, cy, 16);
  g.addColorStop(0, grey(0.6)); g.addColorStop(0.6, grey(0.3)); g.addColorStop(1, grey(0.05));
  o.fillStyle = g; o.beginPath(); o.arc(cx, cy, 15, 0, Math.PI * 2); o.fill();
  o.fillStyle = '#fff'; o.font = '800 17px sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText('2', cx, cy + 1);
  o.restore();
  if (on) {
    // twinkles around the medal
    const sp: [number, number][] = [[-26, 20], [24, 14], [-20, 44], [27, 40], [0, 52]];
    sp.forEach(([dx, y], i) => {
      const tw = Math.sin(t * 5 + i * 1.9);
      if (tw < 0.2) return;
      const r = Math.round(1 + tw * 2), x = cx + dx;
      o.fillStyle = i % 2 ? '#000' : grey(0.5);
      o.fillRect(x - r, y, r * 2 + 1, 1); o.fillRect(x, y - r, 1, r * 2 + 1);
    });
  }
};

const blocks: Draw = (o, W, H, t, p) => {
  const on = p > 0.01, tt = on ? t : 0;
  const cube = (cx: number, cy: number, s: number, lift: number) => {
    cy -= lift;
    o.fillStyle = grey(0.55); o.beginPath(); o.moveTo(cx, cy - s); o.lineTo(cx + s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx - s, cy - s / 2); o.closePath(); o.fill();
    o.fillStyle = grey(0.3); o.beginPath(); o.moveTo(cx - s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx, cy + s); o.lineTo(cx - s, cy + s / 2); o.closePath(); o.fill();
    o.fillStyle = grey(0.05); o.beginPath(); o.moveTo(cx + s, cy - s / 2); o.lineTo(cx, cy); o.lineTo(cx, cy + s); o.lineTo(cx + s, cy + s / 2); o.closePath(); o.fill();
  };
  const cx = W / 2, cy = H / 2 + 4;
  const pos: [number, number][] = [[-28, 4], [28, 4], [0, -14], [0, 18]];
  o.strokeStyle = '#000'; o.setLineDash([2, 2]);
  for (const [dx, dy] of pos) { o.beginPath(); o.moveTo(cx, cy); o.lineTo(cx + dx, cy + dy); o.stroke(); }
  o.setLineDash([]);
  if (on) {
    // packets hopping between the hub and each storage block
    pos.forEach(([dx, dy], k) => {
      const f = (tt * 1.3 + k * 0.27) % 1, ff = k % 2 === 0 ? f : 1 - f;
      o.fillStyle = '#000'; o.fillRect(Math.round(cx + dx * ff) - 1, Math.round(cy + dy * ff) - 1, 3, 3);
    });
  }
  pos.forEach(([dx, dy], j) => cube(cx + dx, cy + dy, 7, on ? Math.max(0, Math.sin(tt * 3.2 + j * 1.6)) * 9 * p : 0));
  cube(cx, cy, 11, on ? (0.5 + 0.5 * Math.sin(tt * 2.4)) * 4 * p : 0);
};

const DRAW: Record<WinKind, Draw> = { trophy, medal, blocks };

/** Dithered win icon: still at rest, animates while its card is hovered. */
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
