// Content for the dithered home page (app/page.tsx).
// Anything in [BRACKETS] is a placeholder for you to fill in.

import type { CoverKind } from '@/components/home/ProjectCover';
import type { WinKind } from '@/components/home/WinIcon';

export const site = {
  name: 'Aditya Mondal',
  status: 'Open to work — Software Engineer · AI',
  headline: 'Software engineer shipping full-stack products — with a focus on',
  headlineHighlight: 'generative AI',
  shippedAt: ['Miivo', 'OtherwiseAI', 'Boringmarketing', 'GeeksforGeeks', 'APICon.io'],
  location: 'India, IST',
  relocation: 'Remote / relocation [CONFIRM]',
  resumeUrl: '#resume', // [PDF LINK] — e.g. '/aditya-mondal-resume.pdf' in /public
  github: 'https://github.com/Sneakad',
  linkedin: 'https://www.linkedin.com/in/aditya-mondal2/',
  twitter: 'https://twitter.com/sneakad4',
  discord: 'https://discord.com/users/sneakad',
};

export interface TimelineSegment {
  from: number; // decimal year
  to: number;
  label: string; // marker above the strip
  readout: string; // text shown on hover
}

export const timeline: TimelineSegment[] = [
  { from: 2021.0, to: 2022.2, label: '06', readout: '06 · 2021 — Rank 2, Razorpay FTX Hackathon' },
  { from: 2022.2, to: 2023.0, label: '05', readout: '05 · 2022 — Software Developer Intern, APICon.io' },
  { from: 2023.0, to: 2023.35, label: '04', readout: '04 · 2023 — Technical Content Writer, GeeksforGeeks' },
  { from: 2023.35, to: 2023.7, label: '03', readout: '03 · 2023 — Software Developer, Boringmarketing' },
  { from: 2023.7, to: 2024.1, label: '02', readout: '02 · 2023 — Software Developer, OtherwiseAI' },
  { from: 2024.1, to: 2026.5, label: '01', readout: '01 · 2024 — AI Engineer, Miivo' },
  { from: 2026.5, to: 2027.0, label: 'Next', readout: 'Next — Software Engineer · AI Engineer, your team?' },
];

export const roles = [
  { n: '01', when: '2024 — [END]', title: 'AI Engineer', org: 'Miivo', kind: 'Full-time' },
  { n: '02', when: '2023', title: 'Software Developer', org: 'OtherwiseAI', kind: 'Engineering' },
  { n: '03', when: '2023', title: 'Software Developer', org: 'Boringmarketing', kind: 'Engineering' },
  { n: '04', when: '2023', title: 'Technical Content Writer', org: 'GeeksforGeeks', kind: 'Writing' },
  { n: '05', when: '2022', title: 'Software Developer Intern', org: 'APICon.io', kind: 'Internship' },
  { n: '06', when: '2021', title: 'Rank 2 — built Dispay, a Discord payment bot', org: 'Razorpay FTX', kind: 'Hackathon' },
];

export interface HomeProject {
  n: string;
  slug: CoverKind;
  name: string;
  tag: string;
  badge?: string;
  description: string;
  stack: string;
  live: string;
  code?: string; // [LINK]
  caseStudy?: string;
  coverLabel: string;
}

export const homeProjects: HomeProject[] = [
  {
    n: '01', slug: 'money', name: 'Moneysense', tag: 'Fintech · LLM',
    description: 'AI-powered financial analysis that turns raw spending into clear, intelligent insights for smarter money decisions.',
    stack: '[ADD STACK] · [ONE ENGINEERING RESULT]', live: 'https://www.moneyssense.com/',
    coverLabel: 'Scattered transactions sort themselves into a chart and trend line that keeps updating',
  },
  {
    n: '02', slug: 'lern', name: 'Lern', tag: 'Edtech · Gemini', badge: 'Grand prize · Atlas Madness',
    description: 'An AI-powered learning platform where anyone can learn anything, anytime, anywhere.',
    stack: 'Next.js · Node.js · Express · MongoDB · Gemini', live: 'https://lern.pages.dev/',
    coverLabel: 'A question prompt answered by lessons that keep writing themselves',
  },
  {
    n: '03', slug: 'codz', name: 'Codz', tag: 'Dev tools · OpenAI',
    description: 'An AI coding platform that boosts developer productivity — generate, debug and optimise code in one place.',
    stack: 'React · Node.js · Express · MongoDB · OpenAI', live: 'https://codz.pages.dev/',
    coverLabel: 'Code with a flagged bug; a review pass keeps sweeping and fixing bugs',
  },
  {
    n: '04', slug: 'storz', name: 'Storz', tag: 'Distributed · IPFS', badge: 'Winner · Web3 Infinity',
    description: 'Open-source, decentralised and encrypted file sharing and storage, built on IPFS.',
    stack: 'React · Node.js · Express · MongoDB · IPFS', live: 'https://storz.pages.dev/',
    coverLabel: 'A file splits into encrypted shards across a ring of nodes with packets flowing between them',
  },
];

export const wins: { kind: WinKind; badge: string; title: string; body: string; iconLabel: string }[] = [
  { kind: 'trophy', badge: 'Grand prize', title: 'Atlas Madness', body: 'Google Cloud × MongoDB hackathon — built an AI-powered learning platform on Google’s Bard.', iconLabel: 'Dithered trophy' },
  { kind: 'medal', badge: 'Rank 2 · 2021', title: 'Razorpay FTX', body: 'Built Dispay, a Discord bot for seamless P2P payments inside Discord.', iconLabel: 'Dithered second-place medal' },
  { kind: 'blocks', badge: 'Category winner', title: 'Web3 Infinity', body: 'Built Storz — secure, encrypted file storage on the IPFS network.', iconLabel: 'Dithered cluster of storage blocks' },
];

export const stack = [
  { k: 'Languages', v: 'TypeScript · JavaScript · C++ · SQL' },
  { k: 'Backend', v: 'Node.js · Bun · Hono · Express' },
  { k: 'Frontend', v: 'React · Next.js · Tailwind · shadcn/ui' },
  { k: 'Gen AI', v: 'LangChain · Gemini API · OpenAI API', highlight: true },
  { k: 'Data', v: 'MongoDB · SQL · Firebase · IPFS' },
  { k: 'Bonus', v: 'Figma — I can design the UI I build' },
];
