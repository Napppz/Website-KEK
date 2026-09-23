"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ZoomIn, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/states";
import type { Gallery } from "@/types";

export interface GalleryViewerProps {
  initialGalleries: Gallery[];
  categories: string[];
  activeCategory?: string;
}

export function GalleryViewer({
  initialGalleries,
  categories,
  activeCategory = "ALL",
}: GalleryViewerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeItem, setActiveItem] = React.useState<Gallery | null>(null);

  const handleCategorySelect = (cat: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (cat === "ALL") {
      current.delete("category");
    } else {
      current.set("category", cat);
    }
    current.delete("page"); // reset to page 1
    const query = current.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategorySelect("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
            activeCategory === "ALL"
              ? "bg-[#0b1f3c] text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          Semua Dokumentasi
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
              activeCategory === cat
                ? "bg-[#0b1f3c] text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {initialGalleries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialGalleries.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 cursor-pointer border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-[10px] bg-white/90 font-bold backdrop-blur-xs">
                  <Tag className="w-3 h-3 mr-1 text-blue-700" />
                  {item.category}
                </Badge>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-2.5 rounded-full bg-white/95 text-slate-900 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-sm">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Foto dalam Kategori Ini"
          description="Silakan pilih kategori dokumentasi lain untuk melihat foto kawasan."
          actionText="Lihat Semua Foto"
          onAction={() => handleCategorySelect("ALL")}
        />
      )}

      {/* Lightbox Modal */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        {activeItem && (
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-slate-950 border-slate-800 text-white rounded-2xl">
            <div className="relative w-full h-[380px] sm:h-[480px] bg-black">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6 space-y-2 bg-[#0b1f3c]">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-[10px]">
                  {activeItem.category}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-white">
                {activeItem.title}
              </DialogTitle>
              {activeItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeItem.description}
                </p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
