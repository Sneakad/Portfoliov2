'use client';

import { useEffect, useRef } from 'react';
import { BAYER, INK, WHITE, fitCanvas, grey, observeVisible, prefersReducedMotion, rand, readAccent } from '@/lib/dither';

type Pt = [number, number];
type Proj = (x: number, y: number, z: number) => Pt;

interface Key { c: number; r: number; w: number; lab: string; fs: number }

const KEYS: Key[] = [
  { c: 0, r: 0, w: 1, lab: 'esc', fs: 9 }, { c: 1, r: 0, w: 1, lab: '⌘', fs: 15 }, { c: 2, r: 0, w: 1, lab: '⌥', fs: 15 }, { c: 3, r: 0, w: 1, lab: 'ai', fs: 12 },
  { c: 0, r: 1, w: 1, lab: '{ }', fs: 11 }, { c: 1, r: 1, w: 1, lab: '</>', fs: 10 }, { c: 2, r: 1, w: 1, lab: 'λ', fs: 15 }, { c: 3, r: 1, w: 1, lab: '⏎', fs: 15 },
  { c: 0, r: 2, w: 1, lab: 'git', fs: 10 }, { c: 1, r: 2, w: 1, lab: 'npm', fs: 9 }, { c: 2, r: 2, w: 1, lab: 'ts', fs: 12 }, { c: 3, r: 2, w: 1, lab: '↑', fs: 14 },
  { c: 0, r: 3, w: 3, lab: 'ship it', fs: 11 }, { c: 3, r: 3, w: 1, lab: 'fn', fs: 11 },
];

const GLYPH: Record<string, string> = {
  esc: '^[', '⌘': 'cmd', '⌥': 'opt', ai: '✦', '{ }': '{}', '</>': '<>', λ: 'λ', '⏎': '↵',
  git: 'push', npm: 'i', ts: ':T', '↑': '↑', 'ship it': '→prod', fn: 'fn',
};

const FONTS = { sans: 'sans-serif', mono: 'monospace' };

const iso = (ox: number, oy: number): Proj => (x, y, z) => [ox + (x - y) * 0.866, oy + (x + y) * 0.5 - z];
const hashK = (k: number) => Math.abs(Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1;

function poly(o: CanvasRenderingContext2D, pts: Pt[], fill: string | CanvasGradient) {
  o.fillStyle = fill;
  o.beginPath();
  o.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) o.lineTo(pts[i][0], pts[i][1]);
  o.closePath();
  o.fill();
}

/** One clean keycap: accent side toward the light, ink side away, white dished top, ink legend. */
function drawKey(o: CanvasRenderingContext2D, P: Proj, kx: number, ky: number, sx: number, sy: number, h: number, lab: string, fs: number, lw: number[], pressed: number) {
  const ins = Math.max(2.5, Math.min(sx, sy) * 0.12);
  const b = [P(kx, ky, 0), P(kx + sx, ky, 0), P(kx + sx, ky + sy, 0), P(kx, ky + sy, 0)];
  const tp = [P(kx + ins, ky + ins, h), P(kx + sx - ins, ky + ins, h), P(kx + sx - ins, ky + sy - ins, h), P(kx + ins, ky + sy - ins, h)];
  const leftLit = lw[1] > 0.12, rightLit = lw[0] > 0.12;
  poly(o, [b[3], b[2], tp[2], tp[3]], leftLit ? grey(0.5) : grey(0.03));
  poly(o, [b[1], b[2], tp[2], tp[1]], rightLit && !leftLit ? grey(0.5) : grey(0.03));
  const tc = P(kx + sx / 2, ky + sy / 2, h);
  if (pressed > 0.5) poly(o, tp, grey(0.5));
  else {
    const gr = o.createLinearGradient(tp[0][0], tp[0][1], tp[2][0], tp[2][1]);
    gr.addColorStop(0, grey(1));
    gr.addColorStop(1, grey(0.9));
    poly(o, tp, gr);
  }
  o.strokeStyle = '#000';
  o.lineWidth = 1.2;
  o.lineJoin = 'round';
  o.beginPath();
  o.moveTo(b[1][0], b[1][1]); o.lineTo(b[2][0], b[2][1]); o.lineTo(b[3][0], b[3][1]);
  o.lineTo(tp[3][0], tp[3][1]); o.lineTo(tp[0][0], tp[0][1]); o.lineTo(tp[1][0], tp[1][1]);
  o.closePath(); o.stroke();
  o.beginPath(); o.moveTo(tp[2][0], tp[2][1]); o.lineTo(b[2][0], b[2][1]); o.stroke();
  o.beginPath(); o.moveTo(tp[1][0], tp[1][1]); o.lineTo(tp[2][0], tp[2][1]); o.lineTo(tp[3][0], tp[3][1]); o.stroke();
  if (lab) {
    o.save();
    o.translate(tc[0], tc[1]);
    o.transform(0.866, 0.5, -0.866, 0.5, 0, 0);
    o.fillStyle = '#000';
    o.font = `800 ${fs}px ${FONTS.sans}`;
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText(lab, 0, 1);
    o.restore();
  }
}

