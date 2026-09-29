'use client';

import { useEffect, useRef, useState } from 'react';
import { BAYER, INK, PAPER, observeVisible, prefersReducedMotion, rand, readAccent } from '@/lib/dither';

export type CoverKind = 'money' | 'lern' | 'codz' | 'storz';

/** Pointer + click state handed to every field (field units: x 0..aspect, y 0..1). */
interface Input { on: boolean; x: number; y: number; ck: number; n: number; bug: number; node: number }
const IDLE: Input = { on: false, x: 0, y: 0, ck: 99, n: 0, bug: 6, node: -1 };

// Every field returns 1 = ink, ~0.5 = accent, 0 = paper.
const seg = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
  const c = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(px - (ax + vx * c), py - (ay + vy * c));
};
const h1 = (k: number) => Math.abs(Math.sin(k * 12.9898) * 43758.5453) % 1;

/** Moneysense: a company's revenue by year + a fair-value line. Play: point at a bar to inspect that year, click to load another stock. */
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
    // the lesson's outline draws itself top to bottom: three steps joined by arrows
    if (u < 0.664 || u > 0.936 || y < 0.325 || y > 0.795) return 0.55;
    const edge = 0.33 + 0.46 * Math.max(0, Math.min(1, (prog - 0.3) / 0.6));
    if (y > edge) return 0;
    if (prog < 0.9 && edge - y < 0.008) return 1; // the pen line doing the drawing
    for (let i = 0; i < 3; i++) {
      const by = 0.35 + i * 0.15, bh = 0.09;
      if (y > by && y < by + bh && u > 0.7 && u < 0.9) {
        if (u < 0.706 || u > 0.894 || y < by + 0.008 || y > by + bh - 0.008) return 1;
        const len = 0.06 + 0.1 * h1(i + ci * 3);
        if (y > by + 0.035 && y < by + 0.055 && u > 0.72 && u < 0.72 + len) return i === 0 ? 0.5 : 0.8;
        return 0;
      }
      const ay = by + bh; // arrow down to the next step
      if (i < 2 && y > ay && y < ay + 0.06) {
        if (Math.abs(u - 0.8) < 0.003 && y < ay + 0.04) return 1;
        if (y >= ay + 0.035 && Math.abs(u - 0.8) < (ay + 0.06 - y) * 0.5) return 1;
      }
    }
    return 0;
  }
  if (y > 0.88 && y < 0.905 && u > 0.06 && u < 0.94) return u < 0.06 + 0.88 * prog ? 1 : 0.2;
  return 0;
}

/**
 * Where Codz's review line is (`scan`, 0 = top of the file, >1 = done), which row holds the bug,
 * and which "file" is showing. Shared by the drawing and the step strip.
 */
function codzState(t: number, p: number, I: Input) {
  const live = p >= 0.999 && t > 2.6;
  const cyc = live ? (t - 2.6) * 0.3 : 0;
  let ci = Math.floor(cyc / 1.4);
  let scan = live ? cyc % 1.4 : p * 1.12;
  let bugRow = live ? 2 + ((ci * 5 + 3) % 10) : 6;
  if (I.n > 0) {
    bugRow = I.bug; ci += I.n * 3;
    // a freshly planted bug restarts the review from the top: ~0.5s to see the bug, then sweep down
    const sweep = I.ck * 0.3 - 0.15;
    if (sweep < 1.4) scan = Math.max(0, sweep);
  }
  // pointing at the file drives the review line yourself
  if (I.on) scan = Math.max(0, Math.min(1.2, (I.y - 0.06) / 0.88));
  return { scan, bugRow, ci };
}

