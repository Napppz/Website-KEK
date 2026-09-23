"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GalleryDialog, type GalleryData } from "@/components/admin/gallery-dialog";

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = React.useState<GalleryData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedGallery, setSelectedGallery] = React.useState<GalleryData | null>(null);

  const loadGalleries = React.useCallback(async () => {
    try {
      const res = await fetch("/api/galeri");
      const json = await res.json();
      if (json.success) {
        setGalleries(json.data || []);
      }
    } catch (err) {
      console.error("Failed fetching galleries", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/galeri");
        const json = await res.json();
        if (isMounted && json.success) {
          setGalleries(json.data || []);
        }
      } catch (err) {
        console.error("Failed fetching galleries", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus foto "${title}"?`)) return;

    try {
      const res = await fetch(`/api/galeri/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadGalleries();
      } else {
        alert(json.error || "Gagal menghapus foto galeri");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus data.");
    }
  };

  const filtered = galleries.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Galeri Foto Kawasan</h1>
          <p className="text-xs text-slate-500">
            Dokumentasi foto kegiatan operasional, peresmian, dan progres pembangunan KEK.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedGallery(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto Baru
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Cari foto berdasarkan judul atau kategori album..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Memuat galeri foto...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Tidak ada foto galeri ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group"
            >
              <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-[10px] bg-white/90 font-bold backdrop-blur-xs">
                    <Tag className="w-3 h-3 mr-1 text-blue-700" />
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedGallery(item);
                      setIsDialogOpen(true);
                    }}
                    className="gap-1 text-[11px] h-7 px-2"
                  >
                    <Edit2 className="w-3 h-3 text-blue-600" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="gap-1 text-[11px] text-red-600 hover:bg-red-50 hover:border-red-200 h-7 px-2"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Modal Dialog */}
      <GalleryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedGallery}
        onSuccess={loadGalleries}
      />
    </div>
  );
}
