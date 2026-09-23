"use client";

import * as React from "react";
import { Plus, Search, Edit2, Trash2, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NewsDialog, type NewsData, type NewsCategoryItem } from "@/components/admin/news-dialog";
import { formatDate } from "@/lib/utils";

export default function AdminNewsPage() {
  const [news, setNews] = React.useState<NewsData[]>([]);
  const [categories, setCategories] = React.useState<NewsCategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedNews, setSelectedNews] = React.useState<NewsData | null>(null);

  const loadNews = React.useCallback(async () => {
    try {
      const res = await fetch("/api/berita");
      const json = await res.json();
      if (json.success) {
        setNews(json.data || []);
      }
    } catch (err) {
      console.error("Failed fetching news", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/berita");
        const json = await res.json();
        if (isMounted && json.success) {
          setNews(json.data || []);
        }
        if (isMounted) {
          setCategories([
            { id: "cat-1", name: "Siaran Pers", slug: "siaran-pers" },
            { id: "cat-2", name: "Investasi & Ekonomi", slug: "investasi" },
            { id: "cat-3", name: "Infrastruktur & Zona", slug: "infrastruktur" },
            { id: "cat-4", name: "Kegiatan Lembaga", slug: "kegiatan" },
          ]);
        }
      } catch (err) {
        console.error("Failed fetching news", err);
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
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel berita "${title}"?`)) return;

    try {
      const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadNews();
      } else {
        alert(json.error || "Gagal menghapus berita");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus data.");
    }
  };

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.excerpt && n.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Berita & Siaran Pers</h1>
          <p className="text-xs text-slate-500">
            Publikasi siaran resmi dan artikel informasi Kawasan Ekonomi Khusus.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedNews(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Berita Baru
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Cari berita berdasarkan judul atau isi ringkasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data berita...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada berita ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Judul Artikel</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tanggal Rilis</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((item) => {
                  const isPublished = item.status === "PUBLISHED";
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-sm truncate">
                        {item.title}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {item.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <Badge variant="blue" className="text-[10px]">
                          {item.category?.name || "Siaran Pers"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate((item.publishedAt || new Date()).toString())}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.author?.name || "Administrator"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isPublished ? "emerald" : "outline"} className="text-[10px]">
                          {isPublished ? "Terbit" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedNews(item);
                            setIsDialogOpen(true);
                          }}
                          className="h-7 w-7 p-0"
                          title="Edit Berita"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
                          title="Hapus Berita"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* News Modal Dialog */}
      <NewsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedNews}
        categories={categories}
        onSuccess={loadNews}
      />
    </div>
  );
}
