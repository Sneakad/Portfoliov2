// Nav + footer for the Simple view: white page, narrow column, your accent as highlight.
import Link from 'next/link';
import { ArrowUpRight, FileText, Github, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import LogoMark from '@/components/home/LogoMark';
import ModeToggle from '@/components/home/ModeToggle';
import { site } from '@/data/home';
import { seo } from '@/data/seo';

export const SOCIALS = [
  { label: 'GitHub', handle: 'Sneakad', href: site.github, Icon: Github },
  { label: 'LinkedIn', handle: 'aditya-mondal2', href: site.linkedin, Icon: Linkedin },
  { label: 'X / Twitter', handle: '@sneakad4', href: site.twitter, Icon: Twitter },
  { label: 'Discord', handle: 'sneakad', href: site.discord, Icon: MessageCircle },
];

export function SimpleNav({ home = true }: { home?: boolean }) {
  const base = home ? '' : '/';
  return (
    <header className="sticky top-0 z-40 border-b border-[#EEEEEE] bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[720px] items-center justify-between gap-4 px-5">
        <Link href={home ? '#s-top' : '/'} className="flex min-h-11 min-w-11 items-center gap-2.5 font-semibold tracking-tight">
          <LogoMark size={28} className="rounded-md" />
          <span className="hidden sm:inline">Aditya Mondal</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm text-[#555]">
          <a href={`${base}#s-work`} className="hidden rounded-md px-2.5 py-1.5 hover:bg-[#F4F4F4] hover:text-ink sm:block">Work</a>
          <a href={`${base}#s-projects`} className="hidden rounded-md px-2.5 py-1.5 hover:bg-[#F4F4F4] hover:text-ink sm:block">Projects</a>
          <a href={home ? '#s-contact' : '#s-contact'} className="rounded-md px-2.5 py-1.5 hover:bg-[#F4F4F4] hover:text-ink">Contact</a>
          <span className="ml-2.5">
            <ModeToggle from="simple" />
          </span>
        </nav>
      </div>
    </header>
  );
}

export function SimpleFooter() {
  return (
    <footer className="border-t border-[#EEEEEE]">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 px-5 py-12">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold tracking-tight">Find me elsewhere</p>
          <p className="text-[15px] text-[#666]">Say hi on any of these, or use the form above.</p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SOCIALS.map(({ label, handle, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-[#EEEEEE] px-4 py-3 transition-colors hover:border-ink hover:bg-acc/25"
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                <span className="flex flex-col leading-tight">
                  <span className="text-[15px] font-medium">{label}</span>
                  <span className="text-[13px] text-[#777]">{handle}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-[#999] transition-colors group-hover:text-ink" />
              </a>
            </li>
          ))}
          {site.showResume && (
          <li className="sm:col-span-2">
            <a
              href={site.resumeUrl}
              className="group flex items-center gap-3 rounded-xl border border-ink bg-ink px-4 py-3 text-white transition-colors hover:bg-acc hover:text-ink"
            >
              <FileText aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              <span className="text-[15px] font-medium">Download résumé</span>
              <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4" />
            </a>
          </li>
          )}
        </ul>
        <p className="text-[14px] leading-relaxed text-[#666]">{seo.bio}</p>
        <div className="flex flex-wrap justify-between gap-2 text-[13px] text-[#888]">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
