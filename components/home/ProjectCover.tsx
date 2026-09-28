'use client';

import { useEffect, useRef, useState } from 'react';
import { BAYER, INK, PAPER, observeVisible, prefersReducedMotion, rand, readAccent } from '@/lib/dither';

export type CoverKind = 'money' | 'lern' | 'codz' | 'storz';

/** Pointer + click state handed to every field (field units: x 0..aspect, y 0..1). */
interface Input { on: boolean; x: number; y: number; ck: number; n: number; bug: number; cx: number; cy: number; node: number }
const IDLE: Input = { on: false, x: 0, y: 0, ck: 99, n: 0, bug: 6, cx: 0, cy: 0, node: -1 };

// Every field returns 1 = ink, ~0.5 = accent, 0 = paper.
const seg = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
  const c = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(px - (ax + vx * c), py - (ay + vy * c));
};
const h1 = (k: number) => Math.abs(Math.sin(k * 12.9898) * 43758.5453) % 1;

/** Moneysense: bars + trend line. Play: point at a bar to inspect it, click to load new data. */
function money(x: number, y: number, t: number, p: number, ar: number, I: Input) {
  const reg = I.n ? Math.min(1, I.ck * 0.8) : 1, pp = Math.min(p, reg);
  const u = x / ar, g = 0.25 + 0.75 * pp;
  const base = 0.84, n = 12, left = 0.07, right = 0.93, span = (right - left) / n;
  if (Math.abs(y - base) < 0.006 && u > left - 0.01 && u < right) return 1;
  const sh = Math.max(0, t - 2.2) * 0.45 + I.n * 3, shI = Math.floor(sh), shF = sh - shI;
  const uu = u + shF * span;
  const hh = (K: number) => 0.18 + 0.3 * (0.5 + 0.5 * Math.sin(K * 0.45)) + 0.18 * h1(K);
  const grow = (i: number) => Math.max(0, Math.min(1, g * 1.7 - i * 0.055));
  const lineT = Math.max(0, Math.min(1, (pp - 0.35) / 0.6));
  if (I.on) {
    const cu = I.x / ar, iu = Math.floor((cu + shF * span - left) / span);
    if (cu > left && cu < right && iu >= 0 && iu <= n) {
      const topY = base - hh(iu + shI) * grow(Math.min(n - 1, iu));
      if (Math.abs(u - cu) < 0.0035 && y < base && y > 0.05) return Math.floor(y * 90) % 2 === 0 ? 1 : 0;
      if (Math.abs(y - topY) < 0.005 && u > left && u < cu) return Math.floor(x * 110) % 2 === 0 ? 0.9 : 0;
      const fri = (uu - left) / span, ii = Math.floor(fri), ffr = fri - ii;
      if (ii === iu && ffr > 0.12 && ffr < 0.88 && y < base && y > topY) return 1;
    }
  }
  if (u > left && u < right && u < left + (right - left) * lineT) {
    const k = (uu - left) / span - 0.5, k0 = Math.floor(k), a = k - k0;
    const avg = (K: number) => (hh(K - 1) + hh(K) + hh(K + 1)) / 3;
    const i0 = Math.max(0, Math.min(n - 1, k0));
    const ly = base - (avg(k0 + shI) * grow(i0) * (1 - a) + avg(k0 + 1 + shI) * grow(Math.min(n - 1, i0 + 1)) * a) - 0.08;
    if (Math.abs(y - ly) < 0.011) return 1;
    if (p > 0.99 && Math.abs(u - (left + (right - left) * ((t * 0.18) % 1))) < 0.004 && y < base) return Math.floor(y * 60) % 2 === 0 ? 1 : 0;
  }
  if (u > left && u < right) {
    const i = Math.floor((uu - left) / span), fr = (uu - left) / span - i;
    if (fr > 0.18 && fr < 0.82 && i >= 0 && i <= n) {
      const h = hh(i + shI) * grow(Math.min(n - 1, i));
      if (y < base && y > base - h) return 0.3 + (0.55 * (base - y)) / Math.max(h, 0.001);
    }
  }
  if ((y * 5) % 1 < 0.02 && y < base) return 0.12;
  return 0;
}

