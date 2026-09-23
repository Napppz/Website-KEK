"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Plus,
  Inbox,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface AdminDataTableProps<T> {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  filters?: FilterOption[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((item: T) => string);
  initialPageSize?: number;
  emptyMessage?: string;
  actions?: (item: T) => React.ReactNode;
}

export function AdminDataTable<T extends { id: string | number }>({
  title,
  description,
  createHref,
  createLabel = "Tambah Data",
  columns,
  data,
  isLoading = false,
  filters = [],
  searchPlaceholder = "Cari data...",
  searchKey,
  initialPageSize = 10,
  emptyMessage = "Belum ada data yang tersedia.",
  actions,
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Filter & Search Logic
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      // 1. Search filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        let matches = false;

        if (typeof searchKey === "function") {
          matches = searchKey(item).toLowerCase().includes(query);
        } else if (searchKey && typeof (item as Record<string, unknown>)[searchKey as string] === "string") {
          matches = ((item as Record<string, unknown>)[searchKey as string] as string)
            .toLowerCase()
            .includes(query);
        } else {
          // Default: scan all string values in item
          matches = Object.values(item).some(
            (val) => typeof val === "string" && val.toLowerCase().includes(query)
          );
        }

        if (!matches) return false;
      }

      // 2. Custom dropdown filters
      for (const [key, val] of Object.entries(activeFilters)) {
        if (val && val !== "ALL") {
          const itemVal = (item as Record<string, unknown>)[key];
          if (String(itemVal) !== val) return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, searchKey, activeFilters]);

  // Sorting Logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as Record<string, unknown>)[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      return sortConfig.direction === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        {createHref && (
          <Link href={createHref}>
            <Button className="h-9 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs gap-1.5 shrink-0">
              <Plus className="w-4 h-4" />
              <span>{createLabel}</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9 h-9 text-xs bg-slate-50/80 border-slate-200 rounded-xl"
          />
        </div>

        {/* Dynamic Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <div key={f.key} className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={activeFilters[f.key] || "ALL"}
                onChange={(e) => {
                  setActiveFilters((prev) => ({ ...prev, [f.key]: e.target.value }));
                  setCurrentPage(1);
                }}
                className="text-xs h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">Semua {f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-xs h-9 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none ml-auto"
          >
            <option value={5}>5 baris</option>
            <option value={10}>10 baris</option>
            <option value={20}>20 baris</option>
            <option value={50}>50 baris</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3.5 px-4 font-bold ${col.className || ""} ${
                      col.sortable ? "cursor-pointer hover:bg-slate-100/80 select-none" : ""
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown
                          className={`w-3 h-3 ${
                            sortConfig?.key === col.key ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="py-3.5 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="py-16 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2.5">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <p className="text-xs font-medium text-slate-500">Memuat data dari database...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`py-3.5 px-4 ${col.className || ""}`}>
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? "-")}
                      </td>
                    ))}
                    {actions && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox className="w-8 h-8 text-slate-300" />
                      <p className="text-xs">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
          <div>
            Menampilkan{" "}
            <span className="font-semibold text-slate-700">
              {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{" "}
            dari <span className="font-semibold text-slate-700">{sortedData.length}</span> data
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-2.5 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 text-xs font-semibold text-slate-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-2.5 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