/** Codz: review pass fixes bugs. Play: the scan line follows your cursor; click a line to plant a bug, sweep past it to fix. */
function codz(x: number, y: number, t: number, p: number, ar: number, I: Input) {
  const u = x / ar, rows = 13, rh = 0.88 / rows;
  const r = Math.floor((y - 0.06) / rh), fy = (y - 0.06) / rh - r;
  const { scan, bugRow, ci } = codzState(t, p, I);
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

/** A segment plus its padded bounding box, so most pixels skip the distance maths. */
interface Seg { ax: number; ay: number; bx: number; by: number; x0: number; x1: number; y0: number; y1: number }
const mkSeg = (ax: number, ay: number, bx: number, by: number, pad: number): Seg => ({
  ax, ay, bx, by, x0: Math.min(ax, bx) - pad, x1: Math.max(ax, bx) + pad, y0: Math.min(ay, by) - pad, y1: Math.max(ay, by) + pad,
});
const inBox = (x: number, y: number, s: Seg) => x > s.x0 && x < s.x1 && y > s.y0 && y < s.y1;

// The 12 ring positions never change, so their trig is done once.
const STORZ_N = 12;
const RING_COS = Array.from({ length: STORZ_N }, (_, j) => Math.cos((j / STORZ_N) * Math.PI * 2 - Math.PI / 2));
const RING_SIN = Array.from({ length: STORZ_N }, (_, j) => Math.sin((j / STORZ_N) * Math.PI * 2 - Math.PI / 2));

/** Storz's progress with a "Re-shard" click folded in: collapse back to one file (0.5s), then re-split (2.3s). */
function storzP(p: number, I: Input) {
  if (I.n > 0 && I.ck < 2.8) p = Math.min(p, I.ck < 0.5 ? 1 - I.ck / 0.5 : (I.ck - 0.5) / 2.3);
  return p;
}
const easeIO = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

/**
 * Storz: file → encrypted shards on a ring. Play: point at a node to stream packets to it, click to reassemble and re-shard.
 * Three phases, one per step: the whole file (p 0–0.2) · it splits into 12 shards that turn to encrypted noise
 * (p 0.2–0.55) · the shards travel out to the ring of nodes (p 0.55–1).
 * All geometry depends only on the frame, so it is built once here and the returned per-pixel function just compares.
 */
function storz(t: number, p: number, ar: number, I: Input) {
  p = storzP(p, I);
  const n = STORZ_N;
  const s = easeIO((p - 0.2) / 0.35), m = easeIO((p - 0.55) / 0.45); // hold, split+encrypt, then travel
  const cx = ar / 2, cy = 0.5, dw = Math.min(0.34, ar * 0.3), dh = 0.74, dl = cx - dw / 2, dt = cy - dh / 2;
  const cols = 3, cw = dw / cols, ch = dh / 4;
  const sc = 1 - 0.45 * m, live = p >= 0.95, rx = ar * 0.4, ry = 0.38;
  const nx = RING_COS.map((c) => cx + c * rx), ny = RING_SIN.map((s) => cy + s * ry);

  // ring: selected-node beam, packets, arcs and spokes (in the original per-node order)
  const ring = m > 0.3;
  const la = (m - 0.3) / 0.7;
  const arcs: Seg[] = [], spokes: (Seg | null)[] = [], pk: number[] = [], hub: number[] = [];
  if (ring) {
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n, dx = nx[j2] - nx[j], dy = ny[j2] - ny[j];
      arcs.push(mkSeg(nx[j], ny[j], nx[j] + dx * la, ny[j] + dy * la, 0.004));
      spokes.push(j % 3 === 0 ? mkSeg(cx, cy, cx + (nx[j] - cx) * la, cy + (ny[j] - cy) * la, 0.003) : null);
      if (live) {
        const f1 = (t * 0.35 + j * 0.37) % 1;
        pk.push(nx[j] + dx * f1, ny[j] + dy * f1);
        const f2 = (t * 0.5 + j * 0.21) % 1;
        hub.push(cx + (nx[j] - cx) * f2, cy + (ny[j] - cy) * f2);
      }
    }
  }
  const sel = ring ? I.node : -1;
  const svx = sel >= 0 ? nx[sel] - cx : 0, svy = sel >= 0 ? ny[sel] - cy : 0, sl2 = svx * svx + svy * svy;
  const hs = m > 0.2 ? ((0.035 * (m - 0.2)) / 0.8) * (live ? 1 + 0.15 * Math.sin(t * 3) : 1) : 0;

  // shards: 12 tiles of the document; they part and scramble in place, then fly out to the ring
  const gap = s > 0.02 ? 0.004 + 0.012 * s : 0;
  const hw = (cw / 2) * sc - gap, hhh = (ch / 2) * sc - gap;
  const enc = s, seed = live ? Math.floor(t * 3) * 17 : 0;
  const spread = 0.3 * s * (1 - m); // how far the shards drift apart before they travel
  const mx: number[] = [], my: number[] = [], hx: number[] = [], hy: number[] = [];
  for (let k = 0; k < n; k++) {
    const hx0 = dl + ((k % cols) + 0.5) * cw, hy0 = dt + (Math.floor(k / cols) + 0.5) * ch;
    const s = (k * 5 + I.n * 7) % n;
    hx.push(hx0); hy.push(hy0);
    mx.push(hx0 + (nx[s] - hx0) * m + (hx0 - cx) * spread); my.push(hy0 + (ny[s] - hy0) * m + (hy0 - cy) * spread * 0.4);
  }

  return (x: number, y: number) => {
    if (ring) {
      for (let j = 0; j < n; j++) {
        if (j === sel) {
          const bx = Math.abs(x - nx[j]), by = Math.abs(y - ny[j]);
          if (bx < 0.026 && by < 0.026) return bx > 0.019 || by > 0.019 ? 1 : 0.5;
          const pr = Math.max(0, Math.min(1, ((x - cx) * svx + (y - cy) * svy) / sl2));
          const qx = cx + svx * pr - x, qy = cy + svy * pr - y;
          if (qx * qx + qy * qy < 0.000022) return (((pr * 14 - t * 3) % 1) + 1) % 1 < 0.45 ? 1 : 0.5;
        }
        if (live) {
          const px = x - pk[2 * j], py = y - pk[2 * j + 1];
          if (px * px + py * py < 0.00022) return 1;
          if (j % 3 === 0) {
            const qx = x - hub[2 * j], qy = y - hub[2 * j + 1];
            if (qx * qx + qy * qy < 0.00016) return 1;
          }
        }
        const a = arcs[j];
        if (inBox(x, y, a) && Math.floor(x * 140) % 2 === 0 && seg(x, y, a.ax, a.ay, a.bx, a.by) < 0.004) return 0.6;
        const s = spokes[j];
        if (s && inBox(x, y, s) && Math.floor((x + y) * 120) % 3 === 0 && seg(x, y, s.ax, s.ay, s.bx, s.by) < 0.003) return 0.5;
      }
    }
    if (hs > 0 && Math.abs(x - cx) < hs && Math.abs(y - cy) < hs) return 1;
    for (let k = 0; k < n; k++) {
      const ox = x - mx[k], oy = y - my[k];
      if (Math.abs(ox) < hw && Math.abs(oy) < hhh) {
        const sx = hx[k] + ox / sc, sy = hy[k] + oy / sc;
        let v = doc(sx, sy, dl, dt, dw, dh);
        if (enc > 0) {
          const rn = rand(Math.floor(sx * 90), Math.floor(sy * 90), k + seed);
          v = v * (1 - enc) + (rn > 0.5 ? 0.9 : 0.45) * enc;
          if (Math.abs(ox) > hw - 0.006 || Math.abs(oy) > hhh - 0.006) v = 1;
        }
        return v;
      }
    }
    return 0;
  };
}

