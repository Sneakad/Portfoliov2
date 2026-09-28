// Dithered home (ported from Claude Design "Home v7").
// Server component: content comes from data/home.ts, canvases are small client components.
// The previous home lives in git history (components/* are untouched).

import KeycapCanvas from '@/components/home/KeycapCanvas';
import ProjectCover from '@/components/home/ProjectCover';
import SignalStrip from '@/components/home/SignalStrip';
import WinCard from '@/components/home/WinCard';
import ContactForm from '@/components/home/ContactForm';
import SiteHeader from '@/components/home/SiteHeader';
import Link from 'next/link';
import Image from 'next/image';
import { site, timeline, roles, homeProjects, wins, stack, howIWork } from '@/data/home';


function SectionHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
      <h2 className="flex items-baseline gap-4 font-pixel text-[40px] leading-none md:text-[56px]">
        <span className="font-mono text-sm tracking-[0.08em] text-muted-ink">{n}</span>
        {title}
      </h2>
      {note && <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-ink simple:hidden">{note}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <SiteHeader page="home" />

      {/* ---------- Hero ---------- */}
      <section id="top" className="scroll-mt-16 border-b border-ink">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_620px] simple:lg:grid-cols-1">
          <div className="flex flex-col justify-center gap-7 px-4 py-14 md:px-10 lg:py-20">
            <span className="inline-flex items-center gap-2 self-start border border-ink bg-paper px-2.5 py-1 font-mono text-xs uppercase tracking-[0.08em]">
              <span className="h-2 w-2 animate-pulse bg-acc outline outline-1 outline-ink" />
              {site.status}
            </span>
            <h1 className="font-pixel text-[64px] leading-[0.92] tracking-[-0.01em] sm:text-[88px] xl:text-[108px]">
              Aditya
              <br />
              Mondal
            </h1>
            <p className="max-w-[560px] text-xl leading-snug text-body md:text-[22px]">
              {site.headline}{' '}
              <span className="bg-acc px-1 text-ink">{site.headlineHighlight}</span>.
            </p>
            <p className="font-mono text-[13px] text-muted-ink">
              Shipped at <span className="text-ink">{site.shippedAt.join(' · ')}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={site.resumeUrl} className="lift-btn border border-ink bg-ink px-5 py-3 text-[15px] font-semibold text-paper">
                Résumé ↓
              </a>
              <a href={site.github} target="_blank" rel="noreferrer" className="lift-btn border border-ink bg-paper px-5 py-3 text-[15px] font-semibold">
                GitHub ↗
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="lift-btn border border-ink bg-paper px-5 py-3 text-[15px] font-semibold">
                LinkedIn ↗
              </a>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-ink">
              3 hackathon wins · {site.location} · {site.relocation}
            </p>
          </div>

          <div className="flex flex-col border-t border-ink lg:border-l lg:border-r lg:border-t-0 simple:hidden">
            <div className="relative h-[420px] sm:h-[520px] lg:h-full lg:min-h-[620px]">
              <KeycapCanvas className="absolute inset-0 h-full w-full" />
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-ink px-4 py-3 font-mono text-[11px] tracking-[0.04em] text-muted-ink">
              <span>↳ 14 keys typing on their own — code pops out</span>
              <span>Hover: lift a key · Click: press it</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How I work (right under the hero: recruiters read this first) ---------- */}
      <section id="about" className="scroll-mt-16 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 pt-20 md:px-10 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-ink">00 — How I work</span>
          <h2 className="font-pixel text-[40px] leading-[1.02] md:text-[48px]">{howIWork.title}</h2>
          <p className="text-lg leading-relaxed text-body">{howIWork.intro}</p>
          <div className="grid grid-cols-2 border-t border-ink">
            <div className="flex flex-col gap-1.5 pr-4 pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink">Based in</span>
              <span className="text-[17px]">{site.location}</span>
            </div>
            <div className="flex flex-col gap-1.5 border-l border-ink pl-4 pt-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink">Open to</span>
              <span className="text-[17px]">{site.relocation}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 content-end gap-5 md:grid-cols-3">
          {howIWork.principles.map((pr, i) => (
            <article key={pr.t} className="lift-card flex flex-col border border-ink bg-paper">
              <div className="flex h-7 items-center justify-between bg-ink px-2.5 font-mono text-[11px] tracking-[0.06em] text-paper">
                <span>0{i + 1}</span>
                <span aria-hidden="true" className="h-2 w-2 bg-acc" />
              </div>
              <div className="flex flex-col gap-2.5 p-[22px]">
                <h3 className="font-pixel text-[26px] leading-[1.05]">{pr.t}</h3>
                <p className="text-base leading-normal text-body">{pr.b}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Experience ---------- */}
      <section id="experience" className="scroll-mt-16 mx-auto max-w-[1440px] px-4 py-20 md:px-10">
        <SectionHead n="01" title="Experience" note="5 roles · 1 open slot" />
        <div className="mt-10">
          <div className="simple:hidden">
            <SignalStrip segments={timeline} />
          </div>
        </div>
        <div className="mt-10 border-t border-ink">
          <a
            href="#contact"
            className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-4 border-b border-ink bg-acc px-2 py-5 md:grid-cols-[64px_160px_minmax(0,1fr)_auto]"
          >
            <span className="font-mono text-sm">Next</span>
            <span className="hidden font-mono text-sm md:block">2026 —</span>
            <span className="text-lg font-semibold md:text-xl">Software Engineer · AI Engineer — your team?</span>
            <span className="col-span-2 font-mono text-xs uppercase tracking-[0.08em] md:col-span-1">Open to work →</span>
          </a>
          {roles.map((r) => (
            <div
              key={r.n}
              className="row-hover grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 border-b border-ink px-2 py-5 md:grid-cols-[64px_160px_minmax(0,1fr)_auto]"
            >
              <span className="font-mono text-sm text-muted-ink">{r.n}</span>
              <span className="hidden font-mono text-sm md:block">{r.when}</span>
              <span className="text-lg md:text-xl">
                <span className="font-semibold">{r.title}</span>
                <span className="text-muted-ink"> — {r.org}</span>
              </span>
              <span className="col-start-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-ink md:col-start-auto">
                <span className="md:hidden">{r.when} · </span>
                {r.kind}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects" className="scroll-mt-16 mx-auto max-w-[1440px] px-4 py-20 md:px-10">
        <SectionHead n="02" title="Projects" note="Hover a cover to run it" />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {homeProjects.map((p) => (
            <article key={p.slug} className="lift-card flex flex-col border border-ink bg-paper">
              <div className="flex h-10 items-center justify-between bg-ink px-4 font-mono text-xs tracking-[0.06em] text-paper">
                <span>
                  {p.n} / {p.name.toLowerCase()}
                </span>
                <span>{p.tag}</span>
              </div>
              <div className="border-b border-ink simple:hidden">
                <ProjectCover kind={p.slug} label={p.coverLabel} />
              </div>
              <div className="relative hidden aspect-[16/10] overflow-hidden border-b border-ink simple:block">
                <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-pixel text-[34px] leading-none">{p.name}</h3>
                  {p.badge && (
                    <span className="bg-acc px-[7px] py-[3px] font-mono text-[11px] uppercase tracking-[0.08em]">{p.badge}</span>
                  )}
                </div>
                <p className="text-base leading-normal text-body">{p.description}</p>
                <p className="font-mono text-xs text-muted-ink">{p.stack}</p>
                <div className="mt-auto flex flex-wrap gap-5 pt-2 font-mono text-[13px]">
                  <Link href={`/projects/${p.id}`} className="u-link">
                    Case study →
                  </Link>
                  <a href={p.live} target="_blank" rel="noreferrer" className="u-link">
                    Live ↗
                  </a>
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noreferrer" className="u-link">
                      Code ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Wins ---------- */}
      <section id="wins" className="scroll-mt-16 mx-auto max-w-[1440px] px-4 py-20 md:px-10">
        <SectionHead n="03" title="Wins" note="Hover to celebrate" />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {wins.map((w) => (
            <WinCard key={w.title} {...w} />
          ))}
        </div>
      </section>

      {/* ---------- Stack ---------- */}
      <section id="stack" className="scroll-mt-16 mx-auto max-w-[1440px] px-4 py-20 md:px-10">
        <SectionHead n="04" title="Stack" note={howIWork.now} />
        <dl className="mt-10 border-t border-ink">
          {stack.map((s) => (
            <div key={s.k} className="row-hover grid grid-cols-[130px_minmax(0,1fr)] gap-4 border-b border-ink px-2 py-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted-ink">{s.k}</dt>
              <dd className="text-lg">
                {s.highlight ? <span className="bg-acc px-1">{s.v}</span> : s.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="scroll-mt-16 bg-ink text-paper">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-20 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#8A8980]">05 — Contact</p>
          <h2 className="max-w-[980px] font-pixel text-[44px] leading-[1.02] md:text-[72px]">
            Hiring a software engineer? <span className="bg-acc px-2 text-ink">Let’s talk.</span>
          </h2>
          <ContactForm />
          <div className="flex flex-wrap gap-3">
            <a href={site.resumeUrl} className="lift-btn-dark border border-paper bg-paper px-5 py-3 text-[15px] font-semibold text-ink">
              Résumé ↓
            </a>
          </div>
          <div className="grid grid-cols-2 border-t border-l border-[#3A3934] font-mono text-sm md:grid-cols-4">
            {[
              { k: 'GitHub', href: site.github },
              { k: 'LinkedIn', href: site.linkedin },
              { k: 'Twitter / X', href: site.twitter },
              { k: 'Discord', href: site.discord },
            ].map((s) => (
              <a
                key={s.k}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-r border-b border-[#3A3934] px-4 py-5 hover:bg-acc hover:text-ink"
              >
                {s.k} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <footer className="flex flex-wrap justify-between gap-3 font-mono text-xs text-[#8A8980]">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <span>Dithered by hand · Next.js · Geist Pixel</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
