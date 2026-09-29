// Simple view of the home page: white, one narrow readable column, accent used only for highlights.
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ContactForm from '@/components/home/ContactForm';
import GithubGraph from '@/components/home/GithubGraph';
import { SimpleFooter, SimpleNav } from './SimpleChrome';
import { homeProjects, howIWork, roles, site, stack, wins } from '@/data/home';

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-2 py-0.5 text-[12px] text-[#555]">{children}</span>
);

export default function SimpleHome() {
  const skills = stack.flatMap((s) => s.v.split(' · ').filter((x) => !x.includes(':')));
  return (
    <div className="min-h-screen bg-white text-ink">
      <SimpleNav />
      <main id="s-top" className="mx-auto flex max-w-[720px] flex-col gap-16 px-5 pb-20 pt-14">
        {/* Intro */}
        <section className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#EAEAEA] px-3 py-1 text-[13px] text-[#555]">
            <span className="h-2 w-2 rounded-full bg-acc ring-1 ring-ink/40" />
            Open to work · {site.location}
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hi, I’m Aditya Mondal</h1>
          <p className="text-lg leading-relaxed text-[#444]">
            {site.headline} <span className="rounded bg-acc px-1 text-ink">{site.headlineHighlight}</span>.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a href="#s-contact" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-acc hover:text-ink">
              Get in touch
            </a>
            {site.showResume && (
              <a href={site.resumeUrl} className="rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium transition-colors hover:border-ink">
                Résumé
              </a>
            )}
            <a href={site.github} target="_blank" rel="noreferrer" className="rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium transition-colors hover:border-ink">
              GitHub
            </a>
          </div>
        </section>

        {/* About */}
        <section className="flex flex-col gap-4">
          <H2>About</H2>
          <p className="text-[16px] leading-relaxed text-[#444]">{howIWork.intro}</p>
          <ul className="flex flex-col gap-2.5">
            {howIWork.principles.map((p) => (
              <li key={p.t} className="flex gap-3 text-[15px] leading-relaxed text-[#444]">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>
                  <strong className="font-semibold text-ink">{p.t}.</strong> {p.b}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Work */}
        <section className="flex flex-col gap-5">
          <H2 id="s-work">Work experience</H2>
          <ul className="flex flex-col">
            {roles.map((r) => (
              <li key={r.n} className="flex items-center gap-4 border-b border-[#F0F0F0] py-3.5 last:border-0">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#EAEAEA] bg-[#FAFAFA] text-sm font-semibold">
                  {r.org[0]}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{r.org}</span>
                  <span className="text-[14px] text-[#666]">{r.title}</span>
                </span>
                <span className="ml-auto shrink-0 text-right text-[13px] tabular-nums text-[#777]">{r.when}</span>
              </li>
            ))}
          </ul>
          {site.showGithubGraph && <GithubGraph user={site.githubUser} variant="simple" />}
        </section>

        {/* Projects */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <H2 id="s-projects">Projects</H2>
            <p className="text-[15px] text-[#666]">Things I’ve built and shipped. Two of them won hackathons.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {homeProjects.map((p) => (
              <article key={p.id} className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#EAEAEA] transition-colors hover:border-ink">
                <Link href={`/projects/${p.id}`} className="relative block aspect-[16/10] overflow-hidden border-b border-[#EAEAEA] bg-[#FAFAFA]">
                  <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(min-width: 640px) 340px, 100vw" className="object-cover object-top" />
                </Link>
                <div className="flex flex-1 flex-col gap-2.5 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.badge && <span className="rounded-md bg-acc px-1.5 py-0.5 text-[11px] font-medium">{p.badge}</span>}
                  </div>
                  <p className="text-[14px] leading-relaxed text-[#555]">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.split(' · ').filter((x) => !x.startsWith('[')).map((t) => <Pill key={t}>{t}</Pill>)}
                  </div>
                  <div className="mt-auto flex gap-2 pt-2 text-[13px] font-medium">
                    <Link href={`/projects/${p.id}`} className="rounded-md bg-ink px-3 py-2 text-white hover:bg-acc hover:text-ink">Case study</Link>
                    <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-[#E5E5E5] px-3 py-2 hover:border-ink">
                      Website <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Hackathons */}
        <section className="flex flex-col gap-5">
          <H2>Hackathon wins</H2>
          <ul className="flex flex-col gap-4 border-l border-[#EAEAEA] pl-5">
            {wins.map((w) => (
              <li key={w.title} className="relative flex flex-col gap-1">
                <span aria-hidden="true" className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border border-ink bg-acc" />
                <span className="text-[13px] text-[#777]">{w.badge}</span>
                <span className="font-medium">{w.title}</span>
                <span className="text-[14px] leading-relaxed text-[#555]">{w.body}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section className="flex flex-col gap-4">
          <H2>Skills</H2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className={`rounded-md px-2.5 py-1 text-[13px] ${/Gemini|OpenAI|LangChain/.test(s) ? 'bg-acc text-ink' : 'bg-ink text-white'}`}>
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="flex flex-col gap-4">
          <H2 id="s-contact">Get in touch</H2>
          <p className="text-[15px] leading-relaxed text-[#555]">
            Got something to ship? Leave your email and a line about it. Let’s talk!
          </p>
          <ContactForm variant="light" />
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}
