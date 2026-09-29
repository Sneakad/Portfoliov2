'use client';

import { useEffect, useRef, useState } from 'react';
import { observeVisible } from '@/lib/dither';
import WinIcon, { type WinKind } from './WinIcon';

export default function WinCard({ kind, badge, title, body, iconLabel }: { kind: WinKind; badge: string; title: string; body: string; iconLabel: string }) {
  const [hov, setHov] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Phones can't hover: there the icon celebrates while the card is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: none)').matches) return;
    return observeVisible(el, setHov);
  }, []);

  return (
    <article
      ref={ref}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHov(true); }}
      // touch: the in-view observer above drives it; a tap's instant enter/leave would cut it short
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') setHov(false); }}
      className="lift-card flex flex-col border border-ink bg-paper"
    >
      <WinIcon kind={kind} active={hov} label={iconLabel} />
      <div className="flex flex-col gap-2.5 p-[22px]">
        <span className="self-start bg-acc px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em]">{badge}</span>
        <span className="font-pixel text-[30px] leading-[1.05]">{title}</span>
        <span className="text-base leading-normal text-body">{body}</span>
      </div>
    </article>
  );
}
