// Architecture diagram for a case study, drawn in HTML so it reflows instead of shrinking.
// Desktop: three lanes (Frontend · Backend · Services), one row per thing a user does, with
// labelled arrows between lanes. Phone: each row becomes a card that reads top to bottom.
import type { ArchFlow, ArchLink } from '@/data/home';

type Variant = 'dither' | 'simple';

const STYLE = {
  dither: {
    card: 'border border-ink bg-paper',
    lane: 'md:border-x md:border-ink md:bg-[#E9E8E0]',
    laneHead: 'border border-ink bg-ink text-paper',
    feature: 'border border-ink bg-paper',
    step: 'border border-ink bg-ink text-paper',
    service: 'border border-ink bg-acc',
    via: 'border border-ink bg-acc',
    line: 'bg-ink',
    headR: 'border-l-ink', // forward arrowhead
    headL: 'border-r-ink', // return arrowhead
    laneEnd: 'md:border-b md:border-ink',
    muted: 'text-muted-ink',
  },
  simple: {
    card: 'rounded-xl border border-[#EAEAEA] bg-white',
    lane: 'md:bg-[#F6F6F6]',
    laneHead: 'rounded-lg bg-[#F1F1F1] text-ink',
    feature: 'rounded-lg border border-[#E5E5E5] bg-white',
    step: 'rounded-md bg-ink text-white',
    service: 'rounded-lg border border-ink/10 bg-acc',
    via: 'rounded-md bg-acc',
    line: 'bg-[#9A9A9A]',
    headR: 'border-l-[#9A9A9A]',
    headL: 'border-r-[#9A9A9A]',
    laneEnd: 'md:rounded-b-xl',
    muted: 'text-[#777]',
  },
} as const;

type S = (typeof STYLE)[Variant];

/** One labelled arrow. Desktop draws a line with a head; phones get a ↓/↑ glyph with the label. */
function Arrow({ label, back, s }: { label?: string; back?: boolean; s: S }) {
  return (
    <>
      <span className="hidden w-full flex-col gap-1 md:flex">
        {label && <span className={`text-center font-mono text-[10px] uppercase leading-tight tracking-[0.06em] ${s.muted}`}>{label}</span>}
        <span className={`relative block h-[2px] ${s.line}`}>
          <span
            className={`absolute top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-y-transparent ${
              back ? `left-0 -translate-x-1 border-r-[8px] ${s.headL}` : `right-0 translate-x-1 border-l-[8px] ${s.headR}`
            }`}
          />
        </span>
      </span>
      {label && (
        <span className={`font-mono text-[11px] uppercase tracking-[0.06em] md:hidden ${s.muted}`}>
          <span aria-hidden="true" className="mr-1.5 text-ink">{back ? '↑' : '↓'}</span>
          {label}
        </span>
      )}
    </>
  );
}

function Link({ link, s }: { link?: ArchLink; s: S }) {
  if (!link) return <span className="hidden md:block" />;
  return (
    <div className="flex flex-col items-start justify-center gap-2 py-1 md:items-stretch md:gap-3 md:px-3 md:py-4">
      {link.via && (
        <span className={`self-start px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] md:self-center ${s.via}`}>
          via {link.via}
        </span>
      )}
      <Arrow label={link.to} s={s} />
      {link.back && <Arrow label={link.back} back s={s} />}
    </div>
  );
}

const MiniLabel = ({ children, s }: { children: string; s: S }) => (
  <span className={`font-mono text-[10px] uppercase tracking-[0.08em] md:hidden ${s.muted}`}>{children}</span>
);

function sentence(f: ArchFlow) {
  const parts = [`${f.feature}: the frontend sends “${f.link.to}”${f.link.via ? ` via ${f.link.via}` : ''}`];
  if (f.backend) parts.push(`the backend does: ${f.backend.join(', then ')}`);
  if (f.service) parts.push(`${f.backend ? 'it talks to' : 'straight to'} ${f.service}${f.out ? ` (“${f.out.to}”${f.out.back ? `, gets back “${f.out.back}”` : ''})` : ''}`);
  if (f.link.back) parts.push(`the user gets back “${f.link.back}”`);
  return parts.join('; ') + '.';
}

export default function ArchDiagram({ flows, name, variant = 'dither' }: { flows: ArchFlow[]; name: string; variant?: Variant }) {
  const s = STYLE[variant];
  const cols = 'md:grid-cols-[minmax(0,1fr)_minmax(104px,0.75fr)_minmax(0,1fr)_minmax(104px,0.75fr)_minmax(0,0.85fr)]';

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="sr-only">Architecture of {name}, one row per user action.</figcaption>
      <ol className="sr-only">
        {flows.map((f) => <li key={f.feature}>{sentence(f)}</li>)}
      </ol>

      <div aria-hidden="true" className={`grid grid-cols-1 gap-3 md:gap-x-0 md:gap-y-0 ${cols}`}>
        {/* lane headers (desktop) */}
        {['Frontend', '', 'Backend', '', 'Services'].map((h, i) =>
          h ? (
            <span key={h} className={`hidden px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] md:block ${s.laneHead}`}>
              {h}
            </span>
          ) : (
            <span key={i} className="hidden md:block" />
          ),
        )}

        {flows.map((f, k) => {
          const lane = `${s.lane} ${k === flows.length - 1 ? s.laneEnd : ''}`;
          return (
          <div key={f.feature} className={`flex flex-col gap-2.5 p-4 md:contents ${s.card}`}>
            {/* frontend */}
            <div className={`flex flex-col gap-1.5 md:justify-center md:px-4 md:py-4 ${lane}`}>
              <MiniLabel s={s}>{`0${k + 1} · Frontend`}</MiniLabel>
              <span className={`px-3 py-2.5 text-[15px] font-semibold leading-snug ${s.feature}`}>{f.feature}</span>
            </div>

            <Link link={f.link} s={s} />

            {/* backend */}
            <div className={`flex flex-col justify-center gap-1.5 md:px-4 md:py-4 ${lane}`}>
              {f.backend ? (
                <>
                  <MiniLabel s={s}>Backend</MiniLabel>
                  {f.backend.map((b, i) => (
                    <div key={b} className="flex flex-col items-start gap-1.5 md:items-center">
                      {i > 0 && <span className={`font-mono text-xs leading-none ${s.muted}`}>↓</span>}
                      <span className={`w-full px-2.5 py-1.5 font-mono text-xs md:text-center ${s.step}`}>{b}</span>
                    </div>
                  ))}
                </>
              ) : (
                // no backend hop: the frontend calls the service directly
                <span className={`hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] md:flex ${s.muted}`}>
                  <span className={`h-[2px] flex-1 ${s.line} opacity-40`} />
                  direct
                  <span className={`h-[2px] flex-1 ${s.line} opacity-40`} />
                </span>
              )}
            </div>

            {f.backend ? <Link link={f.out} s={s} /> : f.service ? <div className="hidden items-center md:flex md:px-3"><Arrow s={s} /></div> : <span className="hidden md:block" />}

            {/* service */}
            <div className="flex flex-col gap-1.5 md:justify-center md:py-4">
              {f.service && (
                <>
                  <MiniLabel s={s}>{f.backend ? 'Service' : 'Service · called directly'}</MiniLabel>
                  <span className={`px-3 py-2.5 text-[15px] font-semibold leading-snug ${s.service}`}>{f.service}</span>
                </>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </figure>
  );
}
