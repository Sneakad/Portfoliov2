import localFont from 'next/font/local';

// Fonts are declared here instead of importing from `geist/font/*` so we control preloading.
// All three are preloaded (next/font default); the pixel set is just the one Square cut.

export const GeistPixelSquare = localFont({
  // `geist/font/pixel` defines all four pixel cuts (and preloads them); only Square is used
  src: './GeistPixel-Square.woff2',
  variable: '--font-geist-pixel-square',
  weight: '500',
  display: 'swap',
  fallback: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  adjustFontFallback: false,
});

export const GeistSans = localFont({
  src: './Geist-Variable.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  // preloaded: body text; not preloading it delayed first paint on slow mobile
});

export const GeistMono = localFont({
  src: './GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  // preloaded: nav + labels
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
  adjustFontFallback: false,
});
