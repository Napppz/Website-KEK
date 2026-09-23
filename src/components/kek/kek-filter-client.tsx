"use client";

import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KekCard } from "./kek-card";
import { EmptyState } from "@/components/common/states";
import { Pagination } from "@/components/common/pagination";
import type { KekWithDetails } from "@/lib/data/kek";

export interface KekFilterClientProps {
  initialKeks: KekWithDetails[];
  provinces: string[];
}

const ITEMS_PER_PAGE = 6;

export function KekFilterClient({ initialKeks, provinces }: KekFilterClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedProvince, setSelectedProvince] = React.useState("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredKeks = React.useMemo(() => {
    return initialKeks.filter((kek) => {
      // Filter status
      if (selectedStatus !== "ALL" && kek.status !== selectedStatus) {
        return false;
      }
      // Filter province
      if (selectedProvince !== "ALL" && kek.province !== selectedProvince) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesName = kek.name.toLowerCase().includes(q);
        const matchesFocus = kek.focus.toLowerCase().includes(q);
        const matchesProv = kek.province.toLowerCase().includes(q);
        const matchesCity = kek.city.toLowerCase().includes(q);
        if (!matchesName && !matchesFocus && !matchesProv && !matchesCity) {
          return false;
        }
      }
      return true;
    });
  }, [initialKeks, searchTerm, selectedProvince, selectedStatus]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleProvinceChange = (val: string) => {
    setSelectedProvince(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredKeks.length / ITEMS_PER_PAGE);
  const paginatedKeks = filteredKeks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedProvince("ALL");
    setSelectedStatus("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama KEK, komoditas fokus, kota..."
              className="pl-9 h-10 text-sm"
            />
          </div>

          {/* Province Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">Semua Provinsi</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">Semua Status Operasional</option>
              <option value="BEROPERASI">Beroperasi</option>
              <option value="TAHAP_PEMBANGUNAN">Tahap Pembangunan</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || selectedProvince !== "ALL" || selectedStatus !== "ALL") && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <strong>{filteredKeks.length}</strong> kawasan dari total{" "}
              {initialKeks.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs gap-1 text-slate-500 hover:text-slate-900"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* KEK Cards Grid */}
      {paginatedKeks.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedKeks.map((kek) => (
              <KekCard key={kek.id} kek={kek} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Kawasan yang Cocok"
          description="Coba gunakan kata kunci pencarian yang lebih umum atau sesuaikan filter provinsi dan status operasional."
          actionText="Reset Pencarian"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