type Field = (x: number, y: number, t: number, p: number, ar: number, I: Input) => number;
/** Builds the per-pixel function for one frame; simple fields just close over the frame values. */
type FrameField = (t: number, p: number, ar: number, I: Input) => (x: number, y: number) => number;
const perPixel = (fn: Field): FrameField => (t, p, ar, I) => (x, y) => fn(x, y, t, p, ar, I);
const FIELDS: Record<CoverKind, FrameField> = { money: perPixel(money), lern: perPixel(lern), codz: perPixel(codz), storz };

// [hover tag, live tag, interactive hint, button label]
const TAGS: Record<CoverKind, [string, string, string, string]> = {
  money: ['Hover: raw financials', 'Live · valuing the stock', 'Point at a year · click for another stock', 'New stock'],
  lern: ['Hover: type a topic', 'Live · writing the course', 'Move over a chapter · click for a new topic', 'New topic'],
  codz: ['Hover: 1 bug found', 'Live · fixing bugs', 'Click a line to plant a bug · move down to fix', 'Plant a bug'],
  storz: ['Hover: one file', 'Live · 12 shards synced', 'Point at a node · click to re-shard', 'Re-shard'],
};

// The story each cover tells, in three plain steps. The case-study cover highlights the current one.
const STEPS: Record<CoverKind, [string, string, string]> = {
  money: ['Raw financials', 'Revenue by year', 'Fair value'],
  lern: ['Type a topic', 'Course writes itself', 'Ready to learn'],
  codz: ['Bug flagged', 'Review pass', 'Bug fixed'],
  storz: ['One file', 'Encrypted into shards', 'Spread across nodes'],
};

