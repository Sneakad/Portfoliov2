'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Email tile for the contact links: the address opens a mail app, the button copies it. */
export default function EmailTile({ email, className = '' }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // clipboard blocked (insecure context / permissions): fall back to a hidden textarea
      const t = document.createElement('textarea');
      t.value = email;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-stretch border-r border-b border-[#3A3934] ${className}`}>
      <a href={`mailto:${email}`} className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-5 hover:bg-acc hover:text-ink">
        <span className="truncate">{email}</span>
        <span aria-hidden="true">↗</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
        className="flex w-14 shrink-0 items-center justify-center gap-1.5 border-l border-[#3A3934] hover:bg-acc hover:text-ink sm:w-auto sm:px-4"
      >
        {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
        <span className="hidden text-xs uppercase tracking-[0.08em] sm:inline">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <span aria-live="polite" className="sr-only">{copied ? 'Copied to clipboard' : ''}</span>
    </div>
  );
}
