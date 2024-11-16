// pages/index.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { BubbleChart } from "@/components/BubbleChart";
import { FilterOptions, FilterMetric, Category } from "@/types/registry";
import { fetchDuneData, processDuneData } from "@/services/duneService";

export default function Home() {
  const { data, error, isLoading } = useSWR("dune-data", fetchDuneData);

  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    metric: "txs",
  });

  const metrics = [
    { value: "txs", label: "Transactions" },
    { value: "eth_fees", label: "ETH Fees" },
    { value: "mau", label: "Monthly Active Users" },
    { value: "l2_gas_used", label: "L2 Gas Used" },
  ] as const;

  const categories: Category[] = [
    "DeFi",
    "Infrastructure",
    "NFTs",
    "Games",
    "Social",
    "Other",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

  const processedData = data ? processDuneData(data) : [];
  const filteredData = processedData.filter(
    (entry) =>
      filters.category.length === 0 ||
      filters.category.includes(entry.category as Category)
  );

  return (
    <div className="h-full bg-black">
      <div className="mx-auto">
        {/* <h1 className="text-4xl font-bold mb-8">Base Protocol Explorer</h1> */}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metric
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={filters.metric}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    metric: e.target.value as FilterMetric,
                  })
                }
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <select
                multiple
                className="w-full p-2 border rounded-lg shadow-sm bg-white min-h-[100px]"
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value as Category
                    ),
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Projects</h3>
            <p className="text-3xl font-bold">{filteredData.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Transactions</h3>
            <p className="text-3xl font-bold">
              {filteredData
                .reduce((sum, project) => sum + project.data.txs, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total ETH Fees</h3>
            <p className="text-3xl font-bold">
              {filteredData
                .reduce((sum, project) => sum + project.data.eth_fees, 0)
                .toFixed(2)}{" "}
              ETH
            </p>
          </div>
        </div>

        {/* Visualization */}
        <div className="">
          <BubbleChart
            data={filteredData.map((item) => ({
              ...item,
              category: item.category as Category,
            }))}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}
