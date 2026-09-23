"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}

interface SearchFilterControlsProps {
  placeholder?: string;
  searchKey?: string;
  filters?: FilterConfig[];
  sortOptions?: FilterOption[];
  sortKey?: string;
  totalResults?: number;
  resultLabel?: string;
}

export function SearchFilterControls({
  placeholder = "Ketik kata kunci pencarian...",
  searchKey = "q",
  filters = [],
  sortOptions = [],
  sortKey = "sort",
  totalResults,
  resultLabel = "data ditemukan",
}: SearchFilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Standard React pattern for adjusting state when URL searchParams change
  const currentUrlQuery = searchParams.get(searchKey) || "";
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(currentUrlQuery);
  const [searchValue, setSearchValue] = React.useState(currentUrlQuery);

  if (currentUrlQuery !== prevUrlQuery) {
    setPrevUrlQuery(currentUrlQuery);
    setSearchValue(currentUrlQuery);
  }

  // Push new params to URL
  const updateUrl = React.useCallback(
    (newParams: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === "" || value === "ALL") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      }

      // Reset page to 1 whenever any filter or search changes
      if (!("page" in newParams)) {
        current.delete("page");
      }

      const query = current.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Debounce search update (400ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const currentValInUrl = searchParams.get(searchKey) || "";
      if (searchValue !== currentValInUrl) {
        updateUrl({ [searchKey]: searchValue ? searchValue.trim() : null });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, searchKey, searchParams, updateUrl]);

  // Check if any filter is active
  const hasActiveFilters = React.useMemo(() => {
    if (searchParams.get(searchKey)) return true;
    for (const f of filters) {
      const val = searchParams.get(f.key);
      if (val && val !== "ALL") return true;
    }
    if (sortOptions.length > 0 && searchParams.get(sortKey)) return true;
    return false;
  }, [searchParams, searchKey, filters, sortOptions, sortKey]);

  const handleReset = () => {
    setSearchValue("");
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar & Reset */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-9 h-11 bg-white border-slate-200 text-sm focus-visible:ring-amber-500 rounded-xl"
            aria-label="Kotak Pencarian"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              aria-label="Hapus kata kunci pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 px-4 gap-2 text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Filter
          </Button>
        )}
      </div>

      {/* Dropdown Filters & Sorting Bar */}
      {(filters.length > 0 || sortOptions.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            {filters.map((filter) => {
              const currentValue = searchParams.get(filter.key) || filter.defaultValue || "ALL";
              return (
                <div key={filter.key} className="flex items-center gap-1.5">
                  <label htmlFor={`filter-${filter.key}`} className="sr-only">
                    {filter.label}
                  </label>
                  <select
                    id={`filter-${filter.key}`}
                    value={currentValue}
                    onChange={(e) => updateUrl({ [filter.key]: e.target.value })}
                    className="h-9 px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="ALL">Semua {filter.label}</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Sort Dropdown & Counter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {sortOptions.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Urutan:</span>
                <select
                  id={`sort-${sortKey}`}
                  value={searchParams.get(sortKey) || sortOptions[0]?.value || ""}
                  onChange={(e) => updateUrl({ [sortKey]: e.target.value })}
                  className="h-9 px-3 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer shadow-xs"
                  aria-label="Opsi Pengurutan"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {typeof totalResults === "number" && (
              <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                <strong className="text-amber-600">{totalResults}</strong> {resultLabel}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
