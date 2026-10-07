'use client';
// Section 04, "How I build": a dithered particle stream runs left to right through five phase nodes.
// It starts as wide turbulent noise and pinches tighter and calmer at every node; the active phase's
// segment is lit in the accent. White dots on a black strip. Below, a panel shows the phase, what it produces, and the toolkit.
import { useEffect, useRef, useState } from 'react';
import { signalPath } from '@/data/home';
import { BAYER, INK, WHITE, readAccent, hash, prefersReducedMotion } from '@/lib/dither';

const NODES = [0.14, 0.33, 0.52, 0.71, 0.9];
const AMP = [0.46, 0.3, 0.19, 0.1, 0.05, 0.03]; // stream half-width per segment (fraction of height)
const N = 1100, TRAIL = 16, CELL = 3;
const pad = (i: number) => String(i + 1).padStart(2, '0');

// Text that dithers into its new value: each character dissolves ▓ → ▒ → ░, then resolves, staggered left
// to right (~0.5s). Screen readers get the real text only, never the in-between blocks.
const RAMP = ['▓', '▒', '░'];
function DitherText({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const prev = useRef(text);
  useEffect(() => {
    const from = prev.current;
    prev.current = text;
    if (from === text || prefersReducedMotion()) { setOut(text); return; }
    const len = Math.max(from.length, text.length), dur = 260, stagger = Math.min(14, 240 / len);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const e = now - t0;
      let str = '', done = true;
      for (let i = 0; i < len; i++) {
        const p = (e - i * stagger) / dur;
        if (p >= 1) { str += text[i] ?? ''; continue; }
        done = false;
        const ch = text[i] ?? from[i] ?? '';
        if (p <= 0) str += from[i] ?? ' ';
        else str += ch === ' ' ? ' ' : RAMP[Math.min(2, Math.floor(p * 3))];
      }
      setOut(str);
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return (
    <>
      <span aria-hidden="true">{out}</span>
      <span className="sr-only">{text}</span>
    </>
  );
}

type Phase = (typeof signalPath.phases)[number];

/** The phase details: number, name, line, output and toolkit. `live` = the visible, animated copy. */
function Panel({ ph, n, live, onStep }: { ph: Phase; n: number; live?: boolean; onStep?: (d: number) => void }) {
  // a plain function (not a component defined here), so each DitherText keeps its state between phases
  const T = (text: string) => (live ? <DitherText text={text} /> : text);
  const tools = [...ph.tools, ...ph.ai];
  return (
    // side by side from lg: on tablets the left column is too narrow for the number row + arrows
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-4 border-ink py-8 lg:border-r lg:pr-10">
        {/* the arrows sit in the number row, which is the same height for every phase, so they never move */}
        <div className="flex items-end gap-4">
          <span className="font-pixel text-[88px] leading-[0.8] md:text-[112px]">{T(pad(n))}</span>
          <span className="pb-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-ink">of 05</span>
          <div className="ml-auto flex gap-2 pb-0.5 font-mono text-sm">
            <button onClick={() => onStep?.(-1)} aria-label="Previous phase" className="lift-btn border border-ink bg-paper px-3 py-1.5">←</button>
            <button onClick={() => onStep?.(1)} aria-label="Next phase" className="lift-btn border border-ink bg-paper px-3 py-1.5">→</button>
          </div>
        </div>
        <h3 className="font-pixel text-[40px] leading-none md:text-[48px]">{T(ph.k)}</h3>
        <p className="text-lg leading-relaxed text-body">{T(ph.line)}</p>
        <p className="font-mono text-sm">
          <span className="text-muted-ink">out → </span>
          <span className="bg-acc px-1.5 py-0.5">{T(ph.out)}</span>
        </p>
      </div>
      <div className="py-8 lg:pl-10">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-ink">Toolkit</p>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2">
          {tools.map((t, i) => (
            // keyed by position, so each slot dithers from the previous phase's tool into the new one
            <li key={i} className="row-hover flex items-baseline gap-3 border-b border-dashed border-ink/40 py-2.5 pr-5 font-mono text-[15px]">
              <span className="text-[11px] text-muted-ink">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1">{T(t)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// every step is a circle: an ink ring with a light fill (lime when active or hovered)
function NodeCircle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
      <circle cx="22" cy="22" r="19" className={className} stroke="var(--ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
const smooth = (e0: number, e1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

function amp(u: number) {
  // blend smoothly from one segment's width to the next around each node
  let a = AMP[0];
  for (let i = 0; i < NODES.length; i++) a += (AMP[i + 1] - AMP[i]) * smooth(NODES[i] - 0.04, NODES[i] + 0.03, u);
  return a;
}
function pinch(u: number) {
  let d = 1;
  for (const n of NODES) d = Math.min(d, Math.abs(u - n));
  return 0.18 + 0.82 * smooth(0, 0.06, d);
}
function seg(u: number) { let k = 0; while (k < NODES.length && u > NODES[k]) k++; return k; }

export default function BuildProcess() {
  const { phases } = signalPath;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(0);
  activeRef.current = active;

  // stream animation
  useEffect(() => {
    const c = cv.current, box = wrap.current; if (!c || !box) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const ACC = readAccent(box);
    const still = prefersReducedMotion();
    // visible starts false: the observer reports right away, so nothing is drawn while off screen
    let W = 0, H = 0, img: ImageData, dens = new Float32Array(0), acc = new Uint8Array(0), raf = 0, visible = false, t = 0;
    // smooth at the display's refresh rate, including while the page scrolls
    const size = () => {
      W = Math.max(60, Math.round(box.clientWidth / CELL)); H = Math.max(24, Math.round(c.clientHeight / CELL));
      c.width = W; c.height = H; img = ctx.createImageData(W, H); dens = new Float32Array(W * H); acc = new Uint8Array(W * H);
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    const P = Array.from({ length: N }, (_, i) => ({ off: hash(i + 1), sp: 0.0011 + hash(i + 7) * 0.0012, lane: hash(i + 13) * 2 - 1, ph: hash(i + 19) * 6.283, j: hash(i + 23) }));

    const draw = () => {
      dens.fill(0); acc.fill(0);
      const a = activeRef.current, s0 = a === 0 ? 0 : NODES[a - 1], s1 = NODES[a], cy = H / 2;
      const n = Math.min(N, Math.round(W * 2.4));
      for (let pi = 0; pi < n; pi++) {
        const p = P[pi];
        const head = (p.off + t * p.sp) % 1;
        for (let k = 0; k < TRAIL; k++) {
          const u = head - k * 0.003; if (u < 0) break;
          const g = seg(u), noise = g === 0 ? 1 : g === 1 ? 0.55 : 0.25 / g;
          const wob = Math.sin(u * (18 + g * 10) + t * 0.05 + p.ph) * 0.45 + Math.sin(u * 61 + p.ph * 3 + t * 0.09) * 0.35 * noise;
          const jit = g === 0 ? (hash(Math.floor(u * 900) + p.ph * 99) - 0.5) * 0.9 : 0;
          const y = cy + H * amp(u) * pinch(u) * (p.lane * 0.65 + wob * 0.55 + jit);
          const x = Math.floor(u * W), yi = Math.floor(y);
          if (x < 0 || x >= W || yi < 0 || yi >= H) continue;
          const i = yi * W + x; dens[i] += (1 - k / TRAIL) * 0.55;
          if (u >= s0 && u <= s1) acc[i] = 1;
        }
      }
      const d = img.data;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x, o = i * 4, on = Math.min(1, dens[i]) > BAYER[y & 7][x & 7];
        const col = on ? (acc[i] ? ACC : WHITE) : INK; // white dots on black; the active phase in lime
        d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    if (still) {
      // reduced motion: a still frame, redrawn only so the lit segment follows the selected phase
      t = 400; draw();
      const id = setInterval(draw, 400);
      return () => { clearInterval(id); ro.disconnect(); io.disconnect(); };
    }
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!visible) return;
      // motion follows real time (60 steps a second), so it flows at the same speed on any screen
      t += dt * 60;
      draw(); // every frame, scrolling or not (~6ms worst case measured)
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  // auto-advance until the reader takes over
  useEffect(() => {
    if (!auto || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    if (wrap.current) io.observe(wrap.current);
    const id = setInterval(() => visible && setActive((a) => (a + 1) % phases.length), 3200);
    return () => { clearInterval(id); io.disconnect(); };
  }, [auto, phases.length]);

  const pick = (i: number) => { setAuto(false); setActive((i + phases.length) % phases.length); };
  const ph = phases[active];

  return (
    <div className="mt-10">
      <p className="max-w-[640px] text-lg leading-relaxed text-body">{signalPath.intro}</p>

      {/* stream + nodes */}
      <div ref={wrap} className="relative mt-8 border-y border-ink">
        <canvas ref={cv} aria-hidden="true" className="block h-[150px] w-full bg-ink md:h-[210px]" style={{ imageRendering: 'pixelated' }} />
        <div role="tablist" aria-label="Phases" className="absolute inset-0"
          onKeyDown={(e) => { if (e.key === 'ArrowRight') pick(active + 1); if (e.key === 'ArrowLeft') pick(active - 1); }}>
          {phases.map((p, i) => (
            <button
              key={p.k}
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => pick(i)}
              style={{ left: `${NODES[i] * 100}%` }}
              className="group absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              <span className="relative grid h-11 w-11 place-items-center md:h-[62px] md:w-[62px]">
                <NodeCircle className={`transition-[fill] ${i === active ? 'fill-acc' : 'fill-paper group-hover:fill-acc'}`} />
                <span className="relative font-mono text-[11px] font-semibold md:text-[13px]">{pad(i)}</span>
              </span>
              <span className={`absolute top-[calc(100%+6px)] hidden whitespace-nowrap sm:block bg-ink px-1 font-mono text-[10px] uppercase tracking-[0.14em] md:text-[11px] ${i === active ? 'text-paper' : 'text-[#9A998F]'}`}>
                {p.k}
              </span>
            </button>
          ))}
        </div>
        <span className="absolute bottom-2 left-2 bg-ink px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A998F]">idea</span>
        <span className="absolute bottom-2 right-2 bg-acc px-1 font-mono text-[10px] uppercase tracking-[0.14em]">production</span>
      </div>

      {/* phase panel: every phase is laid out invisibly in the same cell, so the panel is always as tall
          as the tallest phase and never jumps; the live copy on top dithers its text between phases */}
      <div className="grid border-b border-ink">
        {phases.map((p, i) => (
          <div key={p.k} aria-hidden="true" className="invisible [grid-area:1/1]">
            <Panel ph={p} n={i} />
          </div>
        ))}
        <div className="[grid-area:1/1]" aria-live="polite">
          <Panel ph={ph} n={active} live onStep={(d) => pick(active + d)} />
        </div>
      </div>
    </div>
  );
}
