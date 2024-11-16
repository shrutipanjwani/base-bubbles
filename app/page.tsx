"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { BubbleChart } from "@/components/BubbleChart";
import { FilterOptions, FilterMetric, Category } from "@/types/registry";
import { fetchDuneData, processDuneData } from "@/services/duneService";
import Loading from "@/components/Loading";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CategorySelect } from "@/components/CategorySelect";
import { CategoryLegend } from "@/components/CategoryLegend";
import { UserMenu } from "@/components/UserMenu";
import ModulesFooter from "@/components/ModulesFooter";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useSWR("dune-data", fetchDuneData);
  const [searchTerm, setSearchTerm] = useState(() => {
    // Initialize from URL if present
    return searchParams?.get("highlight") || "";
  });

  const [filters, setFilters] = useState<FilterOptions>({
    category: [] as Category[],
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
  const filteredData = processedData.filter((entry) => {
    const category = entry.category as Category;
    return filters.category.length === 0 || filters.category.includes(category);
  });

  return (
    <div className="h-full relative isolate bg-no-repeat bg-cover bg-center bg-[url('/modules-bg.svg')] overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-10">
        <nav
          className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={`/logo_blue.png`}
                alt="Basics"
                className="w-6"
                width={100}
                height={100}
                unoptimized
              />
              <span className="text-gray-200 text-lg">Base bubbles</span>
            </Link>
          </div>

          <div className="flex lg:hidden gap-x-8 items-center">
            <div className="w-80 relative flex items-center">
              <div className="w-full flex rounded-3xl bg-black ring-1 ring-inset ring-white/10 px-1">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                </span>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search projects built on Base"
                  value={searchTerm}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="outline-none flex-1 border-0 bg-transparent font-polysans py-2 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-2 right-0 flex py-1 pr-4">
                  <kbd className="inline-flex items-center rounded-md border border-gray-500 px-1 font-sans text-xs text-gray-500">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-1 lg:justify-end gap-4 items-center">
            <UserMenu />
          </div>
        </nav>
      </header>
      <div className="text-white mt-20 px-6 max-w-3xl text-lg">
        <h1>
          Discover new projects, protocols, and opportunities as you sail
          through your learning adventure. You're always early when you're with
          <span className="text-blue-500">&nbsp;Base Bubbles.</span>
        </h1>
      </div>
      <div className="flex gap-x-2 mt-6 max-w-8xl px-6 mx-auto">
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
        {/* Category legend */}
        <div className="p-4 rounded-lg backdrop-blur-sm">
          <CategoryLegend />
        </div>
      </div>

      {/* Visualization */}
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
      <ModulesFooter />
    </div>
  );
}
