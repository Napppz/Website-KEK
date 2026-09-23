import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-2 gap-1 text-xs"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
      </Button>

      <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md transition-colors ${
              currentPage === page
                ? "bg-[#0f284e] text-white font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-2 gap-1 text-xs"
        aria-label="Halaman selanjutnya"
      >
        Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
