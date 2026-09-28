// Simple view of a project case study: same content as the dithered page, plain and readable.
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import ContactForm from '@/components/home/ContactForm';
import { SimpleFooter, SimpleNav } from './SimpleChrome';
import type { HomeProject } from '@/data/home';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function SimpleProject({ p, next }: { p: HomeProject; next: HomeProject }) {
  const d = p.detail;
  return (
    <div className="min-h-screen bg-white text-ink">
      <SimpleNav home={false} />
      <main className="mx-auto flex max-w-[720px] flex-col gap-12 px-5 pb-20 pt-10">
        <Link href="/#s-projects" className="inline-flex items-center gap-1.5 self-start text-sm text-[#666] hover:text-ink">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All projects
        </Link>

        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#777]">
            <span>{p.tag}</span>
            {p.badge && <span className="rounded-md bg-acc px-1.5 py-0.5 text-[12px] font-medium text-ink">{p.badge}</span>}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{p.name}</h1>
          <p className="text-lg leading-relaxed text-[#444]">{p.description}</p>
          <div className="flex flex-wrap gap-2.5">
            <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-acc hover:text-ink">
              Visit website <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            {p.code && (
              <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium hover:border-ink">
                Source code <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          </div>
        </header>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
          <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(min-width: 760px) 720px, 100vw" className="object-cover object-top" priority />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-[#EAEAEA] p-5 sm:grid-cols-4">
          {d.meta.map((m) => (
            <div key={m.k} className="flex flex-col gap-1">
              <dt className="text-[12px] uppercase tracking-wide text-[#888]">{m.k}</dt>
              <dd className="text-[14px] font-medium">{m.v}</dd>
            </div>
          ))}
        </dl>

        <Block title="The problem">
          <p className="text-[16px] leading-relaxed text-[#444]">{d.problem}</p>
        </Block>

        <Block title="What I built">
          <ul className="flex flex-col gap-3">
            {d.features.map((f) => (
              <li key={f.t} className="flex gap-3 text-[15px] leading-relaxed text-[#444]">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span><strong className="font-semibold text-ink">{f.t}.</strong> {f.b}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="How it works">
          <div className="flex flex-wrap items-center gap-2 text-[14px]">
            {[
              ['Client', d.arch.client],
              ['API', d.arch.api],
              [d.arch.coreLabel, d.arch.core],
              ['Store', d.arch.store],
            ].map(([k, v], i, arr) => (
              <span key={k} className="flex items-center gap-2">
                <span className={`rounded-lg border px-3 py-1.5 ${i === 1 ? 'border-ink bg-acc' : 'border-[#E5E5E5]'}`}>
                  <span className="text-[#777]">{k}:</span> <span className="font-medium">{v}</span>
                </span>
                {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#AAA]" />}
              </span>
            ))}
          </div>
          <p className="rounded-lg bg-[#FAFAFA] px-4 py-3 text-[14px] leading-relaxed text-[#666]">{d.decision}</p>
        </Block>

        <Block title="Outcome">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {d.outcome.map((o) => (
              <li key={o.k} className="flex flex-col gap-1 rounded-xl border border-[#EAEAEA] p-4">
                <span className="font-semibold">{o.k}</span>
                <span className="text-[14px] text-[#666]">{o.v}</span>
              </li>
            ))}
          </ul>
        </Block>

        <section id="s-contact" className="flex scroll-mt-24 flex-col gap-4 rounded-xl border border-[#EAEAEA] p-5">
          <h2 className="text-xl font-semibold tracking-tight">Want something like {p.name} built?</h2>
          <p className="text-[15px] text-[#555]">Leave your email and a line about the role — I’ll get back to you.</p>
          <ContactForm topic={p.name} variant="light" />
        </section>

        <Link href={`/projects/${next.id}`} className="group flex items-center justify-between rounded-xl border border-[#EAEAEA] p-5 transition-colors hover:border-ink hover:bg-acc/25">
          <span className="flex flex-col gap-1">
            <span className="text-[13px] text-[#777]">Next project</span>
            <span className="text-lg font-semibold">{next.name}</span>
          </span>
          <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </main>
      <SimpleFooter />
    </div>
  );
}
