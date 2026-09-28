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
  label: string; // short name shown under the block
  readout: string; // text shown on hover
}

export const timeline: TimelineSegment[] = [
  { from: 2021.0, to: 2022.2, label: 'Razorpay FTX', readout: '06 · 2021 — Rank 2, Razorpay FTX Hackathon' },
  { from: 2022.2, to: 2023.0, label: 'APICon.io', readout: '05 · 2022 — Software Developer Intern, APICon.io' },
  { from: 2023.0, to: 2023.35, label: 'GeeksforGeeks', readout: '04 · 2023 — Technical Content Writer, GeeksforGeeks' },
  { from: 2023.35, to: 2023.7, label: 'Boringmarketing', readout: '03 · 2023 — Software Developer, Boringmarketing' },
  { from: 2023.7, to: 2024.1, label: 'OtherwiseAI', readout: '02 · 2023 — Software Developer, OtherwiseAI' },
  { from: 2024.1, to: 2026.5, label: 'Miivo', readout: '01 · 2024 — AI Engineer, Miivo' },
  { from: 2026.5, to: 2027.0, label: 'Next →', readout: 'Next — Software Engineer · AI Engineer, your team?' },
];

export const roles = [
  { n: '01', when: '2024 — [END]', title: 'AI Engineer', org: 'Miivo', kind: 'Full-time' },
  { n: '02', when: '2023', title: 'Software Developer', org: 'OtherwiseAI', kind: 'Engineering' },
  { n: '03', when: '2023', title: 'Software Developer', org: 'Boringmarketing', kind: 'Engineering' },
  { n: '04', when: '2023', title: 'Technical Content Writer', org: 'GeeksforGeeks', kind: 'Writing' },
  { n: '05', when: '2022', title: 'Software Developer Intern', org: 'APICon.io', kind: 'Internship' },
  { n: '06', when: '2021', title: 'Rank 2 — built Dispay, a Discord payment bot', org: 'Razorpay FTX', kind: 'Hackathon' },
];

export interface ProjectDetail {
  caption: string; // under the live cover on the project page
  play: string; // how to interact with the cover
  meta: { k: string; v: string }[];
  problem: string;
  features: { t: string; b: string }[];
  arch: { client: string; api: string; coreLabel: string; core: string; store: string };
  decision: string; // the interesting engineering decision — [FILL IN]
  outcome: { k: string; v: string }[];
}

export interface HomeProject {
  n: string;
  id: string; // URL: /projects/<id>
  slug: CoverKind;
  name: string;
  tag: string;
  badge?: string;
  description: string;
  stack: string;
  live: string;
  code?: string; // [LINK]
  coverLabel: string;
  image: string; // screenshot in /public, shown in Simple view
  detail: ProjectDetail;
}

