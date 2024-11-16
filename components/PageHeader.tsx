// components/PageHeader.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserMenu } from "../components/UserMenu";

export function PageHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams?.get("highlight") || "";
  });

  useEffect(() => {
    const highlight = searchParams?.get("highlight");
    if (highlight) {
      setSearchTerm(highlight);
    }
  }, [searchParams]);

  const updateSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      router.push(`?highlight=${encodeURIComponent(term)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-10">
        <nav className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4">
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo_blue.png"
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
          through your learning adventure. You&apos;re always early when
          you&apos;re with
          <span className="text-blue-500">&nbsp;Base Bubbles.</span>
        </h1>
      </div>
    </>
  );
}
