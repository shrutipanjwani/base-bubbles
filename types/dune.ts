export interface DuneProjectData {
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

export interface DuneResponse {
  execution_id: string;
  query_id: number;
  state: string;
  result: {
    rows: DuneProjectData[];
  };
}
