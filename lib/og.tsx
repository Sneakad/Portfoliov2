// 1200×630 link-preview card in the site's paper / ink / acid palette, used by the opengraph-image files.
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const INK = '#111110';
const PAPER = '#F1F0EA';
const ACC = '#C5FA6E';

// Ordered 4×4 Bayer matrix: a small dithered ramp that echoes the site's covers.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function Dither() {
  const cols = 24;
  const rows = 30;
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const on = y / rows > (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
      cells.push(<div key={`${x}-${y}`} style={{ width: 12, height: 12, background: on ? INK : 'transparent' }} />);
    }
  }
  return <div style={{ display: 'flex', flexWrap: 'wrap', width: cols * 12, height: rows * 12 }}>{cells}</div>;
}

export function ogImage({ eyebrow, title, subtitle, chip }: { eyebrow: string; title: string; subtitle: string; chip: string }) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: PAPER, color: INK, border: `12px solid ${INK}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, padding: '0 36px', background: INK, color: PAPER, fontSize: 24, letterSpacing: 2 }}>
          <span>{eyebrow}</span>
          <span style={{ display: 'flex', width: 18, height: 18, background: ACC }} />
        </div>
        <div style={{ display: 'flex', flex: 1, padding: '48px 56px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxWidth: 740 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', fontSize: title.length > 14 ? 88 : 112, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>{title}</div>
              <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.3, color: '#3A3934' }}>{subtitle}</div>
            </div>
            <div style={{ display: 'flex', alignSelf: 'flex-start', background: ACC, border: `3px solid ${INK}`, padding: '8px 18px', fontSize: 26, fontWeight: 700 }}>{chip}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Dither />
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
