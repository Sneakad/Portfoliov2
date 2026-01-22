export interface Project {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  category?: string;
}

export const projects: Project[] = [
  {
    title: "Moneysense",
    description: "AI-powered financial analyzing tool that helps users make smarter financial decisions with intelligent insights and analysis",
    techStack: ["AI", "Machine Learning", "Financial Analysis"],
    category: "Web Development",
    link: "https://www.moneyssense.com/"
  },
  {
    title: "Lern",
    description: "AI powered learning platform where users can learn anything, anytime, anywhere",
    techStack: ["Next.js", "Node.js", "Express.js", "MongoDB", "Gemini AI"],
    category: "Web Development",
    link: "https://lern.pages.dev/"
  },
  {
    title: "Storz",
    description: "Open-source, decentralized, and securely encrypted file-sharing and storage system utilizing IPFS technology.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "IPFS"],
    category: "Web Development",
    link: "https://storz.pages.dev/"
  },
  {
    title: "Codz",
    description: "AI-powered coding platform that increases developer productivity. It is used to generate, debug and optimize code using the power of AI.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Open AI"],
    category: "Web Development",
    link: "https://codz.pages.dev/"
  },
  {
    title: "Crypt Art",
    description: "Case Study of a NFT Marketplace application with modern design.",
    techStack: ["Figma", "Case Study", "Adobe Photoshop"],
    category: "UI/UX Design",
    link: "https://www.behance.net/gallery/148554205/Crypt-Art-NFT-Marketplace-App-UI-Case-Study/modules/839133905"
  },
  {
    title: "Courzed",
    description: "User Interface and case study of a online learning platform named as Courzed where users can buy new courses to learn new skills.",
    techStack: ["Figma", "Case Study"],
    category: "UI/UX Design",
    link: "https://www.behance.net/gallery/148572377/Courzed-E-learning-app-UIUX-Case-Study/modules/839234185"
  },
  {
    title: "Origin Resorts",
    description: "User interface of the landing page of a luxury hotel chain know as Origin Resorts",
    techStack: ["Figma", "Case Study"],
    category: "UI/UX Design",
    link: "https://www.behance.net/gallery/148794079/Origin-Resorts-A-Hotel-Landing-Page-UIUX-Design/modules/840449807"
  }
];
