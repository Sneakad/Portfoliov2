export interface ContributionDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
export interface Contributions { days: ContributionDay[]; total: number }

/**
 * A user's last-year contribution calendar, read from GitHub's public profile graph (the same
 * HTML the profile page loads), so no token is needed. Private contributions are included when
 * "show private contributions" is on in the GitHub profile settings.
 *
 * Revalidates hourly: pages using it are served from cache and rebuilt in the background at most
 * once an hour. Returns null if GitHub is unreachable or the markup changes, so callers can hide.
 */
export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'text/html' },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // tooltips are separate elements pointing at each day cell: "12 contributions on May 2nd." / "No contributions on …"
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const n = m[2].match(/^(\d[\d,]*) contributions?/);
      counts.set(m[1], n ? Number(n[1].replace(/,/g, '')) : 0);
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td\b[^>]*\bContributionCalendar-day\b[^>]*>/g)) {
      const tag = m[0];
      const date = tag.match(/data-date="([^"]+)"/)?.[1];
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
      if (!date) continue;
      days.push({ date, count: (id && counts.get(id)) || 0, level: Math.min(4, Math.max(0, level)) as ContributionDay['level'] });
    }
    if (days.length < 7) return null;

    days.sort((a, b) => a.date.localeCompare(b.date));
    return { days, total: days.reduce((s, d) => s + d.count, 0) };
  } catch {
    return null;
  }
}