/** Lern: prompt → lesson. Play: hover a line to highlight it, the ripple follows you, click asks a new question. */
function lern(x: number, y: number, t: number, p: number, ar: number, I: Input) {
  const u = x / ar, live = p >= 0.999 && t > 2.6;
  let cyc = live ? (t - 2.6) * 0.2 : 0, ci = Math.floor(cyc / 1.25), prog = live ? Math.min(1, cyc % 1.25) : p, qType = 1;
  if (I.n > 0) { cyc = I.ck * 0.2; ci = I.n * 7 + Math.floor(cyc / 1.25); prog = Math.min(1, cyc % 1.25); qType = Math.min(1, I.ck * 1.6); }
  if (y > 0.1 && y < 0.22 && u > 0.06 && u < 0.94) {
    if (y < 0.112 || y > 0.208 || u < 0.066 || u > 0.934) return 1;
    const ql = (0.2 + 0.25 * h1(ci + 5)) * qType;
    if (y > 0.14 && y < 0.19 && u > 0.09 && u < 0.09 + ql) return 0.5;
    if (y > 0.13 && y < 0.2 && u > 0.1 + ql && u < 0.105 + ql && Math.floor(t * 2) % 2 === 0) return 1;
    return 0;
  }
  for (let i = 0; i < 7; i++) {
    const ly = 0.32 + i * 0.075;
    if (y > ly && y < ly + 0.032) {
      const len = 0.22 + 0.32 * h1(i + ci * 17), lp = Math.max(0, Math.min(1, prog * 9 - i));
      if (I.on && I.y >= ly - 0.02 && I.y < ly + 0.055 && I.x / ar < 0.62 && u > 0.05 && u < 0.07 + len) return u < 0.06 + len * lp ? 1 : 0.5;
      if (u > 0.06 && u < 0.06 + len * lp) return i === 0 ? 1 : 0.62;
      if (u > 0.06 && u < 0.06 + len && lp < 1) return (x * 7 + y * 3) % 1 < 0.2 ? 0.2 : 0;
      return 0;
    }
  }
  if (u > 0.66 && u < 0.94 && y > 0.32 && y < 0.8) {
    const inP = I.on && I.x / ar > 0.66 && I.x / ar < 0.94 && I.y > 0.32 && I.y < 0.8;
    const cx = inP ? I.x : 0.8 * ar, cy = inP ? I.y : 0.56, dd = Math.hypot(x - cx, y - cy);
    const reveal = Math.max(0, Math.min(1, (prog - 0.3) / 0.6));
    if (dd > reveal * 0.3) return u < 0.662 || u > 0.938 || y < 0.325 || y > 0.795 ? 0.55 : 0;
    return 0.25 + 0.75 * (0.5 + 0.5 * Math.cos(dd * 60 - t * 3)) * (1 - dd / 0.3);
  }
  if (y > 0.88 && y < 0.905 && u > 0.06 && u < 0.94) return u < 0.06 + 0.88 * prog ? 1 : 0.2;
  return 0;
}