export const homeProjects: HomeProject[] = [
  {
    n: '01', id: 'moneysense', slug: 'money', name: 'Moneysense', tag: 'Fintech · LLM',
    description: 'AI-powered financial analysis that turns raw spending into clear, intelligent insights for smarter money decisions.',
    stack: '[ADD STACK] · [ONE ENGINEERING RESULT]', live: 'https://www.moneyssense.com/',
    coverLabel: 'Scattered transactions sort themselves into a chart and trend line that keeps updating',
    image: '/moneyssense.jpg',
    detail: {
      caption: 'Scattered transactions sort themselves into a chart, and the trend line keeps updating.',
      play: 'Point at a bar to inspect it; click to load new data.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: '[DATES]' }, { k: 'Stack', v: '[ADD STACK]' }, { k: 'Status', v: 'Live' }],
      problem: 'A bank statement tells you what you spent, not what it means. Moneysense takes raw transactions and turns them into plain-language insights, so people can see where their money goes and decide what to change.',
      features: [
        { t: 'Bring in spending', b: '[HOW TRANSACTIONS COME IN — upload, bank sync, manual entry]' },
        { t: 'Sort and chart', b: 'Transactions are grouped into categories and trends you can read at a glance.' },
        { t: 'Explain it', b: 'An LLM turns the patterns into clear, specific suggestions for smarter money decisions.' },
      ],
      arch: { client: '[FRONTEND]', api: '[BACKEND]', coreLabel: 'Model', core: '[LLM]', store: '[DATABASE]' },
      decision: '[One paragraph: how the prompts stay grounded in the user’s own numbers, how financial data is kept safe, and what you would change next.]',
      outcome: [{ k: 'Live', v: 'moneyssense.com' }, { k: '[METRIC]', v: '[e.g. users, statements analysed]' }, { k: '[LEARNING]', v: '[What you would do next]' }],
    },
  },
  {
    n: '02', id: 'lern', slug: 'lern', name: 'Lern', tag: 'Edtech · Gemini', badge: 'Grand prize · Atlas Madness',
    description: 'An AI-powered learning platform where anyone can learn anything, anytime, anywhere.',
    stack: 'Next.js · Node.js · Express · MongoDB · Gemini', live: 'https://lern.pages.dev/',
    coverLabel: 'A question prompt answered by lessons that keep writing themselves',
    image: '/lern.png',
    detail: {
      caption: 'A question goes in; lessons keep writing themselves.',
      play: 'Move over a lesson to highlight it; click to ask a new question.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: '[DATES]' }, { k: 'Stack', v: 'Next.js · Node.js · MongoDB · Gemini' }, { k: 'Recognition', v: 'Grand prize — Atlas Madness' }],
      problem: 'Good learning material is scattered and one-size-fits-all. Lern lets anyone type a topic or question and get a structured lesson generated for them on the spot.',
      features: [
        { t: 'Ask anything', b: 'Type any topic or question — no course catalogue to search through.' },
        { t: 'Generated lessons', b: 'Structured, step-by-step lessons written by the model (built on Bard for the hackathon, now Gemini).' },
        { t: '[FEATURE 3]', b: '[e.g. saved lessons, progress, quizzes]' },
      ],
      arch: { client: 'Next.js', api: 'Node.js · Express', coreLabel: 'Model', core: 'Gemini', store: 'MongoDB' },
      decision: '[One paragraph on the interesting engineering decision: prompting strategy, how lessons are generated and stored, what you would change.]',
      outcome: [{ k: 'Grand prize', v: 'Atlas Madness — Google Cloud × MongoDB hackathon' }, { k: '[METRIC]', v: '[e.g. users, lessons generated]' }, { k: '[LEARNING]', v: '[What you would do next]' }],
    },
  },
  {
    n: '03', id: 'codz', slug: 'codz', name: 'Codz', tag: 'Dev tools · OpenAI',
    description: 'An AI coding platform that boosts developer productivity — generate, debug and optimise code in one place.',
    stack: 'React · Node.js · Express · MongoDB · OpenAI', live: 'https://codz.pages.dev/',
    coverLabel: 'Code with a flagged bug; a review pass keeps sweeping and fixing bugs',
    image: '/codz.png',
    detail: {
      caption: 'A review pass keeps sweeping the file, finding and fixing bugs.',
      play: 'Click a line to plant a bug, then move down to sweep it fixed.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: '[DATES]' }, { k: 'Stack', v: 'React · Node.js · Express · MongoDB · OpenAI' }, { k: 'Status', v: 'Live' }],
      problem: 'Developers bounce between an editor, docs and a chatbot to write, debug and tune code. Codz puts generation, debugging and optimisation in one workspace.',
      features: [
        { t: 'Generate', b: 'Describe what you need and get working code back.' },
        { t: 'Debug', b: 'Paste broken code and get the bug located and explained.' },
        { t: 'Optimise', b: 'Get suggestions to make existing code faster and cleaner.' },
      ],
      arch: { client: 'React', api: 'Node.js · Express', coreLabel: 'Model', core: 'OpenAI', store: 'MongoDB' },
      decision: '[One paragraph: how requests are routed to generate / debug / optimise, how you handle long files and bad model output, what you would change.]',
      outcome: [{ k: 'Live', v: 'codz.pages.dev' }, { k: '[METRIC]', v: '[e.g. users, requests handled]' }, { k: '[LEARNING]', v: '[What you would do next]' }],
    },
  },
  {
    n: '04', id: 'storz', slug: 'storz', name: 'Storz', tag: 'Distributed · IPFS', badge: 'Winner · Web3 Infinity',
    description: 'Open-source, decentralised and encrypted file sharing and storage, built on IPFS.',
    stack: 'React · Node.js · Express · MongoDB · IPFS', live: 'https://storz.pages.dev/',
    coverLabel: 'A file splits into encrypted shards across a ring of nodes with packets flowing between them',
    image: '/storz.png',
    detail: {
      caption: 'One file splits into encrypted shards across a ring of nodes.',
      play: 'Point at a node to route packets to it; click to re-shard the file.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: '[DATES]' }, { k: 'Stack', v: 'React · Node.js · Express · MongoDB · IPFS' }, { k: 'Recognition', v: 'Winner — Web3 Infinity' }],
      problem: 'Most file sharing depends on one company’s servers. Storz encrypts files and stores them on IPFS, so sharing stays private and doesn’t rely on a single host.',
      features: [
        { t: 'Encrypt first', b: 'Files are encrypted before they leave the browser [CONFIRM].' },
        { t: 'Store on IPFS', b: 'Content is pinned to the decentralised IPFS network.' },
        { t: 'Share', b: '[HOW SHARING WORKS — link, CID, access control]' },
      ],
      arch: { client: 'React', api: 'Node.js · Express', coreLabel: 'Network', core: 'IPFS', store: 'MongoDB' },
      decision: '[One paragraph: where encryption happens and how keys are handled, what MongoDB stores vs IPFS, what you would change.]',
      outcome: [{ k: 'Winner', v: 'Web3 Infinity hackathon' }, { k: 'Open source', v: '[REPO LINK]' }, { k: '[LEARNING]', v: '[What you would do next]' }],
    },
  },
];

