// data/projects.ts
export interface ProjectDetails {
  name: string;
  description: string;
  category: string;
  website?: string;
  documentation?: string;
  socialLinks?: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
}

export const projectsDetails: Record<string, ProjectDetails> = {
  uniswap: {
    name: "Uniswap",
    description:
      "Decentralized protocol for automated liquidity provision on Base",
    category: "DeFi",
    website: "https://app.uniswap.org",
    documentation: "https://docs.uniswap.org",
    socialLinks: {
      twitter: "https://twitter.com/Uniswap",
      discord: "https://discord.gg/uniswap",
      github: "https://github.com/Uniswap",
    },
  },
  basenames: {
    name: "Basenames",
    description: "Decentralized naming service for Base",
    category: "Infrastructure",
    website: "https://www.base.org/names",
  },
  aave: {
    name: "Aave",
    description:
      "Aave is a decentralized money market protocol where people can lend out their assets to earn interest, or borrow various cryptocurrencies against their deposited collateral.",
    category: "Infrastructure",
    website: "https://aave.com/",
  },
  // Add more projects...
};