/** Codz: review pass fixes bugs. Play: the scan line follows your cursor; click a line to plant a bug, sweep past it to fix. */
function codz(x: number, y: number, t: number, p: number, ar: number, I: Input) {
  const u = x / ar, rows = 13, rh = 0.88 / rows;
  const r = Math.floor((y - 0.06) / rh), fy = (y - 0.06) / rh - r;
  const live = p >= 0.999 && t > 2.6;
  const cyc = live ? (t - 2.6) * 0.3 : 0;
  let ci = Math.floor(cyc / 1.4);
  let scan = live ? cyc % 1.4 : p * 1.12;
  let bugRow = live ? 2 + ((ci * 5 + 3) % 10) : 6;
  if (I.n > 0) { bugRow = I.bug; ci += I.n * 3; }
  if (I.on) scan = Math.max(0, Math.min(1.2, (I.y - 0.06) / 0.88));
  const yn = (y - 0.06) / 0.88;
  if (scan > 0.005 && scan < 1.0 && Math.abs(yn - scan) < 0.008) return 1;
  if (r < 0 || r >= rows) return 0;
  if (u < 0.06) return fy > 0.3 && fy < 0.7 && u > 0.025 && u < 0.045 ? 0.3 : 0;
  const a = Math.abs(Math.sin((r + ci * 13) * 12.9898) * 43758.5453) % 1;
  const b = Math.abs(Math.sin((r + ci * 13) * 78.233) * 12543.123) % 1;
  const fixed = (r === bugRow ? r + 1 : r + 0.5) / rows < scan;
  let indent = 0.09 + Math.floor(a * 4) * 0.05, len = 0.14 + b * 0.5;
  if (fixed) { indent = 0.09 + Math.floor(a * 3) * 0.04; len *= 0.72; }
  if (r === bugRow && !fixed) {
    if (fy < 0.08 || fy > 0.92 || u < 0.075 || u > 0.94) return 0;
    const wave = 0.5 + 0.18 * Math.sin(u * 90 + t * 4);
    if (Math.abs(fy - wave) < 0.1 && u > indent && u < indent + 0.55) return 1;
    return 0.5;
  }
  if (r === bugRow && fixed) {
    const ck = Math.min(1, (scan - (r + 1) / rows) * 6);
    const y0 = 0.06 + r * rh, ax0 = 0.84 * ar, ay0 = y0 + 0.5 * rh, bx0 = ax0 + 0.022, by0 = y0 + 0.85 * rh;
    if (Math.min(seg(x, y, ax0, ay0, bx0, by0), seg(x, y, bx0, by0, bx0 + 0.06 * ck, by0 - 0.8 * rh * ck)) < 0.008) return 1;
  }
  if (fy < 0.3 || fy > 0.72) return 0;
  if (u > indent && u < indent + len) {
    const tok = Math.floor((u - indent) * 20 + a * 7) % 3;
    if (fixed) return tok === 0 ? 0.5 : 0.95;
    return tok === 0 ? 0.45 : 0.8;
  }
  return 0;
}

function doc(x: number, y: number, l: number, t: number, w: number, h: number) {
  const r = l + w, b = t + h, fold = 0.07;
  if (x > r - fold && y < t + fold) {
    const fa = x - (r - fold), fb = y - t;
    if (Math.abs(fa - fb) < 0.008) return 1;
    if (fa > fb) return 0;
    if (Math.abs(x - (r - fold)) < 0.006 || Math.abs(y - (t + fold)) < 0.006) return 1;
    return 0.5;
  }
  if (x < l + 0.008 || x > r - 0.008 || y < t + 0.008 || y > b - 0.008) return 1;
  const ry = (y - t - 0.12) / 0.06;
  if (ry > 0 && y < b - 0.08) {
    const ri = Math.floor(ry), fr = ry - ri;
    const len = 0.45 + 0.4 * h1(ri);
    if (fr < 0.4 && x > l + 0.04 && x < l + 0.04 + (w - 0.08) * len) return 0.75;
  }
  return 0.14;
}

