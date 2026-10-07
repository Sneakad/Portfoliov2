// Content for the dithered home page (app/page.tsx).
// Anything in [BRACKETS] is a placeholder for you to fill in.

import type { CoverKind } from '@/components/home/ProjectCover';
import type { WinKind } from '@/components/home/WinIcon';

export const site = {
  name: 'Aditya Mondal',
  status: 'Open to work · Software Engineer · AI',
  headline: 'Software engineer shipping full-stack products, with a focus on',
  headlineHighlight: 'generative AI',
  location: 'India, IST',
  resumeUrl: '#resume', // [PDF LINK], e.g. '/aditya-mondal-resume.pdf' in /public
  showResume: false, // résumé buttons hidden for now; set true (with a real resumeUrl) to show them again
  email: 'aditya4161@gmail.com',
  github: 'https://github.com/Sneakad',
  githubUser: 'Sneakad', // drives the live contribution graph
  showGithubGraph: false, // hidden for now; set true to show it again (Experience + Simple view)
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
  { from: 2022.0, to: 2023.0, label: 'Supista', readout: '05 · 2022 — Software Developer Intern, Supista' },
  { from: 2023.0, to: 2023.4, label: 'GeeksforGeeks', readout: '04 · 2023 — Technical Content Writer, GeeksforGeeks' },
  { from: 2023.4, to: 2024.0, label: 'Boringmarketing', readout: '03 · 2023 – 2024 — Software Developer, Boringmarketing' },
  { from: 2024.0, to: 2025.0, label: 'OtherwiseAI', readout: '02 · 2024 – 2025 — Software Developer, OtherwiseAI' },
  { from: 2025.0, to: 2026.75, label: 'Miivo AI', readout: '01 · 2025 – Sep 2026 — Software Engineer, Miivo AI' },
  { from: 2026.75, to: 2027.0, label: 'Next →', readout: 'Next — Software Engineer · AI Engineer, your team?' },
];

/**
 * An official company logo in /public/company_logos. `tile`: 'cover' = a square logo that fills its spot;
 * 'dark' / 'light' = a wordmark that needs a dark / light badge behind it. w/h are the file's own size.
 */
export interface OrgLogoImg { src: string; tile: 'cover' | 'dark' | 'light'; w: number; h: number; mark?: string /* icon-only file for small spots */; bg?: string /* brand colour behind a wordmark */ }
export interface Role { n: string; when: string; title: string; org: string; kind: string; logo?: OrgLogoImg }

// Newest first. Hackathons live in the Wins section, not here.
export const roles: Role[] = [
  { n: '01', when: '2025 — Sep 2026', title: 'Software Engineer', org: 'Miivo AI', kind: 'Full-time',
    logo: { src: '/company_logos/miivo-dark.svg', tile: 'dark', w: 70, h: 25, bg: '#006D3F' } },
  { n: '02', when: '2024 — 2025', title: 'Software Developer', org: 'OtherwiseAI', kind: 'Full-time',
    logo: { src: '/company_logos/otherwiselogo-dark.svg', tile: 'light', w: 222, h: 60, mark: '/company_logos/otherwise-mark.svg' } },
  { n: '03', when: '2023 — 2024', title: 'Software Developer', org: 'Boringmarketing', kind: 'Full-time',
    logo: { src: '/company_logos/boringmarketing_logo.jpg', tile: 'cover', w: 200, h: 200 } },
  { n: '04', when: '2023', title: 'Technical Content Writer', org: 'GeeksforGeeks', kind: 'Part-time',
    logo: { src: '/company_logos/geeksforgeeks_logo.jpg', tile: 'cover', w: 200, h: 200 } },
  { n: '05', when: '2022', title: 'Software Developer Intern', org: 'Supista', kind: 'Internship',
    logo: { src: '/company_logos/supista_logo.jpg', tile: 'cover', w: 200, h: 200 } },
];

/** False for text still holding a `[PLACEHOLDER]`, so unfinished fields stay off the live site until filled in. */
export const filled = (s?: string): s is string => !!s && !/\[[^\]]*\]/.test(s);

/** A labelled hop between two lanes: `to` goes right (request), `back` comes back (response); `via` is a service in between. */
export interface ArchLink { to: string; back?: string; via?: string }

