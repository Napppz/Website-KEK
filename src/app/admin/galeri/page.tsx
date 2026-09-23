"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
  kek?: { name: string } | null;
  createdAt: string;
}

export default function AdminGaleriPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/galeri");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat galeri:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/galeri/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus foto");
      }

      addToast({
        title: "Foto Galeri Dihapus",
        description: `Foto "${deleteTarget.title}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus foto.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueCategories = Array.from(new Set(data.map((d) => d.category))).sort();

  const filters: FilterOption[] = [
    {
      key: "category",
      label: "Kategori Foto",
      options: uniqueCategories.map((c) => ({ label: c, value: c })),
    },
  ];

  const columns: Column<GalleryItem>[] = [
    {
      key: "image",
      header: "Pratinjau",
      render: (item) => (
        <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Judul Foto & Keterangan",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5 max-w-[340px]">
          <div className="font-bold text-slate-900 line-clamp-1" title={item.title}>
            {item.title}
          </div>
          {item.description && (
            <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
          )}
          {item.kek && (
            <span className="text-[10px] text-blue-600 font-medium block">
              Kawasan: {item.kek.name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      sortable: true,
      render: (item) => (
        <Badge variant="pink" className="text-[10px] font-semibold">
          {item.category}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Diunggah",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">
          {new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable
        title="Manajemen Galeri & Dokumentasi Visual"
        description="Kelola foto peresmian industri, pembangunan infrastruktur, dan kegiatan strategis KEK."
        createHref="/admin/galeri/new"
        createLabel="Tambah Foto Baru"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari judul foto, kawasan, atau kategori..."
        searchKey={(item) => `${item.title} ${item.category} ${item.description || ""}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            {item.imageUrl && (
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Buka gambar resolusi penuh"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href={`/admin/galeri/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit foto"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus foto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Foto Galeri"
        description={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.title}"? Foto ini akan dihapus dari galeri publik.`}
        confirmLabel="Hapus Foto"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