/** Storz: file → encrypted shards on a ring. Play: point at a node to stream packets to it, click to reassemble and re-shard. */
function storz(x: number, y: number, t: number, p: number, ar: number, I: Input) {
  if (I.n > 0 && I.ck < 1.4) {
    const c0 = I.ck < 0.5 ? 1 - I.ck / 0.5 : (I.ck - 0.5) / 0.9;
    p = Math.min(p, c0 * c0 * (3 - 2 * c0));
  }
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const cx = ar / 2, cy = 0.5, dw = Math.min(0.34, ar * 0.3), dh = 0.74, dl = cx - dw / 2, dt = cy - dh / 2;
  const cols = 3, rows = 4, cw = dw / cols, ch = dh / rows, n = cols * rows;
  const sc = 1 - 0.45 * e, live = p >= 0.999, rx = ar * 0.4, ry = 0.38;
  if (e > 0.55) {
    const la = (e - 0.55) / 0.45;
    for (let j = 0; j < n; j++) {
      const a1 = (j / n) * Math.PI * 2 - Math.PI / 2, a2 = ((j + 1) / n) * Math.PI * 2 - Math.PI / 2;
      const nx1 = cx + Math.cos(a1) * rx, ny1 = cy + Math.sin(a1) * ry, nx2 = cx + Math.cos(a2) * rx, ny2 = cy + Math.sin(a2) * ry;
      if (j === I.node) {
        const bx = Math.abs(x - nx1), by = Math.abs(y - ny1);
        if (bx < 0.026 && by < 0.026) return bx > 0.019 || by > 0.019 ? 1 : 0.5;
        const vx = nx1 - cx, vy = ny1 - cy, l2 = vx * vx + vy * vy;
        const pr = Math.max(0, Math.min(1, ((x - cx) * vx + (y - cy) * vy) / l2));
        const qx = cx + vx * pr - x, qy = cy + vy * pr - y;
        if (qx * qx + qy * qy < 0.000022) return (((pr * 14 - t * 3) % 1) + 1) % 1 < 0.45 ? 1 : 0.5;
      }
      if (live) {
        const f1 = (t * 0.35 + j * 0.37) % 1, pxp = nx1 + (nx2 - nx1) * f1, pyp = ny1 + (ny2 - ny1) * f1;
        if ((x - pxp) ** 2 + (y - pyp) ** 2 < 0.00022) return 1;
        if (j % 3 === 0) {
          const f2 = (t * 0.5 + j * 0.21) % 1, hx = cx + (nx1 - cx) * f2, hy = cy + (ny1 - cy) * f2;
          if ((x - hx) ** 2 + (y - hy) ** 2 < 0.00016) return 1;
        }
      }
      if (seg(x, y, nx1, ny1, nx1 + (nx2 - nx1) * la, ny1 + (ny2 - ny1) * la) < 0.004 && Math.floor(x * 140) % 2 === 0) return 0.6;
      if (j % 3 === 0 && seg(x, y, cx, cy, cx + (nx1 - cx) * la, cy + (ny1 - cy) * la) < 0.003 && Math.floor((x + y) * 120) % 3 === 0) return 0.5;
    }
  }
  if (e > 0.45) {
    const hs = ((0.035 * (e - 0.45)) / 0.55) * (live ? 1 + 0.15 * Math.sin(t * 3) : 1);
    if (Math.abs(x - cx) < hs && Math.abs(y - cy) < hs) return 1;
  }
  for (let k = 0; k < n; k++) {
    const ci = k % cols, ri = Math.floor(k / cols);
    const hx0 = dl + (ci + 0.5) * cw, hy0 = dt + (ri + 0.5) * ch;
    const ang = (((k * 5 + I.n * 7) % n) / n) * Math.PI * 2 - Math.PI / 2;
    const tx = cx + Math.cos(ang) * rx, ty = cy + Math.sin(ang) * ry;
    const mx = hx0 + (tx - hx0) * e, my = hy0 + (ty - hy0) * e;
    const gap = e > 0.02 ? 0.004 + 0.01 * e : 0;
    const hw = (cw / 2) * sc - gap, hhh = (ch / 2) * sc - gap;
    if (Math.abs(x - mx) < hw && Math.abs(y - my) < hhh) {
      const sx = hx0 + (x - mx) / sc, sy = hy0 + (y - my) / sc;
      let v = doc(sx, sy, dl, dt, dw, dh);
      if (e > 0.3) {
        const enc = Math.min(1, (e - 0.3) / 0.5);
        const rn = rand(Math.floor(sx * 90), Math.floor(sy * 90), k + (live ? Math.floor(t * 3) * 17 : 0));
        v = v * (1 - enc) + (rn > 0.5 ? 0.9 : 0.45) * enc;
        if (Math.abs(x - mx) > hw - 0.006 || Math.abs(y - my) > hhh - 0.006) v = 1;
      }
      return v;
    }
  }
  return 0;
}