/**
 * One row of an architecture diagram: what the user does in the frontend → what the backend does →
 * which outside service it talks to. `backend` omitted = the frontend calls the service directly.
 */
export interface ArchFlow { feature: string; link: ArchLink; backend?: string[]; out?: ArchLink; service?: string }

export interface ProjectDetail {
  caption: string; // under the live cover on the project page
  play: string; // how to interact with the cover
  meta: { k: string; v: string }[];
  problem: string;
  features: { t: string; b: string }[];
  arch: { client: string; api: string; coreLabel: string; core: string; store: string };
  flows: ArchFlow[]; // the architecture diagram, one row per thing a user does
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
    n: '01', id: 'moneysense', slug: 'money', name: 'Moneysense', tag: 'Investing · AI',
    description: 'A value-investing platform that grades any stock across 9 pillars, works out what it’s really worth and explains the business in plain language.',
    stack: 'Next.js · TypeScript · PostgreSQL · Prisma · OpenAI', live: 'https://www.moneyssense.com/',
    coverLabel: 'Scattered data points settle into a company’s yearly revenue bars, then a fair-value line is drawn across them',
    image: '/moneyssense.jpg',
    detail: {
      caption: 'Raw financials settle into a company’s revenue by year, then a fair-value line is drawn across it.',
      play: 'Point at a bar to inspect that year; click to load another stock.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: '[DATES]' }, { k: 'Stack', v: 'Next.js · PostgreSQL · Prisma · OpenAI' }, { k: 'Status', v: 'Live · 6,000+ investors' }],
      problem: 'Picking stocks well means digging through years of filings, ratios and valuation models: work most people never get round to. Moneysense does the digging: it grades a company on what matters, estimates what it’s actually worth, and explains the business in plain language, so anyone can invest with confidence.',
      features: [
        { t: '9-pillar grades', b: 'Every company is graded A–F across 9 pillars (profitability, growth, financial health, management quality and more), so strengths and red flags show at a glance.' },
        { t: 'Intrinsic value', b: 'Fair value from five models side by side: Graham’s Formula, DCF, Dividend Discount, Peter Lynch and multiples.' },
        { t: 'AI business analysis', b: 'An AI deep dive into the business model, competitive advantages, risks and growth opportunities, generated in seconds.' },
      ],
      arch: { client: 'Next.js · React', api: 'Next.js server actions', coreLabel: 'Model', core: 'OpenAI · Vercel AI SDK', store: 'PostgreSQL · Prisma' },
      flows: [
        { feature: 'Sign in', link: { to: 'Credentials', back: 'Session' }, backend: ['Better Auth'], out: { to: 'Users & sessions' }, service: 'PostgreSQL' },
        { feature: 'Stock page', link: { to: 'Ticker', back: 'Grades & fair value' }, backend: ['Fetch financials', 'Grade 9 pillars · value it'], out: { to: 'Request', back: 'Financials' }, service: 'Yahoo Finance' },
        { feature: 'AI business analysis', link: { to: 'Company', back: 'Report' }, backend: ['Vercel AI SDK'], out: { to: 'Prompt', back: 'Analysis' }, service: 'OpenAI' },
        { feature: 'Ratings & notes', link: { to: 'Save rating', back: 'Your list' }, backend: ['Server action · Prisma'], out: { to: 'Read / write' }, service: 'PostgreSQL' },
        { feature: 'Upgrade to PRO', link: { to: 'Checkout', back: 'PRO unlocked' }, backend: ['Better Auth · Stripe plugin'], out: { to: 'Subscription', back: 'Webhook' }, service: 'Stripe' },
      ],
      outcome: [{ k: '6,000+', v: 'investors use it · 4.8/5 rating' }, { k: '70K+', v: 'stocks analysed' }],
    },
  },
  {
    n: '02', id: 'lern', slug: 'lern', name: 'Lern', tag: 'Edtech · Generative AI', badge: 'Grand prize · Atlas Madness',
    description: 'Type any topic and get a full course in seconds, with chapters, quizzes and progress tracking, generated with Google’s PaLM (Bard).',
    stack: 'React · Node.js · Express · MongoDB · PaLM', live: 'https://lern.pages.dev/', code: 'https://github.com/anomic30/Lern',
    coverLabel: 'A topic typed into a prompt, answered by a course whose chapters write themselves',
    image: '/lern.png',
    detail: {
      caption: 'A topic goes in; a course writes itself, chapter by chapter.',
      play: 'Move over a chapter to highlight it; click to try a new topic.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: 'Jun – Nov 2023' }, { k: 'Stack', v: 'React · Express · MongoDB · PaLM' }, { k: 'Recognition', v: 'Grand prize, Atlas Madness' }],
      problem: 'Learning something new usually means hours of searching through scattered, one-size-fits-all material. Lern skips the search: type any topic and it builds a structured course for you on the spot, with chapters to work through and quizzes to check you understood.',
      features: [
        { t: 'Instant courses', b: 'Type any topic and Google’s PaLM (Bard) generates a complete, well-structured course in seconds.' },
        { t: 'Chapters & quizzes', b: 'Courses are split into bite-sized chapters, each with its own quiz to test and reinforce what you learned.' },
        { t: 'Progress insights', b: 'A dashboard tracks course completion and quiz scores, so you can see where you’re strong and what to revisit.' },
      ],
      arch: { client: 'React · Vite', api: 'Node.js · Express', coreLabel: 'Model', core: 'Google PaLM · LangChain', store: 'MongoDB' },
      flows: [
        { feature: 'Sign in', link: { via: 'Magic.link', to: 'Check token', back: 'Authenticated' }, backend: ['Verify token'] },
        { feature: 'Generate a course', link: { to: 'Topic', back: 'Course' }, backend: ['Prompt via LangChain', 'Save course'], out: { to: 'Prompt', back: 'Chapters & quizzes' }, service: 'Google PaLM (Bard)' },
        { feature: 'Chapters & quizzes', link: { to: 'Open · submit quiz', back: 'Content · score' }, backend: ['Query database'], out: { to: 'Read / write', back: 'Records' }, service: 'MongoDB' },
        { feature: 'Insights', link: { to: 'Load progress', back: 'Completion · scores' }, backend: ['Query database'], out: { to: 'Query', back: 'Progress' }, service: 'MongoDB' },
      ],
      outcome: [{ k: 'Grand prize', v: 'Atlas Madness 2023, Google Cloud × MongoDB hackathon' }],
    },
  },
  {
    n: '03', id: 'codz', slug: 'codz', name: 'Codz', tag: 'Dev tools · AI',
    description: 'An AI coding workspace that generates, debugs, optimises and explains code in 30+ languages, with credits paid through Solana Pay.',
    stack: 'React · Node.js · Express · MongoDB · OpenAI · Solana', live: 'https://codz.pages.dev/', code: 'https://github.com/anomic30/codz',
    coverLabel: 'Code with a flagged bug; a review pass keeps sweeping and fixing bugs',
    image: '/codz.png',
    detail: {
      caption: 'A review pass keeps sweeping the file, finding and fixing bugs.',
      play: 'Click a line to plant a bug, then move down to sweep it fixed.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: 'Feb – Oct 2023' }, { k: 'Stack', v: 'React · Express · MongoDB · OpenAI · Solana Pay' }, { k: 'Status', v: 'Live' }],
      problem: 'Developers bounce between an editor, docs and a chatbot to write, fix and tune code. Codz puts it all in one editor: write code, then ask AI to generate, debug, optimise or explain it without leaving the page.',
      features: [
        { t: 'Generate & optimise', b: 'Describe what you need and get working code, or have existing code made faster and cleaner, across 30+ languages.' },
        { t: 'Debug & explain', b: 'Intelligent debugging finds and explains bugs, code summaries explain unfamiliar code, and an AI chatbot answers questions.' },
        { t: 'Pay with Solana', b: 'Buy AI credits with Solana Pay; sign in without a password via Magic.link, and save unlimited files.' },
      ],
      arch: { client: 'React · Monaco editor', api: 'Node.js · Express', coreLabel: 'Model', core: 'OpenAI', store: 'MongoDB' },
      flows: [
        { feature: 'Login / Signup', link: { via: 'Magic.link', to: 'Check token', back: 'Authenticated' }, backend: ['Verify token'] },
        { feature: 'Dashboard', link: { to: 'Load profile', back: 'User’s info' }, backend: ['Query database'], out: { to: 'Query', back: 'Records' }, service: 'MongoDB' },
        { feature: 'My codes', link: { to: 'Load files', back: 'User’s codes' }, backend: ['Query database'], out: { to: 'Query', back: 'Saved code' }, service: 'MongoDB' },
        { feature: 'Playground · AI features & chat', link: { to: 'Code + prompt', back: 'AI response' }, backend: ['OpenAI request'], out: { to: 'Prompt', back: 'Completion' }, service: 'OpenAI' },
        { feature: 'Playground · Code compile', link: { to: 'Source code', back: 'Output' }, service: 'Judge0 API' },
        { feature: 'Pricing', link: { via: 'Solana Pay', to: 'Scan QR · pay' }, backend: ['Record payment'], out: { to: 'Payment metadata' }, service: 'MongoDB' },
      ],
      outcome: [{ k: '5 AI tools', v: 'Generate, optimise, summarise, debug and chat, all in one editor' }, { k: '30+', v: 'programming languages supported' }],
    },
  },
  {
    n: '04', id: 'storz', slug: 'storz', name: 'Storz', tag: 'Web3 · IPFS', badge: 'Winner · Web3 Infinity',
    description: 'Open-source, decentralised file storage and sharing: every file is AES-256 encrypted and stored on IPFS, so no single company holds your data.',
    stack: 'React · Node.js · Express · MongoDB · IPFS', live: 'https://storz.pages.dev/', code: 'https://github.com/anomic30/storz',
    coverLabel: 'A file splits into encrypted shards across a ring of nodes with packets flowing between them',
    image: '/storz.png',
    detail: {
      caption: 'One file splits into encrypted shards across a ring of nodes.',
      play: 'Point at a node to route packets to it; click to re-shard the file.',
      meta: [{ k: 'Role', v: '[YOUR ROLE]' }, { k: 'Timeline', v: 'Aug 2022 – Jan 2023' }, { k: 'Stack', v: 'React · Express · MongoDB · IPFS' }, { k: 'Recognition', v: '2 awards, Web3 Infinity 2022' }],
      problem: 'Most file storage lives on one company’s servers, which can read, lose or lock away your files. Storz encrypts every file and stores it on IPFS, a distributed network, so you keep full ownership of your data and can still share it easily.',
      features: [
        { t: 'Encrypted', b: 'Every file is encrypted with AES-256 before it is stored, so only the people you share with can read it.' },
        { t: 'Stored on IPFS', b: 'Files live on IPFS, a high-performance distributed network, so there’s no single server to fail or shut you out.' },
        { t: 'Share your way', b: 'Make any file public or private and share it with anyone, with unlimited storage and passwordless sign-in.' },
      ],
      arch: { client: 'React', api: 'Node.js · Express', coreLabel: 'Network', core: 'IPFS (Infura · web3.storage)', store: 'MongoDB' },
      flows: [
        { feature: 'Login / Signup', link: { via: 'Magic.link', to: 'Check token', back: 'Authenticated' }, backend: ['Verify token'] },
        { feature: 'Upload', link: { to: 'Sends file' }, backend: ['Encrypt (AES-256)', 'Send to IPFS', 'Save CID to database'], out: { to: 'Encrypted file', back: 'CID' }, service: 'IPFS' },
        { feature: 'My files', link: { to: 'Request files', back: 'File info' }, backend: ['Query database'], out: { to: 'Query', back: 'Metadata' }, service: 'MongoDB' },
        { feature: 'Make public / delete', link: { to: 'Update metadata' }, backend: ['Update database'], out: { to: 'Write' }, service: 'MongoDB' },
        { feature: 'Download', link: { to: 'Request download', back: 'Decrypted file' }, backend: ['Request to IPFS', 'Decrypt'], out: { to: 'CID', back: 'Encrypted file' }, service: 'IPFS' },
      ],
      outcome: [{ k: '2 awards', v: 'Decentralized Storage Infrastructure + Community Choice at Web3 Infinity 2022 (Protocol Labs · Filecoin Foundation)' }, { k: 'Open source', v: 'Hacktoberfest 2022 project, open to contributors' }],
    },
  },
];

