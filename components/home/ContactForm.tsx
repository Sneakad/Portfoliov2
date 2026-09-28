'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { sendEmail } from '@/actions/sendEmail';

/** Reuses the existing Resend server action, so your email address never appears in the page source. */
export default function ContactForm({ topic }: { topic?: string } = {}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid w-full max-w-[760px] grid-cols-[minmax(0,1fr)_auto] gap-3"
      action={async (formData) => {
        setPending(true);
        const res = await sendEmail(formData);
        setPending(false);
        if (res && 'error' in res && res.error) { toast.error(String(res.error)); return; }
        toast.success('Sent — I’ll reply soon.');
      }}
    >
      <Toaster position="bottom-center" />
      {topic && <input type="hidden" name="topic" value={topic} />}
      <label className="sr-only" htmlFor="senderEmail">Your email</label>
      <input
        id="senderEmail"
        name="senderEmail"
        type="email"
        required
        maxLength={500}
        placeholder="you@company.com"
        className="h-14 border border-paper bg-transparent px-4 font-mono text-[15px] text-paper placeholder:text-[#8A8980] focus:outline-none focus:ring-2 focus:ring-acc"
      />
      <button
        type="submit"
        disabled={pending}
        className="lift-btn-dark row-span-2 flex h-full min-h-14 items-center gap-3 bg-acc px-7 text-[17px] font-semibold text-ink disabled:opacity-60"
      >
        <span>{pending ? 'Sending…' : 'Send'}</span>
        <span aria-hidden="true">→</span>
      </button>
      <label className="sr-only" htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        required
        maxLength={5000}
        rows={2}
        placeholder={topic ? `Want something like ${topic} built? Tell me about the role.` : 'What are you hiring for?'}
        className="resize-none border border-paper bg-transparent px-4 py-3 font-mono text-[15px] text-paper placeholder:text-[#8A8980] focus:outline-none focus:ring-2 focus:ring-acc"
      />
    </form>
  );
}