export default function KeycapCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduced = prefersReducedMotion();
    const rs = getComputedStyle(document.documentElement);
    FONTS.sans = rs.getPropertyValue('--font-geist-sans').trim() || 'sans-serif';
    FONTS.mono = rs.getPropertyValue('--font-geist-mono').trim() || 'monospace';
    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const ctx = cv.getContext('2d')!;
    let img: ImageData | null = null;
    let visible = true;
    const stopObs = observeVisible(cv, (v) => (visible = v));

    const mouse = { x: -99, y: -99, on: false };
    const light = { x: 0, y: 0, init: false };
    const press: Record<number, number> = {};
    const parts: { x: number; y: number; ch: string; life: number; vx: number }[] = [];
    let burst = 0, clicked = 0, frame = 0, raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * cv.width;
      mouse.y = ((e.clientY - r.top) / r.height) * cv.height;
      mouse.on = true;
    };
    const onLeave = () => (mouse.on = false);
    const onClick = () => { burst = 0.7; clicked = performance.now(); };
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    cv.addEventListener('click', onClick);

    const hotCheck = (P: Proj, kx: number, ky: number, sx: number, sy: number, h: number) => {
      if (!mouse.on) return false;
      const c = P(kx + sx / 2, ky + sy / 2, h), r = Math.min(sx, sy) * 0.55;
      return Math.abs(mouse.x - c[0]) < r * 0.95 && Math.abs(mouse.y - c[1]) < r * 0.6;
    };

    const scene = (W: number, H: number, t: number) => {
      const cx = W * 0.5, cy = H * 0.5;
      const dxL = light.x - cx, dyL = light.y - cy;
      let lx = (dxL / 0.866 + dyL / 0.5) / 2, ly = (dyL / 0.5 - dxL / 0.866) / 2;
      const lz = 90, ll = Math.hypot(lx, ly, lz) || 1;
      const lw = [lx / ll, ly / ll, lz / ll];
      const u = 36, gap = 5, P = iso(cx + 4, cy - 92);
      const step = Math.floor(t / 0.32), ph = (t / 0.32) % 1;
      const cur = Math.floor(hashK(step) * KEYS.length), cur2 = step % 5 === 0 ? Math.floor(hashK(step + 99) * KEYS.length) : -1;
      const wt = t % 7;
      const jt = clicked ? (performance.now() - clicked) / 1000 : 9;
      let hotIdx = -1;
      KEYS.forEach((K, i) => {
        const sx = u * K.w + gap * (K.w - 1);
        if (hotCheck(P, K.c * (u + gap), K.r * (u + gap), sx, u, 12)) hotIdx = i;
      });
      for (const K of KEYS) {
        const kx = K.c * (u + gap), ky = K.r * (u + gap), sx = u * K.w + gap * (K.w - 1);
        poly(o, [P(kx + 3, ky + 5, 0), P(kx + sx + 3, ky + 5, 0), P(kx + sx + 3, ky + u + 5, 0), P(kx + 3, ky + u + 5, 0)], grey(0.03));
      }
      const order = KEYS.map((_, i) => i).sort((a, b) => KEYS[a].c + KEYS[a].r - (KEYS[b].c + KEYS[b].r));
      for (const idx of order) {
        const K = KEYS[idx], kx = K.c * (u + gap), ky = K.r * (u + gap), sx = u * K.w + gap * (K.w - 1);
        let near = 0;
        if (hotIdx >= 0) {
          const Kt = KEYS[hotIdx], dd = Math.abs(Kt.c - K.c) + Math.abs(Kt.r - K.r);
          near = idx === hotIdx ? 1 : dd === 1 ? 0.35 : 0;
        }
        const typing = (idx === cur || idx === cur2) && ph < 0.4 ? 1 : 0;
        const prev = press[idx] || 0;
        const p = (press[idx] = prev + (Math.max(near, typing) - prev) * 0.38);
        if (prev < 0.6 && p >= 0.6) {
          const top = P(kx + sx / 2, ky + u / 2, 12);
          parts.push({ x: top[0], y: top[1] - 6, ch: GLYPH[K.lab] || K.lab, life: 1, vx: (Math.random() - 0.5) * 0.6 });
        }
        const wl = wt * 2.2 - (K.c + K.r) * 0.45, wave = wl > 0 && wl < 1 ? Math.sin(wl * Math.PI) * 11 : 0;
        const jd = Math.hypot(K.c - 1.5, K.r - 1.5), jl = jt * 3 - jd * 0.35;
        const jump = jl > 0 && jl < 1.4 ? Math.sin(Math.min(1, jl) * Math.PI) * 22 * Math.exp(-jl * 0.8) : 0;
        const bob = Math.sin(t * 1.3 + idx * 0.9) * 0.6;
        drawKey(o, P, kx, ky, sx, u, 12 - 7 * p + wave + jump + bob, K.lab, K.fs, lw, p);
      }
      o.font = `700 11px ${FONTS.mono}`;
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      for (let q = parts.length - 1; q >= 0; q--) {
        const pt = parts[q];
        pt.y -= 0.9; pt.x += pt.vx; pt.life -= 0.018;
        if (pt.life <= 0) { parts.splice(q, 1); continue; }
        if (pt.life > 0.25 || Math.floor(pt.life * 40) % 2 === 0) {
          const tw = o.measureText(pt.ch).width + 6;
          if (pt.life > 0.7) { o.fillStyle = grey(0.5); o.fillRect(pt.x - tw / 2, pt.y - 7, tw, 14); }
          o.fillStyle = '#000';
          o.fillText(pt.ch, pt.x, pt.y);
        }
      }
      if (parts.length > 30) parts.splice(0, parts.length - 30);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      frame++;
      const t = reduced ? 2 : (now - t0) / 1000;
      const { W, H } = fitCanvas(cv, 2);
      if (off.width !== W || off.height !== H) { off.width = W; off.height = H; img = null; }
      if (!img || img.width !== W || img.height !== H) img = ctx.createImageData(W, H);
      const pal = [INK, readAccent(cv), WHITE];
      const tx = mouse.on ? mouse.x : W * (0.5 + 0.45 * Math.cos(t * 0.45));
      const ty = mouse.on ? mouse.y : H * (0.5 + 0.35 * Math.sin(t * 0.45));
      if (!light.init) { light.x = tx; light.y = ty; light.init = true; }
      light.x += (tx - light.x) * 0.1; light.y += (ty - light.y) * 0.1;
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.clearRect(0, 0, W, H);
      scene(W, H, t);
      const src = o.getImageData(0, 0, W, H).data, d = img.data;
      if (burst > 0) { burst *= 0.955; if (burst < 0.01) burst = 0; }
      const R2 = 900;
      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7];
        for (let x = 0; x < W; x++) {
          let amt = burst * burst * 80, push = 0, dxm = 0, dym = 0;
          if (mouse.on) {
            dxm = x - mouse.x; dym = y - mouse.y;
            const dd = dxm * dxm + dym * dym;
            if (dd < R2 * 4) { push = Math.exp(-dd / R2); amt += push * 9; }
          }
          let sx = x, sy = y;
          if (amt > 0.3) { sx += (rand(x, y, frame) * 2 - 1) * amt; sy += (rand(y, x, frame + 11) * 2 - 1) * amt; }
          if (push > 0) { sx -= dxm * push * 0.3; sy -= dym * push * 0.3; }
          const ix = sx | 0, iy = sy | 0, k = (y * W + x) * 4;
          if (ix < 0 || iy < 0 || ix >= W || iy >= H) { d[k + 3] = 0; continue; }
          const si = (iy * W + ix) * 4;
          if (src[si + 3] < 128) { d[k + 3] = 0; continue; }
          const val = src[si] / 255;
          let q = val > 0.97 ? 2 : val < 0.06 ? 0 : val > 0.46 && val < 0.54 ? 1 : Math.floor(val * 2 + br[x & 7]);
          if (q > 2) q = 2;
          const c = pal[q];
          d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      if (reduced && frame > 2) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      stopObs();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      cv.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Fourteen dithered keycaps typing on their own; each press pops a small code glyph. Hover presses keys, click makes them jump."
      className={className}
      style={{ imageRendering: 'pixelated', cursor: 'crosshair' }}
    />
  );
}
