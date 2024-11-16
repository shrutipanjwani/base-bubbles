export type Category =
  | "DeFi"
  | "Infrastructure"
  | "NFTs"
  | "Games"
  | "Social"
  | "Other";

export type FilterMetric =
  | "total_txs"
  | "total_users"
  | "txs_last_7_days"
  | "txs_last_30_days"
  | "users_last_7_days"
  | "users_last_30_days";

export interface DuneProjectData {
  name: string;
  total_txs: number;
  total_users: number;
  txs_last_7_days: number;
  txs_last_7_days_perc: number;
  txs_last_30_days: number;
  txs_last_30_days_perc: number;
  users_last_7_days: number;
  users_last_7_days_perc: number;
  users_last_30_days: number;
  users_last_30_days_perc: number;
}

export interface ProcessedProjectData {
  id: string;
  value: number;
  category: Category;
  data: DuneProjectData;
  growth: number; // Store relevant growth percentage
}

export interface FilterOptions {
  category: Category[];
  metric: FilterMetric;
}
