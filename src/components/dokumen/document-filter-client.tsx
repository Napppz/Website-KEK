"use client";

import * as React from "react";
import { Search, Download, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/states";
import { Pagination } from "@/components/common/pagination";
import type { Document } from "@/types";

export interface DocumentFilterClientProps {
  initialDocuments: Document[];
  categories: string[];
  years: number[];
}

const ITEMS_PER_PAGE = 8;

export function DocumentFilterClient({
  initialDocuments,
  categories,
  years,
}: DocumentFilterClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [selectedYear, setSelectedYear] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredDocs = React.useMemo(() => {
    return initialDocuments.filter((doc) => {
      if (selectedCategory !== "ALL" && doc.category !== selectedCategory) {
        return false;
      }
      if (selectedYear !== "ALL" && doc.year.toString() !== selectedYear) {
        return false;
      }
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesNum = doc.documentNumber.toLowerCase().includes(q);
        const matchesDesc = doc.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNum && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [initialDocuments, searchTerm, selectedCategory, selectedYear]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedYear("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nomor peraturan, judul regulasi, atau kata kunci..."
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">Semua Kategori Regulasi</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">Semua Tahun Penetapan</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedCategory !== "ALL" || selectedYear !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menemukan <strong>{filteredDocs.length}</strong> dokumen regulasi
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

      {/* Content Container */}
      {paginatedDocs.length > 0 ? (
        <div className="space-y-6">
          {/* 1. DESKTOP TABLE VIEW */}
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1f3c] text-white text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4 w-1/4">Nomor & Kategori</th>
                  <th scope="col" className="py-3.5 px-4 w-1/2">Judul Dokumen Regulasi</th>
                  <th scope="col" className="py-3.5 px-4 text-center w-24">Tahun</th>
                  <th scope="col" className="py-3.5 px-4 text-right w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          {doc.category}
                        </Badge>
                        <p className="font-bold text-slate-900 text-xs">
                          {doc.documentNumber}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900 leading-snug">
                          {doc.title}
                        </h4>
                        {doc.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                        {doc.year}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top text-right">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0f284e] text-white hover:bg-[#1a3b6b] transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE CARD VIEW */}
          <div className="md:hidden space-y-3">
            {paginatedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {doc.category}
                  </Badge>
                  <span className="text-xs font-bold text-slate-500">Tahun {doc.year}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-800">{doc.documentNumber}</span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h4>
                  {doc.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#0f284e] text-white hover:bg-[#1a3b6b]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Berkas</span>
                  </a>
                </div>
              </div>
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
          title="Dokumen Tidak Ditemukan"
          description="Tidak ada dokumen hukum atau regulasi yang cocok dengan kriteria pencarian dan filter Anda."
          actionText="Reset Pencarian"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