export const wins: { kind: WinKind; badge: string; title: string; body: string; iconLabel: string }[] = [
  { kind: 'trophy', badge: 'Grand prize', title: 'Atlas Madness', body: 'Google Cloud × MongoDB hackathon. Built an AI-powered learning platform on Google’s Bard.', iconLabel: 'Pixel-art trophy' },
  { kind: 'medal', badge: 'Rank 2 · 2021', title: 'Razorpay FTX', body: 'Built Dispay, a Discord bot for seamless P2P payments inside Discord.', iconLabel: 'Pixel-art second-place medal' },
  { kind: 'blocks', badge: '2 awards', title: 'Web3 Infinity', body: 'Decentralized Storage Infrastructure winner + Community Choice Award for Storz, encrypted file storage on IPFS.', iconLabel: 'Pixel-art cluster of storage blocks' },
];

// Shown right under the hero. Edit freely — principles 02/03 are written from your projects; make sure they sound like you.
export const howIWork = {
  title: 'Hi, I’m Aditya.',
  intro: 'A creative software developer specializing in AI-integrated web applications. I deliver seamless, user-friendly and impactful solutions by combining advanced AI capabilities with innovative design.',
  now: '[ADD: what you’re building or learning right now]',
  principles: [
    { t: 'AI-integrated web apps', b: 'Full-stack products with AI built in, from data model and API to UI and deploy. Shipped at Miivo AI, OtherwiseAI and Boringmarketing.' },
    { t: 'Seamless and user-friendly', b: 'Interfaces people understand on first use. I design the UI I build, so it feels right before it ships.' },
    { t: 'Impactful by design', b: 'Advanced AI where it earns its place: grounded in real data, with a sensible fallback when the model gets it wrong.' },
  ],
};