// Which step is on screen. Each mirrors the timing inside its field function above.
const STAGE: Record<CoverKind, (t: number, p: number, I: Input) => number> = {
  money: (t, p, I) => {
    const pp = Math.min(p, I.n ? Math.min(1, I.ck * 0.8) : 1);
    return pp < 0.45 ? 0 : pp < 0.97 ? 1 : 2;
  },
  lern: (t, p, I) => {
    const live = p >= 0.999 && t > 2.6;
    const prog = I.n > 0 ? Math.min(1, (I.ck * 0.2) % 1.25) : live ? Math.min(1, ((t - 2.6) * 0.2) % 1.25) : p;
    return prog < 0.12 ? 0 : prog < 1 ? 1 : 2;
  },
  codz: (t, p, I) => {
    const { scan, bugRow } = codzState(t, p, I);
    return (bugRow + 1) / 13 < scan ? 2 : scan > 0.02 ? 1 : 0;
  },
  storz: (t, p, I) => {
    // same phases as storz(): the file holds until 0.2, shards part until 0.55, then travel
    p = storzP(p, I);
    return p < 0.22 ? 0 : p < 0.6 ? 1 : 2;
  },
};

/**
 * A dithered, meaningful project cover.
 * Default: still at rest → builds and loops while hovered → rewinds on leave.
 * `interactive`: always running, with a 3-step strip naming what's on screen; each project reacts to pointing and clicking.
 */
