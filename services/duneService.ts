// services/duneService.ts
import axios from "axios";
import { DuneResponse, DuneProjectData } from "@/types/dune";

const DUNE_API_KEY = "ba8z8nKejzSinmTGTzrVRgfbCLDACqpr";
const DUNE_API_URL = "https://api.dune.com/api/v1/endpoints";

export const fetchDuneData = async (): Promise<DuneProjectData[]> => {
  try {
    const response = await axios.get<DuneResponse>(
      `${DUNE_API_URL}/shrutz/base-bubbles/results`,
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

// Helper function to process the data for visualization
export const processDuneData = (data: DuneProjectData[]) => {
  return data.map((project) => ({
    id: project.project_name,
    value: project.txs, // Can be changed to eth_fees or mau based on metric
    category: categorizeProject(project.project_name),
    data: project,
  }));
};

// Helper function to categorize projects
const categorizeProject = (projectName: string): string => {
  const categories: Record<string, string> = {
    Uniswap: "DeFi",
    "Uniswap V2": "DeFi",
    Bridge: "Infrastructure",
    NFT: "NFTs",
    Gaming: "Games",
    Social: "Social",
    Other: "Other",
  };

  for (const [key, category] of Object.entries(categories)) {
    if (projectName.includes(key)) {
      return category;
    }
  }

  return "Other";
};
