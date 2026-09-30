'use client';

import { useId, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { sendEmail } from '@/actions/sendEmail';

/** Reuses the existing Resend server action, so your email address never appears in the page source. */
export default function ContactForm({ topic, variant = 'dark' }: { topic?: string; variant?: 'dark' | 'light' } = {}) {
  const [pending, setPending] = useState(false);
  const id = useId();
  const light = variant === 'light';
  const field = light
    ? 'rounded-lg border border-[#E5E5E5] bg-white px-4 text-[15px] text-ink placeholder:text-[#9A9A9A] focus:border-ink focus:outline-none'
    : 'border border-paper bg-transparent px-4 font-mono text-[15px] text-paper placeholder:text-[#8A8980] focus:outline-none focus:ring-2 focus:ring-acc';

  return (
    <form
      className="grid w-full max-w-[760px] grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
      action={async (formData) => {
        setPending(true);
        const res = await sendEmail(formData);
        setPending(false);
        if (res && 'error' in res && res.error) { toast.error(String(res.error)); return; }
        toast.success('Sent! I’ll reply soon.');
      }}
    >
      <Toaster position="bottom-center" />
      {topic && <input type="hidden" name="topic" value={topic} />}
      <label className="sr-only" htmlFor={`${id}-email`}>Your email</label>
      <input
        id={`${id}-email`}
        name="senderEmail"
        type="email"
        required
        maxLength={500}
        placeholder="you@company.com"
        className={`h-14 ${field}`}
      />
      <button
        type="submit"
        disabled={pending}
        className={`order-last flex h-full min-h-14 items-center justify-center gap-3 bg-acc px-7 sm:order-none sm:row-span-2 sm:justify-start text-[17px] font-semibold text-ink disabled:opacity-60 ${light ? 'rounded-lg transition-colors hover:bg-ink hover:text-paper' : 'lift-btn-dark'}`}
      >
        <span>{pending ? 'Sending…' : 'Send'}</span>
        <span aria-hidden="true">→</span>
      </button>
      <label className="sr-only" htmlFor={`${id}-msg`}>Message</label>
      <textarea
        id={`${id}-msg`}
        name="message"
        required
        maxLength={5000}
        rows={2}
        placeholder={topic ? `Building something like ${topic}? Tell me about it.` : 'What are you building? A role, a project, an idea…'}
        className={`resize-none py-3 ${field}`}
      />
    </form>
  );
}
