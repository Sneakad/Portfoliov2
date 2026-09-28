// Project case-study pages: /projects/moneysense, /projects/lern, /projects/codz, /projects/storz
// Content lives in data/home.ts (homeProjects[].detail).

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/home/SiteHeader';
import ProjectCover from '@/components/home/ProjectCover';
import ContactForm from '@/components/home/ContactForm';
import { homeProjects, site } from '@/data/home';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return homeProjects.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = homeProjects.find((x) => x.id === slug);
  if (!p) return {};
  return { title: `${p.name} — Aditya Mondal`, description: p.description };
}

function Head({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-ink">{n}</span>
      <h2 className="font-pixel text-[32px] leading-[1.05] md:text-[40px]">{title}</h2>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = homeProjects.findIndex((x) => x.id === slug);
  if (i < 0) notFound();
  const p = homeProjects[i];
  const d = p.detail;
  const next = homeProjects[(i + 1) % homeProjects.length];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader page="project" />

      <div className="border-b border-ink">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 font-mono text-xs uppercase tracking-[0.08em] md:px-10">
          <Link href="/#projects" className="u-link">← All projects</Link>
          <span className="hidden text-muted-ink sm:inline">Case study {p.n} / 0{homeProjects.length} · {p.tag}</span>
        </div>
      </div>

      {/* ---------- Title ---------- */}
      <section id="top" className="mx-auto flex max-w-[1440px] flex-col gap-9 px-4 pb-12 pt-14 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.08em]">
          <span className="text-muted-ink">[{p.n}]</span>
          {p.badge && <span className="bg-acc px-2 py-1">{p.badge}</span>}
        </div>
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="flex flex-col gap-6">
            <h1 className="font-pixel text-[72px] leading-[0.9] sm:text-[104px] xl:text-[144px]">{p.name}</h1>
            <p className="max-w-[760px] text-xl leading-snug text-body md:text-2xl">{p.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={p.live} target="_blank" rel="noreferrer" className="lift-btn flex h-14 items-center gap-2.5 border border-ink bg-ink px-6 text-base font-medium text-paper">
              Visit live <span aria-hidden="true">↗</span>
            </a>
            {p.code && (
              <a href={p.code} target="_blank" rel="noreferrer" className="lift-btn flex h-14 items-center gap-2.5 border border-ink px-6 text-base font-medium">
                Code <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <dl className="grid grid-cols-2 border-y border-ink md:grid-cols-4">
          {d.meta.map((m) => (
            <div key={m.k} className="flex flex-col gap-2 py-5 pr-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink">{m.k}</dt>
              <dd className="text-lg font-medium">{m.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Live cover ---------- */}
      <figure className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 md:px-10">
        <div className="border border-ink">
          <div className="flex h-8 items-center justify-between bg-ink px-3 font-mono text-[11px] tracking-[0.06em] text-paper">
            <span>fig.{p.n} — {p.id}.dith — <span className="hidden sm:inline">interactive · move to disperse, click to play</span><span className="sm:hidden">tap to play</span></span>
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-[9px] w-[9px] border border-paper" />
              <span className="h-[9px] w-[9px] border border-paper" />
              <span className="h-[9px] w-[9px] bg-acc" />
            </span>
          </div>
          <div className="h-[320px] sm:h-[440px] lg:h-[560px]">
            <ProjectCover kind={p.slug} label={p.coverLabel} height="100%" interactive />
          </div>
        </div>
        <figcaption className="font-mono text-xs tracking-[0.04em] text-muted-ink">↳ {d.caption} {d.play}</figcaption>
      </figure>

      {/* ---------- Story ---------- */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-20 px-4 pt-24 md:gap-24 md:px-10 md:pt-32">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <Head n="01" title="The problem" />
          <p className="max-w-[760px] text-xl leading-relaxed text-body md:text-[22px]">{d.problem}</p>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <Head n="02" title="What I built" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {d.features.map((f, k) => (
              <article key={f.t} className="lift-card flex min-h-[200px] flex-col border border-ink bg-paper">
                <div className="flex h-7 items-center justify-between bg-ink px-2.5 font-mono text-[11px] tracking-[0.06em] text-paper">
                  <span>0{k + 1}</span>
                  <span aria-hidden="true" className="h-2 w-2 bg-acc" />
                </div>
                <div className="flex flex-col gap-2.5 p-5">
                  <h3 className="text-[22px] font-semibold">{f.t}</h3>
                  <p className="text-base leading-normal text-body">{f.b}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <Head n="03" title="How it works" />
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)_48px_minmax(0,1fr)] md:gap-0">
              <div className="flex flex-col gap-1.5 border border-ink p-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink">Client</span>
                <span className="text-xl font-semibold">{d.arch.client}</span>
              </div>
              <span aria-hidden="true" className="text-center font-mono text-lg">→</span>
              <div className="flex flex-col gap-1.5 border border-ink bg-acc p-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em]">API</span>
                <span className="text-xl font-semibold">{d.arch.api}</span>
              </div>
              <span aria-hidden="true" className="text-center font-mono text-lg">→</span>
              <div className="flex flex-col gap-1.5 border border-ink bg-ink p-5 text-paper">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B4B3AB]">{d.arch.coreLabel}</span>
                <span className="text-xl font-semibold">{d.arch.core}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)_48px_minmax(0,1fr)]">
              <span className="hidden md:block" />
              <span className="hidden md:block" />
              <div className="flex flex-col items-center gap-2">
                <span aria-hidden="true" className="font-mono text-lg">↓</span>
                <div className="flex flex-col gap-1.5 self-stretch border border-ink p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink">Store</span>
                  <span className="text-xl font-semibold">{d.arch.store}</span>
                </div>
              </div>
            </div>
            <p className="border border-dashed border-[#8A8980] px-[18px] py-4 font-mono text-[13px] leading-relaxed text-muted-ink">{d.decision}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
          <Head n="04" title="Outcome" />
          <div className="grid grid-cols-1 border-t border-ink sm:grid-cols-3">
            {d.outcome.map((o) => (
              <div key={o.k} className="flex flex-col gap-2 pr-6 pt-6">
                <span className="font-pixel text-[30px] leading-[1.1]">{o.k}</span>
                <span className="text-base leading-normal text-body">{o.v}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---------- Contact + next ---------- */}
      <section id="contact" className="mt-32 scroll-mt-20 bg-ink text-paper md:mt-36">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-4 pb-10 pt-20 md:px-10 md:pt-24">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16">
            <div className="flex flex-col gap-8">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#B4B3AB]">Contact</span>
              <h2 className="font-pixel text-[44px] leading-none md:text-[72px]">
                Want something like {p.name} built? <span className="text-acc">Let’s talk.</span>
              </h2>
              <ContactForm topic={p.name} />
            </div>
            <Link
              href={`/projects/${next.id}`}
              className="lift-btn-dark flex flex-col gap-4 border border-paper p-7 lg:mt-14"
            >
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#B4B3AB]">Next project · {next.n}</span>
              <span className="font-pixel text-[48px] leading-none md:text-[64px]">{next.name} →</span>
              <span className="text-base leading-normal text-[#B4B3AB]">{next.description}</span>
            </Link>
          </div>
          <footer className="flex flex-wrap justify-between gap-3 border-t border-[#3A3934] pt-5 font-mono text-xs text-[#B4B3AB]">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <Link href="/" className="hover:bg-acc hover:text-ink">Back to home</Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
