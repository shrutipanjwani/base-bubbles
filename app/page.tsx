// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { BubbleChart } from "@/components/BubbleChart";
import { FilterOptions, FilterMetric, Category } from "@/types/registry";
import { fetchDuneData, processDuneData } from "@/services/duneService";
import Loading from "@/components/Loading";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useSWR("dune-data", fetchDuneData);
  const [searchTerm, setSearchTerm] = useState(() => {
    // Initialize from URL if present
    return searchParams?.get("highlight") || "";
  });

  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    metric: "txs" as FilterMetric,
  });

  // Handle URL search params
  useEffect(() => {
    const highlight = searchParams?.get("highlight");
    if (highlight) {
      setSearchTerm(highlight);
    }
  }, [searchParams]);

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

  const updateSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      router.push(`?highlight=${encodeURIComponent(term)}`);
    } else {
      router.push("/");
    }
  };

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-polysans">
        <div className="text-red-500 text-xl">
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

  const processedData = data ? processDuneData(data, filters.metric) : [];
  const filteredData = processedData.filter(
    (entry) =>
      filters.category.length === 0 ||
      filters.category.includes(entry.category as Category)
  );

  return (
    <div className="h-full relative isolate bg-no-repeat bg-cover bg-center bg-[url('/modules-bg.svg')] overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-cg-bold text-white my-8">Base Bubbles</h1>

        {/* Controls */}
        <div className="flex gap-4 items-end mb-8">
          <div className="w-64">
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

          <div className="w-64">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Category
            </label>
            <select
              className="w-full h-10 bg-transparent border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: [e.target.value] as Category[],
                })
              }
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="w-64">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full h-10 bg-transparent border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="h-[calc(100vh-200px)]">
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
