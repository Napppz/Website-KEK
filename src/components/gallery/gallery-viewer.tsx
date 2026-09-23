"use client";

import * as React from "react";
import Image from "next/image";
import { ZoomIn, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/states";
import type { Gallery } from "@/types";

export interface GalleryViewerProps {
  initialGalleries: Gallery[];
  categories: string[];
}

export function GalleryViewer({ initialGalleries, categories }: GalleryViewerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [activeItem, setActiveItem] = React.useState<Gallery | null>(null);

  const filteredGalleries = React.useMemo(() => {
    if (selectedCategory === "ALL") return initialGalleries;
    return initialGalleries.filter((g) => g.category === selectedCategory);
  }, [initialGalleries, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "ALL"
              ? "bg-[#0f284e] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Semua Dokumentasi
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-[#0f284e] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredGalleries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 cursor-pointer border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300"
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
                <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
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
          onAction={() => setSelectedCategory("ALL")}
        />
      )}

      {/* Lightbox Modal */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        {activeItem && (
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
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
