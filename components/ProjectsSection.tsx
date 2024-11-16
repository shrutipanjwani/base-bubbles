// components/ProjectsSection.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { FilterOptions, FilterMetric, Category } from "@/types/registry";
import { fetchDuneData, processDuneData } from "../services/duneService";
import { BubbleChart } from "../components/BubbleChart";
import { CategorySelect } from "../components/CategorySelect";
import { CategoryLegend } from "../components/CategoryLegend";
import Loading from "../components/Loading";

export function ProjectsSection() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams?.get("highlight") || "";
  const { data, error, isLoading } = useSWR("dune-data", fetchDuneData);

  const [filters, setFilters] = useState<FilterOptions>({
    category: [] as Category[],
    metric: "txs" as FilterMetric,
  });

  const metrics = [
    { value: "txs" as FilterMetric, label: "Transactions" },
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

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="text-red-500 text-xl text-center">
        Error loading data. Please try again later.
      </div>
    );
  }

  const processedData = data ? processDuneData(data, filters.metric) : [];
  const filteredData = processedData.filter((entry) => {
    const category = entry.category as Category;
    return filters.category.length === 0 || filters.category.includes(category);
  });

  return (
    <div className="mt-6">
      <div className="flex gap-x-2 max-w-8xl px-6 mx-auto">
        <div className="w-60">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Metric
          </label>
          <select
            className="w-full h-10 bg-transparent border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <CategorySelect
          value={filters.category}
          onChange={(category) => setFilters((prev) => ({ ...prev, category }))}
          categories={categories}
        />

        <div className="p-4 rounded-lg backdrop-blur-sm">
          <CategoryLegend />
        </div>
      </div>

      <div className="h-[calc(100vh-100px)]">
        <BubbleChart
          data={filteredData.map((item) => ({
            ...item,
            category: item.category as Category,
          }))}
          filters={filters}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
