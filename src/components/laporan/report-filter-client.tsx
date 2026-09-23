"use client";

import * as React from "react";
import { Search, Download, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/states";
import { Pagination } from "@/components/common/pagination";
import type { Report } from "@/types";

export interface ReportFilterClientProps {
  initialReports: Report[];
  years: number[];
}

const ITEMS_PER_PAGE = 6;

export function ReportFilterClient({ initialReports, years }: ReportFilterClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredReports = React.useMemo(() => {
    return initialReports.filter((rep) => {
      if (selectedYear !== "ALL" && rep.year.toString() !== selectedYear) {
        return false;
      }
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesTitle = rep.title.toLowerCase().includes(q);
        const matchesDesc = rep.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [initialReports, searchTerm, selectedYear]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="p-4 sm:p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul laporan tahunan..."
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">Semua Tahun Pelaporan</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedYear !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menemukan <strong>{filteredReports.length}</strong> publikasi laporan
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

      {/* Reports Grid */}
      {paginatedReports.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedReports.map((report) => (
              <Card
                key={report.id}
                className="group hover:shadow-md transition-shadow border-slate-200 bg-white flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="blue" className="bg-[#0b1f3c] text-white">
                        Laporan Resmi
                      </Badge>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Tahun {report.year}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                      {report.title}
                    </h3>

                    {report.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {report.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Format: Dokumen Digital (PDF)
                    </span>
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0f284e] text-white hover:bg-[#1a3b6b] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh Laporan
                    </a>
                  </div>
                </CardContent>
              </Card>
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
          title="Laporan Tidak Ditemukan"
          description="Coba cari dengan kata kunci lain atau pilih tahun pelaporan lainnya."
          actionText="Reset Pencarian"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
