'use client';

import { useState } from 'react';
import WinIcon, { type WinKind } from './WinIcon';

export default function WinCard({ kind, badge, title, body, iconLabel }: { kind: WinKind; badge: string; title: string; body: string; iconLabel: string }) {
  const [hov, setHov] = useState(false);
  return (
    <article
      onPointerEnter={() => setHov(true)}
      onPointerLeave={() => setHov(false)}
      className="lift-card flex flex-col border border-ink bg-paper"
    >
      <div className="simple:hidden">
        <WinIcon kind={kind} active={hov} label={iconLabel} />
      </div>
      <div className="flex flex-col gap-2.5 p-[22px]">
        <span className="self-start bg-acc px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em]">{badge}</span>
        <span className="font-pixel text-[30px] leading-[1.05]">{title}</span>
        <span className="text-base leading-normal text-body">{body}</span>
      </div>
    </article>
  );
}
