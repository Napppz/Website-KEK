"use client";

import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsCard } from "./news-card";
import { EmptyState } from "@/components/common/states";
import { Pagination } from "@/components/common/pagination";
import type { NewsWithRelations } from "@/lib/data/news";
import type { NewsCategory } from "@/types";

export interface NewsFilterClientProps {
  initialNews: NewsWithRelations[];
  categories: NewsCategory[];
}

const ITEMS_PER_PAGE = 6;

export function NewsFilterClient({ initialNews, categories }: NewsFilterClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredNews = React.useMemo(() => {
    return initialNews.filter((item) => {
      if (selectedCategory !== "ALL" && item.category.slug !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesExcerpt = item.excerpt.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt) {
          return false;
        }
      }
      return true;
    });
  }, [initialNews, searchTerm, selectedCategory]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-[#0f284e] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua Berita
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-[#0f284e] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari judul berita..."
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {(searchTerm || selectedCategory !== "ALL") && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menampilkan <strong>{filteredNews.length}</strong> artikel berita
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs gap-1 text-slate-500 hover:text-slate-900"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          </div>
        )}
      </div>

      {/* Grid */}
      {paginatedNews.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNews.map((news) => (
              <NewsCard key={news.id} news={news} />
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
          title="Tidak Ada Berita yang Cocok"
          description="Coba cari dengan kata kunci lain atau pilih kategori berita lainnya."
          actionText="Tampilkan Semua Berita"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}
