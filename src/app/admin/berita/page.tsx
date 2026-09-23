"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  author?: { name: string };
  category?: { id: string; name: string };
  categoryId?: string;
  kek?: { name: string };
}

export default function AdminBeritaPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<NewsItem[]>([]);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<NewsItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const [newsRes, catRes] = await Promise.all([
          fetch("/api/berita"),
          fetch("/api/kategori-berita"),
        ]);
        const newsJson = await newsRes.json();
        const catJson = await catRes.json();

        if (isMounted) {
          if (newsJson.success && Array.isArray(newsJson.data)) {
            setData(newsJson.data);
          }
          if (catJson.success && Array.isArray(catJson.data)) {
            setCategories(catJson.data);
          }
        }
      } catch (err) {
        console.error("Gagal memuat berita:", err);
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
      const res = await fetch(`/api/berita/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus artikel berita");
      }

      addToast({
        title: "Berita Dihapus",
        description: `Artikel "${deleteTarget.title}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus berita.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (item: NewsItem) => {
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/berita/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          publishedAt: nextStatus === "PUBLISHED" ? new Date().toISOString() : null,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengubah status publikasi");
      }

      addToast({
        title: nextStatus === "PUBLISHED" ? "Berita Diterbitkan" : "Berita Dialihkan ke Draft",
        description: `Status artikel "${item.title}" diubah menjadi ${nextStatus}.`,
        type: "success",
      });

      setData((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? { ...n, status: nextStatus, publishedAt: nextStatus === "PUBLISHED" ? new Date().toISOString() : null }
            : n
        )
      );
    } catch (err) {
      addToast({
        title: "Gagal Mengubah Status",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat update status.",
        type: "error",
      });
    }
  };

  // Derive unique years
  const uniqueYears = Array.from(
    new Set(
      data.map((d) =>
        d.publishedAt
          ? new Date(d.publishedAt).getFullYear().toString()
          : new Date(d.createdAt).getFullYear().toString()
      )
    )
  ).sort((a, b) => Number(b) - Number(a));

  const formattedData = React.useMemo(
    () =>
      data.map((d) => ({
        ...d,
        year: d.publishedAt
          ? new Date(d.publishedAt).getFullYear().toString()
          : new Date(d.createdAt).getFullYear().toString(),
      })),
    [data]
  );

  const filters: FilterOption[] = [
    {
      key: "status",
      label: "Status Publikasi",
      options: [
        { label: "Published (Terbit)", value: "PUBLISHED" },
        { label: "Draft (Konsep)", value: "DRAFT" },
        { label: "Archived (Arsip)", value: "ARCHIVED" },
      ],
    },
    {
      key: "categoryId",
      label: "Kategori",
      options: categories.map((c) => ({ label: c.name, value: c.id })),
    },
    {
      key: "year",
      label: "Tahun",
      options: uniqueYears.map((y) => ({ label: y, value: y })),
    },
  ];

  const columns: Column<NewsItem>[] = [
    {
      key: "title",
      header: "Judul Berita",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5 max-w-[320px]">
          <div className="font-bold text-slate-900 line-clamp-1" title={item.title}>
            {item.title}
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">/berita/{item.slug}</div>
        </div>
      ),
    },
    {
      key: "categoryId",
      header: "Kategori",
      sortable: true,
      render: (item) => (
        <Badge variant="secondary" className="text-[10px] font-medium bg-slate-100 text-slate-700">
          {item.category?.name || "Umum"}
        </Badge>
      ),
    },
    {
      key: "author",
      header: "Penulis",
      render: (item) => (
        <span className="text-xs text-slate-600 font-medium">
          {item.author?.name || "Redaksi KEK"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => {
        const variantMap = {
          PUBLISHED: "emerald",
          DRAFT: "amber",
          ARCHIVED: "secondary",
        } as const;
        return (
          <Badge
            variant={variantMap[item.status] || "secondary"}
            className="text-[10px] font-semibold"
          >
            {item.status === "PUBLISHED"
              ? "Terbit"
              : item.status === "DRAFT"
              ? "Draft"
              : "Arsip"}
          </Badge>
        );
      },
    },
    {
      key: "publishedAt",
      header: "Tanggal Terbit",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-600">
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "- (Draft)"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-400">
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
        title="Manajemen Berita & Siaran Pers"
        description="Publikasikan rilis resmi, perkembangan industri kawasan, dan agenda lembaga KEK."
        createHref="/admin/berita/new"
        createLabel="Tulis Berita Baru"
        columns={columns}
        data={formattedData}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari judul, ringkasan, atau kata kunci artikel..."
        searchKey={(item) => `${item.title} ${item.excerpt} ${item.category?.name || ""}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/berita/${item.slug}`}
              target="_blank"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Lihat artikel publik"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTogglePublish(item)}
              className={`p-1.5 h-auto rounded-lg border ${
                item.status === "PUBLISHED"
                  ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
              title={item.status === "PUBLISHED" ? "Tarik ke Draft" : "Publikasikan"}
            >
              {item.status === "PUBLISHED" ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
            </Button>
            <Link
              href={`/admin/berita/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit naskah berita"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus berita"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Berita"
        description={`Apakah Anda yakin ingin menghapus artikel "${deleteTarget?.title}"? Tindakan ini permanen.`}
        confirmLabel="Hapus Berita"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
