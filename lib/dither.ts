// Shared helpers for the dithered canvas visuals on the home page.
// Every visual renders at low resolution, then maps each pixel to one of three tones
// (ink · accent · paper) with an 8×8 Bayer matrix, and is scaled up with `image-rendering: pixelated`.

export type RGB = [number, number, number];

export const INK: RGB = [17, 17, 16];
export const PAPER: RGB = [241, 240, 234];
export const WHITE: RGB = [255, 255, 255];

function buildBayer(): number[][] {
  let m: number[][] = [[0]];
  for (let n = 1; n < 8; n *= 2) {
    const size = n * 2;
    const next: number[][] = [];
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let x = 0; x < size; x++) {
        const q = y < n ? (x < n ? 0 : 2) : x < n ? 3 : 1;
        row.push(m[y % n][x % n] * 4 + q);
      }
      next.push(row);
    }
    m = next;
  }
  return m.map((r) => r.map((v) => (v + 0.5) / 64));
}

export const BAYER = buildBayer();

export function hexToRgb(hex: string, fallback: RGB = [197, 250, 110]): RGB {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return fallback;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Reads the accent colour from the `--acc` CSS variable so the whole page stays in sync. */
export function readAccent(el?: Element | null): RGB {
  if (typeof window === 'undefined') return [197, 250, 110];
  const v = getComputedStyle(el ?? document.documentElement).getPropertyValue('--acc');
  return hexToRgb(v);
}

export function rand(x: number, y: number, f: number): number {
  let n = (x * 374761393 + y * 668265263 + f * 982451653) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967295;
}

export const hash = (k: number) => Math.abs(Math.sin(k * 12.9898 + 4.1) * 43758.5453) % 1;

export const grey = (v: number) => {
  const c = Math.max(0, Math.min(255, Math.round(v * 255)));
  return `rgb(${c},${c},${c})`;
};

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Keeps a canvas' backing store at (css size / cell) so each dither dot is `cell` CSS px. */
export function fitCanvas(cv: HTMLCanvasElement, cell: number) {
  const W = Math.max(8, Math.round(cv.clientWidth / cell));
  const H = Math.max(8, Math.round(cv.clientHeight / cell));
  if (cv.width !== W || cv.height !== H) {
    cv.width = W;
    cv.height = H;
  }
  return { W, H };
}

/** Observe visibility so off-screen canvases stop animating. */
export function observeVisible(el: Element, onChange: (visible: boolean) => void) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const io = new IntersectionObserver((entries) => onChange(entries[entries.length - 1].isIntersecting));
  io.observe(el);
  return () => io.disconnect();
}
