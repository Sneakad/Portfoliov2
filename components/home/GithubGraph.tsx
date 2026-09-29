// GitHub contribution graph in the site's own style. Server component: the data is fetched on the
// server (refreshed hourly, see lib/github.ts) and rendered as plain HTML — no client JS.
import { getContributions, type ContributionDay } from '@/lib/github';
import GraphTooltip from './GraphTooltip';

type Variant = 'dither' | 'simple';

// level 0–4 → cell style: an all-green scale (empty grey → light lime → lime → green → deep green).
// The dithered view uses pixel checkers for the in-between steps.
const LEVEL: Record<Variant, string[]> = {
  dither: ['gh-l0', 'gh-l1', 'bg-acc', 'gh-l3', 'gh-l4'],
  simple: ['rounded-[2px] bg-[#ECECE6]', 'rounded-[2px] bg-acc/45', 'rounded-[2px] bg-acc', 'rounded-[2px] bg-[#7FC23A]', 'rounded-[2px] bg-[#3E7A12]'],
};

const fmt = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const month = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Weeks as columns, Sunday → Saturday down each column, like GitHub's own graph. */
function Cells({ days, lv, tips }: { days: ContributionDay[]; lv: string[]; tips: boolean }) {
  const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay(); // first column can start mid-week
  const weeks = Math.ceil((days.length + pad) / 7);
  return (
    <div
      className={`grid w-full gap-[2px] sm:gap-[3px] ${tips ? 'gh-grid' : ''}`}
      style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))', gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gridAutoFlow: 'column' }}
    >
      {Array.from({ length: pad }, (_, i) => <span key={`p${i}`} aria-hidden="true" />)}
      {days.map((d) => (
        <span
          key={d.date}
          aria-hidden="true"
          data-n={tips ? d.count : undefined}
          data-d={tips ? fmt(d.date) : undefined}
          className={`aspect-square ${lv[d.level]}`}
        />
      ))}
    </div>
  );
}

export default async function GithubGraph({ user, variant = 'dither' }: { user: string; variant?: Variant }) {
  const data = await getContributions(user);
  if (!data) return null; // GitHub unreachable: hide rather than show an empty box

  const { days, total } = data;
  const active = days.filter((d) => d.count > 0).length;
  // last 26 weeks, starting on a Sunday: 25 full weeks plus however much of this week has passed
  const lastDow = new Date(days[days.length - 1].date + 'T00:00:00Z').getUTCDay();
  const recent = days.slice(-(25 * 7 + lastDow + 1));
  const label = `GitHub contribution graph: ${total} contributions in the last year, active on ${active} days.`;
  const dither = variant === 'dither';
  const lv = LEVEL[variant];
  const profile = `https://github.com/${user}`;

  return (
    <figure className={`flex flex-col gap-3 ${dither ? 'border border-ink p-4 md:p-5' : ''}`}>
      <figcaption className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${dither ? 'font-mono text-[11px] uppercase tracking-[0.08em] text-muted-ink' : 'text-sm text-[#666]'}`}>
        <span>
          <span className={dither ? 'text-ink' : 'font-semibold text-ink'}>{total.toLocaleString('en-US')} contributions</span> in the last year · active {active} days
        </span>
        <a href={profile} target="_blank" rel="noreferrer" className={`inline-flex min-h-11 items-center ${dither ? 'u-link text-ink' : 'text-ink hover:underline'}`}>
          GitHub ↗
        </a>
      </figcaption>

      {/* a full year squeezed onto a phone makes ~3px squares, so phones get the last 6 months */}
      <div role="img" aria-label={label} className="hidden sm:block">
        <GraphTooltip variant={variant}>
          <Cells days={days} lv={lv} tips />
        </GraphTooltip>
      </div>
      <div role="img" aria-label={label} className="sm:hidden">
        <Cells days={recent} lv={lv} tips={false} />
      </div>

      <div className={`flex flex-wrap items-center justify-between gap-2 ${dither ? 'font-mono text-[10px] uppercase tracking-[0.08em] text-muted-ink' : 'text-xs text-[#888]'}`}>
        <span>
          <span className="hidden sm:inline">{month(days[0].date)}</span>
          <span className="sm:hidden">{month(recent[0].date)}</span> – {month(days[days.length - 1].date)} · updated hourly
        </span>
        <span aria-hidden="true" className="flex items-center gap-1">
          Less
          {lv.map((c, i) => <span key={i} className={`h-2.5 w-2.5 ${c}`} />)}
          More
        </span>
      </div>
    </figure>
  );
}