export default function ProjectCover({
  kind, label, height = 340, interactive = false,
}: { kind: CoverKind; label: string; height?: number | string; interactive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hovRef = useRef(interactive);
  const autoRef = useRef(false); // on touch screens: playing because the cover is on screen
  const input = useRef<Input>({ ...IDLE });
  const target = useRef({ x: 0, y: 0 });
  const clickAt = useRef(-99);
  const clock = useRef(0);
  const [hovState, setHov] = useState(false);
  const hov = interactive || hovState;
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const fn = FIELDS[kind];
    let img: ImageData | null = null, p = 0, ct = 0, drawn = false, frame = 0, last = 0, raf = 0, visible = false, lastN = 0; // set by the observer; below-the-fold covers draw nothing until scrolled to
    // Phones can't hover, so there a home-page cover plays while it's on screen and rewinds when scrolled away.
    const autoplay = !interactive && window.matchMedia('(hover: none)').matches;
    const stopObs = observeVisible(cv, (v) => {
      visible = v;
      if (autoplay) { autoRef.current = v; hovRef.current = v; setHov(v); }
    });
    // read once: getComputedStyle every frame forces a style recalc
    const pal = [PAPER, readAccent(cv), INK];

    // Resolution: dots are ≥3 CSS px and the grid is capped at MAX_COLS columns, so a 1440px-wide
    // case-study cover costs about the same as a small home card. `slow` coarsens the dots further on
    // low-end devices, and again whenever frames keep taking too long (see tick).
    const MAX_COLS = 260;
    const nav = navigator as Navigator & { deviceMemory?: number };
    let slow = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 ? 1 : 0, ema = 0, samples = 0;
    const cellSize = () => Math.min(10, Math.max(3, Math.ceil(cssW / MAX_COLS)) + slow);

    // Size comes from a ResizeObserver so the loop never forces layout mid-scroll.
    let cssW = cv.clientWidth, cssH = cv.clientHeight;
    const ro = new ResizeObserver(([en]) => { cssW = en.contentRect.width; cssH = en.contentRect.height; drawn = false; });
    ro.observe(cv);

    // Dither art reads fine at 30fps. While the page is scrolling the cover holds its frame (it resumes
    // ~150ms after scrolling stops), so scrolling never competes with canvas work.
    let lastDraw = 0, lastScroll = -1e4;
    const onScroll = () => { lastScroll = performance.now(); };
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = (t: number, prog: number) => {
      const cell = cellSize();
      const W = Math.max(8, Math.round(cssW / cell)), H = Math.max(8, Math.round(cssH / cell));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; img = null; }
      if (!img) img = ctx.createImageData(W, H);
      const d = img.data, ar = W / H;
      const scatter = kind === 'money' ? Math.pow(1 - prog, 2) * 16 : 0;
      const I = interactive ? input.current : IDLE;

      if (I.on && kind === 'storz') {
        let best = 0.12; I.node = -1;
        for (let j = 0; j < STORZ_N; j++) {
          const nd = Math.hypot(ar / 2 + RING_COS[j] * ar * 0.4 - I.x, 0.5 + RING_SIN[j] * 0.38 - I.y);
          if (nd < best) { best = nd; I.node = j; }
        }
      } else if (!I.on && interactive) input.current.node = -1;
      const field = fn(t, prog, ar, I);

      // No pointer dispersion or click shockwave: they scrambled the very thing you point at.
      // Money's "raw transactions" scatter is the only per-pixel offset, and only while it builds.
      const inv = 1 / H;
      for (let y = 0; y < H; y++) {
        const br = BAYER[y & 7], fy = y * inv;
        for (let x = 0; x < W; x++) {
          let v: number;
          if (scatter > 0.3) {
            const sx = x + (rand(x, y, frame) * 2 - 1) * scatter;
            const sy = y + (rand(y, x, frame + 3) * 2 - 1) * scatter * 0.6;
            v = field(sx * inv, sy * inv);
          } else v = field(x * inv, fy);
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
      let nxt: number;
      if (kind === 'storz') {
        // Storz: constant-speed progress (2.6s in, 1s out); storz() eases it in-out, so the
        // file eases apart into shards instead of snapping open the moment you hover
        nxt = tg > p ? Math.min(1, p + dt / 2.6) : Math.max(0, p - dt / 1);
      } else {
        // the others ease out towards the target; per-second rates so 120Hz screens aren't 2× faster
        const rate = tg > p ? 0.035 : 0.09;
        nxt = p + (tg - p) * (1 - Math.pow(1 - rate, dt * 60));
        if (Math.abs(nxt - tg) < 0.004) nxt = tg;
      }
      const moving = nxt !== p;
      p = nxt;
      if (on) ct += dt; else if (p === 0) ct = 0;
      clock.current = ct;
      if (interactive) {
        const s = STAGE[kind](ct, p, I);
        if (s !== stageRef.current) { stageRef.current = s; setStage(s); }
      }
      if (reduced) { if (!drawn || lastN !== I.n) { draw(3.5, 1); drawn = true; lastN = I.n; } return; }
      if (!visible || (drawn && !(on || moving))) return;
      if (drawn && p !== 0 && (now - lastScroll < 150 || now - lastDraw < 32)) return;
      lastDraw = now;
      const s0 = performance.now();
      draw(ct, p); drawn = true;
      // adaptive quality: if frames keep costing more than ~9ms, use bigger dots (up to 4 steps)
      const ms = performance.now() - s0;
      ema = samples++ ? ema * 0.85 + ms * 0.15 : ms;
      if (samples > 8 && ema > 9 && slow < 4) { slow++; samples = 0; }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); stopObs(); ro.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [kind, interactive]);

  // Touch taps aren't hovers: a tap fires enter + leave instantly, which used to stop an
  // autoplaying cover mid-animation until it was scrolled away and back.
  const enter = (e: React.PointerEvent) => { if (e.pointerType === 'touch') return; hovRef.current = true; setHov(true); };
  const leave = (e: React.PointerEvent) => {
    input.current.on = false;
    if (e.pointerType === 'touch') return;
    hovRef.current = interactive || autoRef.current;
    setHov(hovRef.current);
  };

  const toField = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.height, y: (e.clientY - r.top) / r.height };
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType === 'touch') return;
    // only the picture itself is "pointing"; over the button the cover plays on its own
    if (e.target !== ref.current) { input.current.on = false; return; }
    const f = toField(e);
    target.current = f;
    if (!input.current.on) { input.current.x = f.x; input.current.y = f.y; }
    input.current.on = true;
  };
  const fire = (fy: number) => {
    const I = input.current;
    I.n++; clickAt.current = clock.current;
    const rows = 13, row = Math.floor((fy - 0.06) / (0.88 / rows));
    I.bug = row >= 1 && row < rows ? row : 2 + ((I.n * 5) % 10);
  };
  const poke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const f = toField(e);
    fire(f.y);
  };
  const act = () => {
    fire(input.current.n % 2 ? 0.35 : 0.62);
  };

  return (
    <div
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerMove={move}
      className="relative h-full overflow-hidden bg-paper"
      style={{ height, cursor: interactive ? 'crosshair' : 'pointer' }}
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
        // what's happening right now, in words: 1 → 2 → 3 with the current step lit up
        <ol aria-label="What the animation shows" className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em]">
          {STEPS[kind].map((s, k) => (
            <li
              key={s}
              aria-current={k === stage ? 'step' : undefined}
              className={`items-center gap-1 ${k === stage ? 'flex' : 'hidden sm:flex'}`}
            >
              {k > 0 && <span aria-hidden="true" className="hidden px-0.5 text-muted-ink sm:inline">→</span>}
              <span
                className="border border-ink px-1.5 py-0.5 transition-colors duration-300"
                style={{ background: k === stage ? 'var(--acc)' : 'var(--paper)', color: k === stage ? 'var(--ink)' : 'var(--color-muted-ink)' }}
              >
                {k + 1} · {s}
              </span>
            </li>
          ))}
        </ol>
      )}
      {interactive && (
        <button
          type="button"
          onClick={act}
          className="absolute bottom-2.5 left-2.5 flex h-10 items-center gap-1.5 bg-ink px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-paper hover:bg-acc hover:text-ink"
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
