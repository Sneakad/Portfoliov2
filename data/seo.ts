// Search + AI-crawler facts shared by metadata, JSON-LD, sitemap and /llms.txt.
// Keep this factual and in sync with data/home.ts — it is what search engines and LLMs quote.

import { roles, site, stack, wins, type HomeProject } from '@/data/home';

export const SITE_URL = 'https://adityamondal.vercel.app';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const seo = {
  title: 'Aditya Mondal | Software Engineer & AI Engineer',
  shortTitle: 'Aditya Mondal',
  jobTitle: 'Software Engineer',
  handle: 'Sneakad',
  twitterHandle: '@sneakad4',
  // One quotable, third-person sentence: the entity definition search engines and LLMs pick up.
  bio: 'Aditya Mondal is a software engineer and AI engineer from India who builds full-stack web products with generative AI, most recently as a Software Engineer at Miivo AI.',
  description:
    'Aditya Mondal is a software engineer and AI engineer from India building full-stack products with generative AI. Experience at Miivo AI, OtherwiseAI and Boringmarketing, case studies and hackathon wins.',
  keywords: [
    'Aditya Mondal',
    'Sneakad',
    'software engineer',
    'AI engineer',
    'full-stack developer',
    'generative AI',
    'Next.js developer',
    'TypeScript',
    'LLM applications',
    'portfolio',
    'India',
  ],
};

/** Every skill listed in the Stack section, flattened ("Figma — …" becomes "Figma"). */
export const skills = [...new Set(stack.flatMap((s) => s.v.split(' · ').map((x) => x.split(':')[0].trim())))];

const APP_CATEGORY: Record<string, string> = {
  moneysense: 'FinanceApplication',
  lern: 'EducationalApplication',
  codz: 'DeveloperApplication',
  storz: 'UtilitiesApplication',
};

export const projectUrl = (p: HomeProject) => `${SITE_URL}/projects/${p.id}`;

/** schema.org node for a project; `author` points at the one Person entity. */
export function projectNode(p: HomeProject) {
  const recognition = p.detail.meta.find((m) => m.k === 'Recognition')?.v;
  return {
    '@type': 'SoftwareApplication',
    '@id': `${projectUrl(p)}#app`,
    name: p.name,
    description: p.description,
    url: p.live,
    applicationCategory: APP_CATEGORY[p.id] ?? 'WebApplication',
    operatingSystem: 'Web',
    keywords: p.stack.split(' · ').join(', '),
    author: { '@id': PERSON_ID },
    ...(p.code && { sameAs: [p.code] }),
    ...(recognition && { award: recognition }),
  };
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    givenName: 'Aditya',
    familyName: 'Mondal',
    alternateName: seo.handle,
    url: SITE_URL,
    image: `${SITE_URL}/icon-512.png`,
    email: `mailto:${site.email}`,
    jobTitle: seo.jobTitle,
    description: seo.bio,
    nationality: { '@type': 'Country', name: 'India' },
    homeLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
    knowsAbout: ['Software engineering', 'Generative AI', 'Large language models', 'Full-stack web development', ...skills],
    alumniOf: [...new Set(roles.map((r) => r.org))].map((org) => ({ '@type': 'Organization', name: org })),
    award: wins.map((w) => `${w.badge}: ${w.title}`),
    sameAs: [site.github, site.linkedin, site.twitter, site.discord],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: seo.shortTitle,
    description: seo.description,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}