export const wins: { kind: WinKind; badge: string; title: string; body: string; iconLabel: string }[] = [
  { kind: 'trophy', badge: 'Grand prize', title: 'Atlas Madness', body: 'Google Cloud × MongoDB hackathon — built an AI-powered learning platform on Google’s Bard.', iconLabel: 'Dithered trophy' },
  { kind: 'medal', badge: 'Rank 2 · 2021', title: 'Razorpay FTX', body: 'Built Dispay, a Discord bot for seamless P2P payments inside Discord.', iconLabel: 'Dithered second-place medal' },
  { kind: 'blocks', badge: 'Category winner', title: 'Web3 Infinity', body: 'Built Storz — secure, encrypted file storage on the IPFS network.', iconLabel: 'Dithered cluster of storage blocks' },
];

// Shown right under the hero. Edit freely — principles 02/03 are written from your projects; make sure they sound like you.
export const howIWork = {
  title: 'Product-minded engineer.',
  intro: 'I own features end to end — data model, API, UI — then iterate on what users actually do with it. Lately, most of that work has an LLM in the loop.',
  now: '[ADD: what you’re building or learning right now]',
  principles: [
    { t: 'End to end', b: 'Data model, API, UI and deploy — I’ve shipped this way at Miivo, OtherwiseAI and Boringmarketing.' },
    { t: 'AI with guardrails', b: 'LLMs where they earn their place: grounded in real data, with a sensible fallback when the model gets it wrong.' },
    { t: 'Ship under pressure', b: 'Three hackathon wins came from getting a working demo in front of judges before the deadline.' },
  ],
};

export const stack = [
  { k: 'Languages', v: 'TypeScript · JavaScript · C++ · SQL' },
  { k: 'Backend', v: 'Node.js · Bun · Hono · Express' },
  { k: 'Frontend', v: 'React · Next.js · Tailwind · shadcn/ui' },
  { k: 'Gen AI', v: 'LangChain · Gemini API · OpenAI API', highlight: true },
  { k: 'Data', v: 'MongoDB · SQL · Firebase · IPFS' },
  { k: 'Bonus', v: 'Figma — I can design the UI I build' },
];
