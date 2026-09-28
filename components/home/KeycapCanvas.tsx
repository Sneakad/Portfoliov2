'use client';

import { useEffect, useRef } from 'react';
import { BAYER, INK, WHITE, fitCanvas, grey, observeVisible, prefersReducedMotion, rand, readAccent } from '@/lib/dither';

type Pt = [number, number];
type Proj = (x: number, y: number, z: number) => Pt;

interface Key { c: number; r: number; w: number; lab: string; fs: number }

const KEYS: Key[] = [
  { c: 0, r: 0, w: 1, lab: 'esc', fs: 11 }, { c: 1, r: 0, w: 1, lab: '⌘', fs: 17 }, { c: 2, r: 0, w: 1, lab: '⌥', fs: 17 }, { c: 3, r: 0, w: 1, lab: 'ai', fs: 14 },
  { c: 0, r: 1, w: 1, lab: '{ }', fs: 13 }, { c: 1, r: 1, w: 1, lab: '</>', fs: 12 }, { c: 2, r: 1, w: 1, lab: 'λ', fs: 17 }, { c: 3, r: 1, w: 1, lab: '⏎', fs: 17 },
  { c: 0, r: 2, w: 1, lab: 'git', fs: 12 }, { c: 1, r: 2, w: 1, lab: 'npm', fs: 11 }, { c: 2, r: 2, w: 1, lab: 'ts', fs: 14 }, { c: 3, r: 2, w: 1, lab: '↑', fs: 16 },
  { c: 0, r: 3, w: 3, lab: 'ship it', fs: 13 }, { c: 3, r: 3, w: 1, lab: 'fn', fs: 13 },
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

/** One clean keycap: accent side toward the light, ink side away, white dished top. Legends are drawn on a sharper layer. */
function drawKey(o: CanvasRenderingContext2D, P: Proj, kx: number, ky: number, sx: number, sy: number, h: number, lw: number[], pressed: number) {
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
}

interface Legend { x: number; y: number; lab: string; fs: number; iso: boolean }

/**
 * Hero keycap cluster. Types on its own; hover lifts the key under the cursor,
 * click presses that key (neighbours dip) and pops a code glyph.
 * Legends render on a second canvas at 2× the dither resolution, hard-thresholded to ink, so they stay readable.
 */
export default function KeycapCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lgRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current, lg = lgRef.current;
    if (!cv || !lg) return;
    const reduced = prefersReducedMotion();
    const rs = getComputedStyle(document.documentElement);
    FONTS.sans = rs.getPropertyValue('--font-geist-sans').trim() || 'sans-serif';
    FONTS.mono = rs.getPropertyValue('--font-geist-mono').trim() || 'monospace';
    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const ctx = cv.getContext('2d')!;
    const lctx = lg.getContext('2d', { willReadFrequently: true })!;
    let img: ImageData | null = null;
    let visible = true;
    const stopObs = observeVisible(cv, (v) => (visible = v));

    const mouse = { x: -99, y: -99, on: false };
    const light = { x: 0, y: 0, init: false };
    const press: Record<string, number> = {};
    const clicks: Record<number, number> = {};
    const parts: { x: number; y: number; ch: string; life: number; vx: number }[] = [];
    let legends: Legend[] = [];
    let T: [number, number, number] = [1, 0, 0];
    let wantPress = false, frame = 0, raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * cv.width;
      mouse.y = ((e.clientY - r.top) / r.height) * cv.height;
      mouse.on = e.pointerType !== 'touch';
    };
    const onLeave = () => (mouse.on = false);
    const onDown = (e: PointerEvent) => { onMove(e); mouse.on = true; wantPress = true; };
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    cv.addEventListener('pointerdown', onDown);
    const ease = (key: string, target: number, k: number) => (press[key] = (press[key] || 0) + (target - (press[key] || 0)) * k);

    const scene = (W: number, H: number, t: number) => {
      const cx = W * 0.5, cy = H * 0.5;
      const k = Math.max(0.55, Math.min(1.35, Math.min(W, H) / 300));
      const tX = cx * (1 - k), tY = cy * (1 - k);
      T = [k, tX, tY];
      o.setTransform(k, 0, 0, k, tX, tY);
      const dxL = light.x - cx, dyL = light.y - cy;
      const lx = (dxL / 0.866 + dyL / 0.5) / 2, ly = (dyL / 0.5 - dxL / 0.866) / 2;
      const lz = 90, ll = Math.hypot(lx, ly, lz) || 1;
      const lw = [lx / ll, ly / ll, lz / ll];
      // the cluster spans 0..159 on both iso axes; this origin centres it in the panel
      const u = 36, gap = 5, ox = cx, oy = cy - 72, P = iso(ox, oy);
      const now = performance.now();
      const step = Math.floor(t / 0.32), ph = (t / 0.32) % 1;
      const cur = Math.floor(hashK(step) * KEYS.length), cur2 = step % 5 === 0 ? Math.floor(hashK(step + 99) * KEYS.length) : -1;
      const wt = t % 7;
      // exact hit test: un-project the cursor onto the key-top plane
      let hotIdx = -1;
      if (mouse.on) {
        const mx = (mouse.x - tX) / k, my = (mouse.y - tY) / k;
        const A = (mx - ox) / 0.866, B = (my - oy + 12) / 0.5, X = (A + B) / 2, Y = (B - A) / 2;
        KEYS.forEach((K, i) => {
          const kx = K.c * (u + gap), ky = K.r * (u + gap), sx = u * K.w + gap * (K.w - 1);
          if (X >= kx - 1 && X <= kx + sx + 1 && Y >= ky - 1 && Y <= ky + u + 1) hotIdx = i;
        });
      }
      if (wantPress) { wantPress = false; if (hotIdx >= 0) clicks[hotIdx] = now; }
      for (const K of KEYS) {
        const kx = K.c * (u + gap), ky = K.r * (u + gap), sx = u * K.w + gap * (K.w - 1);
        poly(o, [P(kx + 3, ky + 5, 0), P(kx + sx + 3, ky + 5, 0), P(kx + sx + 3, ky + u + 5, 0), P(kx + 3, ky + u + 5, 0)], grey(0.03));
      }
      legends = [];
      const order = KEYS.map((_, i) => i).sort((a, b) => KEYS[a].c + KEYS[a].r - (KEYS[b].c + KEYS[b].r));
      for (const idx of order) {
        const K = KEYS[idx], kx = K.c * (u + gap), ky = K.r * (u + gap), sx = u * K.w + gap * (K.w - 1);
        let clickP = 0;
        for (const key in clicks) {
          const age = (now - clicks[key]) / 1000, Kc = KEYS[+key];
          if (age > 0.8) { delete clicks[key]; continue; }
          const dist = Math.abs(Kc.c - K.c) + Math.abs(Kc.r - K.r);
          if (+key === idx) clickP = Math.max(clickP, age < 0.14 ? 1 : Math.max(0, 1 - (age - 0.14) / 0.3));
          else if (dist === 1) { const na = age - 0.07; clickP = Math.max(clickP, na > 0 && na < 0.3 ? 0.3 * Math.sin((na / 0.3) * Math.PI) : 0); }
        }
        const typing = (idx === cur || idx === cur2) && ph < 0.4 ? 1 : 0;
        const prev = press['c' + idx] || 0;
        const p = ease('c' + idx, Math.max(clickP, typing), clickP >= 1 ? 0.6 : 0.38);
        const lift = ease('l' + idx, idx === hotIdx ? 1 : 0, 0.25);
        if (prev < 0.6 && p >= 0.6) {
          const top = P(kx + sx / 2, ky + u / 2, 12);
          parts.push({ x: top[0], y: top[1] - 6, ch: GLYPH[K.lab] || K.lab, life: 1, vx: (Math.random() - 0.5) * 0.6 });
        }
        const wl = wt * 2.2 - (K.c + K.r) * 0.45, wave = wl > 0 && wl < 1 ? Math.sin(wl * Math.PI) * 11 : 0;
        const bob = Math.sin(t * 1.3 + idx * 0.9) * 0.6;
        const h = 12 - 8 * p + wave + bob + lift * 4 * (1 - p);
        drawKey(o, P, kx, ky, sx, u, h, lw, p);
        const tc = P(kx + sx / 2, ky + u / 2, h);
        legends.push({ x: tc[0], y: tc[1], lab: K.lab, fs: K.fs, iso: true });
      }
      o.font = `700 11px ${FONTS.mono}`;
      for (let q = parts.length - 1; q >= 0; q--) {
        const pt = parts[q];
        pt.y -= 0.9; pt.x += pt.vx; pt.life -= 0.018;
        if (pt.life <= 0) { parts.splice(q, 1); continue; }
        if (pt.life > 0.25 || Math.floor(pt.life * 40) % 2 === 0) {
          const tw = o.measureText(pt.ch).width + 8;
          if (pt.life > 0.6) { o.fillStyle = grey(0.5); o.fillRect(pt.x - tw / 2, pt.y - 8, tw, 16); }
          legends.push({ x: pt.x, y: pt.y, lab: pt.ch, fs: 12, iso: false });
        }
      }
      if (parts.length > 30) parts.splice(0, parts.length - 30);
      o.setTransform(1, 0, 0, 1, 0, 0);
    };

    const drawLegends = (W: number, H: number) => {
      const W2 = W * 2, H2 = H * 2;
      if (lg.width !== W2 || lg.height !== H2) { lg.width = W2; lg.height = H2; }
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.clearRect(0, 0, W2, H2);
      lctx.setTransform(2 * T[0], 0, 0, 2 * T[0], 2 * T[1], 2 * T[2]);
      lctx.fillStyle = '#111110';
      lctx.textAlign = 'center';
      lctx.textBaseline = 'middle';
      for (const L of legends) {
        lctx.save();
        lctx.translate(L.x, L.y);
        if (L.iso) lctx.transform(0.866, 0.5, -0.866, 0.5, 0, 0);
        lctx.font = `700 ${L.fs}px ${FONTS.mono}`;
        lctx.fillText(L.lab, 0, 1);
        lctx.restore();
      }
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      const im = lctx.getImageData(0, 0, W2, H2), d = im.data;
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] > 110) { d[i - 3] = 17; d[i - 2] = 17; d[i - 1] = 16; d[i] = 255; } else d[i] = 0;
      }
      lctx.putImageData(im, 0, 0);
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
      // hover: wide, stretchy scatter (legends stay sharp on their own layer)
      const R2 = 1300;
      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7];
        for (let x = 0; x < W; x++) {
          let amt = 0, push = 0, dxm = 0, dym = 0;
          if (mouse.on) {
            dxm = x - mouse.x; dym = y - mouse.y;
            const dd = dxm * dxm + dym * dym;
            if (dd < R2 * 4) { push = Math.exp(-dd / R2); amt += push * 13; }
          }
          let sx = x, sy = y;
          if (amt > 0.3) { sx += (rand(x, y, frame) * 2 - 1) * amt * 1.5; sy += (rand(y, x, frame + 11) * 2 - 1) * amt * 0.8; }
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
      drawLegends(W, H);
      if (reduced && frame > 2) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      stopObs();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      cv.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={ref}
        role="img"
        aria-label="Fourteen dithered keycaps typing on their own; each press pops a small code glyph. Hover lifts a key, click presses it."
        className="absolute inset-0 block h-full w-full touch-manipulation"
        style={{ imageRendering: 'pixelated', cursor: 'pointer' }}
      />
      <canvas ref={lgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}
