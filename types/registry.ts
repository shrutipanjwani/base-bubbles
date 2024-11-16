// types/registry.ts
export type Category =
  | "DeFi"
  | "Infrastructure"
  | "NFTs"
  | "Games"
  | "Social"
  | "Other";
export type FilterMetric = "txs" | "eth_fees" | "mau" | "l2_gas_used";

export interface ProjectData {
  project_name: string;
  txs: number;
  mau: number;
  eth_fees: number;
  l2_gas_used: number;
  pct_txs: number;
  pct_fees: number;
  pct_l2_gas_used: number;
  annual_eth_fees_per_addr: number;
}

export interface ProcessedProjectData {
  id: string;
  value: number;
  category: string;
  data: ProjectData;
}

export interface FilterOptions {
  category: Category[];
  metric: FilterMetric;
}

// data/sampleData.ts
export const sampleData: ProjectData[] = [
  {
    project_name: "Uniswap",
    txs: 15340463,
    mau: 11052022,
    eth_fees: 33.10755025977288,
    l2_gas_used: 2013037418352,
    pct_txs: 0.15139631100170595,
    pct_fees: 0.03970352248664025,
    pct_l2_gas_used: 0.07566154178571674,
    annual_eth_fees_per_addr: 0.0010933977370672172,
  },
  {
    project_name: "Other",
    txs: 51796348,
    mau: 4273374,
    eth_fees: 523.5161610852299,
    l2_gas_used: 14874459896807,
    pct_txs: 0.5111824858585162,
    pct_fees: 0.6278155741115711,
    pct_l2_gas_used: 0.5590678835684906,
    annual_eth_fees_per_addr: 0.04471487840664283,
  },
  {
    project_name: "Uniswap V2",
    txs: 12237366,
    mau: 5784092,
    eth_fees: 16.98659208696204,
    l2_gas_used: 1633731574378,
    pct_txs: 0.12077158745324065,
    pct_fees: 0.02037080773431738,
    pct_l2_gas_used: 0.06140504327169504,
    annual_eth_fees_per_addr: 0.0010719238407240314,
  },
];

// Helper functions
export const formatValue = (value: number, metric: FilterMetric): string => {
  switch (metric) {
    case "txs":
      return value.toLocaleString();
    case "eth_fees":
      return `${value.toFixed(2)} ETH`;
    case "mau":
      return value.toLocaleString();
    case "l2_gas_used":
      return `${(value / 1e9).toFixed(2)}B`;
    default:
      return value.toString();
  }
};

export const getMetricLabel = (metric: FilterMetric): string => {
  const labels: Record<FilterMetric, string> = {
    txs: "Transactions",
    eth_fees: "ETH Fees",
    mau: "Monthly Active Users",
    l2_gas_used: "L2 Gas Used",
  };
  return labels[metric];
};

export const getMetricTooltip = (metric: FilterMetric): string => {
  const tooltips: Record<FilterMetric, string> = {
    txs: "Total number of transactions",
    eth_fees: "Total ETH fees collected",
    mau: "Monthly Active Users",
    l2_gas_used: "Total L2 gas used by the protocol",
  };
  return tooltips[metric];
};
