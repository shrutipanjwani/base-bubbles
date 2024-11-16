// utils/categoryMapping.ts
import { Category } from "@/types/registry";

interface CategoryPatterns {
  [key: string]: string[];
}

interface ProjectCategoryMapping {
  [key: string]: Category | CategoryPatterns;
  patterns: CategoryPatterns;
}

// Define specific project name to category mappings
const PROJECT_CATEGORIES: ProjectCategoryMapping = {
  // DeFi Projects
  uniswap: "DeFi",
  oneinch: "DeFi",
  pancakeswap: "DeFi",
  sushiswap: "DeFi",
  curve: "DeFi",
  aave: "DeFi",
  compound: "DeFi",
  balancer: "DeFi",

  // Infrastructure Projects
  layerzero: "Infrastructure",
  chainlink: "Infrastructure",
  across: "Infrastructure",
  zora: "Infrastructure",
  "base-bridge": "Infrastructure",
  socket: "Infrastructure",
  dmail: "Infrastructure",

  // NFT Projects
  opensea: "NFTs",
  blur: "NFTs",
  foundation: "NFTs",
  sound: "NFTs",

  // Gaming Projects
  gridzones: "Games",
  aegis: "Games",
  battlepups: "Games",
  starknet: "Games",

  // Social Projects
  farcaster: "Social",
  lens: "Social",
  friend: "Social",
  moxie: "Social",

  // If no specific mapping, use pattern matching
  patterns: {
    DeFi: [
      "swap",
      "dex",
      "finance",
      "fi",
      "dao",
      "pool",
      "stake",
      "yield",
      "lend",
      "borrow",
      "trade",
    ],
    Infrastructure: [
      "bridge",
      "oracle",
      "protocol",
      "chain",
      "base",
      "layer",
      "zero",
      "verification",
    ],
    NFTs: ["nft", "token", "art", "collect"],
    Games: ["game", "play", "quest", "battle", "arena"],
    Social: ["social", "chat", "community", "friend", "network"],
  },
} as const;

export const determineCategory = (projectName: string): Category => {
  const nameLower = projectName.toLowerCase();

  // First check direct mappings
  const directMapping = PROJECT_CATEGORIES[nameLower];
  if (directMapping && typeof directMapping === "string") {
    return directMapping as Category;
  }

  // Then check pattern matches
  const patterns = PROJECT_CATEGORIES.patterns;
  for (const [category, patternArray] of Object.entries(patterns)) {
    if (
      Array.isArray(patternArray) &&
      patternArray.some((pattern) => nameLower.includes(pattern))
    ) {
      return category as Category;
    }
  }

  // Default to Other if no matches found
  return "Other";
};

// Add a helper function to get all unique categories
export const getAllCategories = (): Category[] => {
  return ["DeFi", "Infrastructure", "NFTs", "Games", "Social", "Other"];
};

// Add a helper function to get category names for display
export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    DeFi: "DeFi",
    Infrastructure: "Infrastructure",
    NFTs: "NFTs",
    Games: "Games",
    Social: "Social",
    Other: "Other",
  };
  return labels[category];
};

// Add a function to check if a project belongs to a category
export const isProjectInCategory = (
  projectName: string,
  category: Category
): boolean => {
  return determineCategory(projectName) === category;
};

// Export the patterns for reuse
export const getCategoryPatterns = (category: Category): string[] => {
  return PROJECT_CATEGORIES.patterns[category] || [];
};