const FIELDS = { money, lern, codz, storz };

// [hover tag, live tag, interactive hint, button label]
const TAGS: Record<CoverKind, [string, string, string, string]> = {
  money: ['Hover — raw transactions', 'Live · insights streaming', 'Point at a bar · click for new data', 'New data'],
  lern: ['Hover — ask anything', 'Live · writing lessons', 'Move over the lesson · click to ask again', 'New question'],
  codz: ['Hover — 1 bug found', 'Live · fixing bugs', 'Click a line to plant a bug · move down to fix', 'Plant a bug'],
  storz: ['Hover — one file', 'Live · 12 shards synced', 'Point at a node · click to re-shard', 'Re-shard'],
};

/**
 * A dithered, meaningful project cover.
 * Default: still at rest → builds and loops while hovered → rewinds on leave.
 * `interactive`: always running; the cursor disperses pixels and each project reacts to pointing and clicking.
 */
export default function ProjectCover({
  kind, label, height = 340, interactive = false,
}: { kind: CoverKind; label: string; height?: number | string; interactive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hovRef = useRef(interactive);
  const input = useRef<Input>({ ...IDLE });
  const target = useRef({ x: 0, y: 0 });
  const clickAt = useRef(-99);
  const clock = useRef(0);
  const [hovState, setHov] = useState(false);
  const hov = interactive || hovState;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const fn = FIELDS[kind];
    let img: ImageData | null = null, p = 0, ct = 0, drawn = false, frame = 0, last = 0, raf = 0, visible = true, lastN = 0;
    const stopObs = observeVisible(cv, (v) => (visible = v));

    const draw = (t: number, prog: number) => {
      const cell = 3;
      const W = Math.max(8, Math.round(cv.clientWidth / cell)), H = Math.max(8, Math.round(cv.clientHeight / cell));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (!img) img = ctx.createImageData(W, H);
      const d = img.data, ar = W / H, pal = [PAPER, readAccent(cv), INK];
      const scatter = kind === 'money' ? Math.pow(1 - prog, 2) * 16 : 0;
      const I = interactive ? input.current : IDLE;

      if (I.on && kind === 'storz') {
        let best = 0.12; I.node = -1;
        for (let j = 0; j < 12; j++) {
          const aa = (j / 12) * Math.PI * 2 - Math.PI / 2;
          const nd = Math.hypot(ar / 2 + Math.cos(aa) * ar * 0.4 - I.x, 0.5 + Math.sin(aa) * 0.38 - I.y);
          if (nd < best) { best = nd; I.node = j; }
        }
      } else if (!I.on && interactive) input.current.node = -1;

      // pointer dispersion + click shockwave (in canvas pixels)
      const R = 0.17 * H, mX = I.x * H, mY = I.y * H;
      const wave = I.n > 0 && I.ck < 1.6, wR = I.ck * 0.95 * H, wA = 14 * (1 - I.ck / 1.6), wB = 0.07 * H, cX = I.cx * H, cY = I.cy * H;

      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7];
        for (let x = 0; x < W; x++) {
          let sx = x, sy = y;
          if (scatter > 0.3) {
            sx = x + (rand(x, y, frame) * 2 - 1) * scatter;
            sy = y + (rand(y, x, frame + 3) * 2 - 1) * scatter * 0.6;
          }
          if (I.on) {
            const dx = x - mX, dy = y - mY, dd = Math.hypot(dx, dy);
            if (dd < R) {
              let kk = 1 - dd / R; kk = kk * kk * 16;
              const r1 = rand(x, y, frame + 7), r2 = rand(y, x, frame + 11);
              sx += (dx / (dd + 0.01)) * kk * r1 + (r2 - 0.5) * kk * 0.9;
              sy += (dy / (dd + 0.01)) * kk * r1 * 0.45 + (rand(x + 3, y, frame) - 0.5) * kk * 0.35;
            }
          }
          if (wave) {
            const dx = x - cX, dy = y - cY, wd = Math.hypot(dx, dy), band = 1 - Math.abs(wd - wR) / wB;
            if (band > 0) {
              const ws = band * band * wA;
              sx += (dx / (wd + 0.01)) * ws * rand(x, y, frame + 13) + (rand(y, x, frame + 17) - 0.5) * ws;
              sy += (dy / (wd + 0.01)) * ws * 0.6 * rand(y, x, frame + 19);
            }
          }
          let v = fn(sx / H, sy / H, t, prog, ar, I);
          v = v < 0 ? 0 : v > 1 ? 1 : v;
          let q = Math.floor(v * 2 + br[x & 7]);
          if (q > 2) q = 2;
          const c = pal[q], i = (y * W + x) * 4;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      frame++;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const I = input.current;
      if (I.on) { I.x += (target.current.x - I.x) * 0.25; I.y += (target.current.y - I.y) * 0.25; }
      I.ck = I.n ? ct - clickAt.current : 99;
      const on = hovRef.current && !reduced;
      const tg = on ? 1 : 0;
      let nxt = p + (tg - p) * (tg > p ? 0.035 : 0.09);
      if (Math.abs(nxt - tg) < 0.004) nxt = tg;
      const moving = nxt !== p;
      p = nxt;
      if (on) ct += dt; else if (p === 0) ct = 0;
      clock.current = ct;
      if (reduced) { if (!drawn || lastN !== I.n) { draw(3.5, 1); drawn = true; lastN = I.n; } return; }
      if (!drawn || ((on || moving) && visible)) { draw(ct, p); drawn = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopObs(); };
  }, [kind, interactive]);

  const enter = () => { hovRef.current = true; setHov(true); };
  const leave = () => { hovRef.current = interactive; input.current.on = false; setHov(false); };

  const toField = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.height, y: (e.clientY - r.top) / r.height };
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType === 'touch') return;
    const f = toField(e);
    target.current = f;
    if (!input.current.on) { input.current.x = f.x; input.current.y = f.y; }
    input.current.on = true;
  };
  const fire = (fx: number, fy: number) => {
    const I = input.current;
    I.n++; I.cx = fx; I.cy = fy; clickAt.current = clock.current;
    const rows = 13, row = Math.floor((fy - 0.06) / (0.88 / rows));
    I.bug = row >= 1 && row < rows ? row : 2 + ((I.n * 5) % 10);
  };
  const poke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const f = toField(e);
    fire(f.x, f.y);
  };
  const act = () => {
    const cv = ref.current;
    const ar = cv && cv.clientHeight ? cv.clientWidth / cv.clientHeight : 1.8;
    fire(ar / 2, input.current.n % 2 ? 0.35 : 0.62);
  };

  return (
    <div
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerMove={move}
      className="relative h-full overflow-hidden bg-paper"
      style={{ height, cursor: interactive ? 'crosshair' : undefined }}
    >
      <canvas
        ref={ref}
        role="img"
        aria-label={label}
        onPointerDown={poke}
        className="block h-full w-full touch-manipulation"
        style={{ imageRendering: 'pixelated' }}
      />
      {interactive && (
        <button
          type="button"
          onClick={act}
          className="absolute bottom-2.5 left-2.5 flex h-[30px] items-center gap-1.5 bg-ink px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-paper hover:bg-acc hover:text-ink"
        >
          <span aria-hidden="true">↻</span>
          {TAGS[kind][3]}
        </button>
      )}
      <span
        className={`pointer-events-none absolute bottom-2.5 right-2.5 border border-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink ${interactive ? 'hidden sm:block' : ''}`}
        style={{ background: hov ? 'var(--acc)' : 'var(--paper)' }}
      >
        {interactive ? TAGS[kind][2] : hov ? TAGS[kind][1] : TAGS[kind][0]}
      </span>
    </div>
  );
}