export const stack = [
  { k: 'Languages', v: 'TypeScript · JavaScript · Python · C++ · SQL' },
  { k: 'Backend', v: 'Node.js · Bun · Hono · Express' },
  { k: 'Frontend', v: 'React · Next.js · Tailwind · shadcn/ui' },
  { k: 'Gen AI', v: 'LangChain · LLM integrations · Vector databases', highlight: true },
  { k: 'Data', v: 'PostgreSQL · MongoDB · Prisma · Drizzle · Firebase · IPFS' },
  { k: 'Tooling', v: 'Turborepo · Monorepos' },
  { k: 'Bonus', v: 'Figma: I can design the UI I build' },
];

// "How I build": one feature from messy idea to production, in five phases.
// AI is part of the toolkit (marked in `ai`), not the whole story.
export const signalPath = {
  title: 'How I build',
  note: 'Idea to production',
  intro: 'Whether it is a dashboard, an API or an AI agent, everything I build goes through the same five phases.',
  phases: [
    {
      k: 'Listen',
      line: 'Sit with the people doing the work until the real problem shows up.',
      out: 'a written spec and test cases',
      tools: ['User interviews', 'Workflow maps', 'Success criteria', 'Throwaway prototypes'],
      ai: ['Golden datasets'],
    },
    {
      k: 'Design',
      line: 'Shape the data, the API and the screens before writing much code.',
      out: 'a schema, an API contract and wireframes',
      tools: ['Data modelling', 'API design', 'System design', 'MongoDB', 'SQL', 'Figma'],
      ai: ['Prompt & tool design'],
    },
    {
      k: 'Build',
      line: 'The whole stack: UI, backend, and the AI that sits between them.',
      out: 'a working product, end to end',
      tools: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind'],
      ai: ['Vercel AI SDK', 'LangChain', 'RAG', 'Embeddings', 'Tool calling', 'MCP'],
    },
    {
      k: 'Harden',
      line: 'Make it reliable. Nothing ships on vibes.',
      out: 'tests and scores, not feelings',
      tools: ['Testing', 'Queues & retries', 'Durable workflows', 'Inngest', 'Auth & validation'],
      ai: ['Evals', 'Guardrails', 'Structured outputs', 'Human-in-the-loop'],
    },
    {
      k: 'Ship',
      line: 'Deploy it, watch it, and keep it fast and cheap.',
      out: 'a live URL with dashboards behind it',
      tools: ['Vercel', 'GCP', 'AWS', 'Docker', 'CI/CD', 'Observability'],
      ai: ['Tracing', 'Cost & latency budgets'],
    },
  ],
};
