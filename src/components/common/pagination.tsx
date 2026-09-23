"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  pageKey?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageKey = "page",
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    // Default: update URL searchParams preserving existing filters
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (page === 1) {
      current.delete(pageKey);
    } else {
      current.set(pageKey, page.toString());
    }
    const query = current.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  // Generate visible page numbers (with smart ellipsis for large page counts)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-8"
      role="navigation"
      aria-label="Pagination Navigasi"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-50"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Button>

      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
        {visiblePages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="w-8 h-9 flex items-center justify-center text-slate-400">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = currentPage === pageNum;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
                isActive
                  ? "bg-[#0b1f3c] text-white border border-[#0b1f3c]"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Ke halaman ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-50"
        aria-label="Halaman selanjutnya"
      >
        <span className="hidden sm:inline">Selanjutnya</span>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </Button>
    </nav>
  );
}
