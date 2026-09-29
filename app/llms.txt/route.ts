// /llms.txt (llmstxt.org): a plain-Markdown brief for AI agents, built from the same data as the pages.
import { filled, homeProjects, howIWork, roles, site, stack, wins } from '@/data/home';
import { SITE_URL, projectUrl, seo } from '@/data/seo';

export const dynamic = 'force-static';

function body() {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${seo.bio}`,
    '',
    `${howIWork.intro}`,
    '',
    `- Location: ${site.location}`,
    `- Status: ${site.status}`,
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- LinkedIn: ${site.linkedin}`,
    `- X / Twitter: ${site.twitter}`,
    '',
    '## Experience',
    '',
    ...roles.map((r) => `- ${r.title}, ${r.org} (${r.when.replace(' — ', '–')}) — ${r.kind}`),
    '',
    '## Projects',
    '',
    ...homeProjects.map((p) => `- [${p.name}](${projectUrl(p)}): ${p.description} Stack: ${p.stack}. Live: ${p.live}${p.code ? `. Code: ${p.code}` : ''}`),
    '',
    '## Awards',
    '',
    ...wins.map((w) => `- ${w.badge}, ${w.title}: ${w.body}`),
    '',
    '## Skills',
    '',
    ...stack.map((s) => `- ${s.k}: ${s.v}`),
    '',
    '## How I work',
    '',
    ...howIWork.principles.map((pr) => `- ${pr.t}: ${pr.b}`),
    '',
  ];

  for (const p of homeProjects) {
    const d = p.detail;
    lines.push(
      `## Case study: ${p.name}`,
      '',
      `URL: ${projectUrl(p)}`,
      '',
      ...d.meta.filter((m) => filled(m.v)).map((m) => `- ${m.k}: ${m.v}`),
      '',
      `Problem: ${d.problem}`,
      '',
      ...d.features.map((f) => `- ${f.t}: ${f.b}`),
      '',
      `Outcome: ${d.outcome.map((o) => `${o.k} (${o.v})`).join('; ')}`,
      '',
    );
  }

  lines.push('## Optional', '', `- [Home](${SITE_URL}): full portfolio page`, `- [Sitemap](${SITE_URL}/sitemap.xml)`, '');
  return lines.join('\n');
}

export function GET() {
  return new Response(body(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
