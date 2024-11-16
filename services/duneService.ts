// services/duneService.ts
import axios from "axios";
import { determineCategory, getAllCategories } from "@/utils/categoryMapping";
import { DuneProjectData, Category, FilterMetric } from "@/types/registry";

const DUNE_API_KEY = process.env.NEXT_PUBLIC_DUNE_API_KEY as string;
const DUNE_API_URL = "https://api.dune.com/api/v1/endpoints";

export const fetchDuneData = async (): Promise<DuneProjectData[]> => {
  try {
    const response = await axios.get(
      `${DUNE_API_URL}/shrutz/base-bubbles-2/results`,
      {
        params: {
          limit: 1000,
        },
        headers: {
          "X-Dune-API-Key": DUNE_API_KEY,
        },
      }
    );

    return response.data.result.rows;
  } catch (error) {
    console.error("Error fetching Dune data:", error);
    return [];
  }
};

const getMetricValue = (
  data: DuneProjectData,
  metric: FilterMetric
): number => {
  switch (metric) {
    case "total_txs":
      return data.total_txs;
    case "total_users":
      return data.total_users;
    case "txs_last_7_days":
      return data.txs_last_7_days;
    case "txs_last_30_days":
      return data.txs_last_30_days;
    case "users_last_7_days":
      return data.users_last_7_days;
    case "users_last_30_days":
      return data.users_last_30_days;
    default:
      return data.total_txs;
  }
};

const getGrowthValue = (
  data: DuneProjectData,
  metric: FilterMetric
): number => {
  switch (metric) {
    case "txs_last_7_days":
      return data.txs_last_7_days_perc;
    case "txs_last_30_days":
      return data.txs_last_30_days_perc;
    case "users_last_7_days":
      return data.users_last_7_days_perc;
    case "users_last_30_days":
      return data.users_last_30_days_perc;
    default:
      return 0;
  }
};

export const processDuneData = (
  data: DuneProjectData[],
  metric: FilterMetric
) => {
  return data.map((project) => {
    const category = determineCategory(project.name);
    return {
      id: project.name,
      value: getMetricValue(project, metric),
      category,
      data: project,
      growth: getGrowthValue(project, metric),
    };
  });
};

// Fixed categorization function with proper type checking
const categorizeProject = (projectName: string): Category => {
  // Define project name patterns for each category
  const categoryPatterns: Record<Category, RegExp[]> = {
    DeFi: [/uniswap/i, /swap/i, /dex/i, /finance/i, /lending/i],
    Infrastructure: [/bridge/i, /protocol/i, /infrastructure/i],
    NFTs: [/nft/i, /collection/i, /art/i],
    Games: [/game/i, /play/i, /gaming/i],
    Social: [/social/i, /chat/i, /message/i],
    Other: [/.*/], // Matches everything - used as fallback
  };

  // Check each category's patterns
  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((pattern) => pattern.test(projectName))) {
      return category as Category;
    }
  }

  return "Other";
};

// Add helper to get category color
export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    DeFi: "#3B82F6",
    Infrastructure: "#10B981",
    NFTs: "#8B5CF6",
    Games: "#F59E0B",
    Social: "#EC4899",
    Other: "#6B7280",
  };
  return colors[category];
};

// Add helper for metric formatting
export const formatMetricValue = (
  value: number,
  metric: FilterMetric
): string => {
  if (metric.includes("users")) {
    return value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `${(value / 1000).toFixed(1)}K`
      : value.toString();
  }

  if (metric.includes("txs")) {
    return value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `${(value / 1000).toFixed(1)}K`
      : value.toString();
  }

  return value.toLocaleString();
};

// Add helper for getting metric label
export const getMetricLabel = (metric: FilterMetric): string => {
  const labels: Record<FilterMetric, string> = {
    total_txs: "Total Transactions",
    total_users: "Total Users",
    txs_last_7_days: "Weekly Transactions",
    txs_last_30_days: "Monthly Transactions",
    users_last_7_days: "Weekly Users",
    users_last_30_days: "Monthly Users",
  };
  return labels[metric];
};
