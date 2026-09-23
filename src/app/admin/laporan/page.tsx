"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, BarChart3, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface ReportItem {
  id: string;
  title: string;
  year: number;
  fileUrl: string;
  description?: string | null;
  createdAt: string;
}

export default function AdminLaporanPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<ReportItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/laporan");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
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
      const res = await fetch(`/api/laporan/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus laporan");
      }

      addToast({
        title: "Laporan Dihapus",
        description: `Laporan "${deleteTarget.title}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus laporan.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueYears = Array.from(new Set(data.map((d) => d.year.toString()))).sort(
    (a, b) => Number(b) - Number(a)
  );

  const filters: FilterOption[] = [
    {
      key: "year",
      label: "Tahun Periode",
      options: uniqueYears.map((y) => ({ label: y, value: y })),
    },
  ];

  const columns: Column<ReportItem>[] = [
    {
      key: "title",
      header: "Judul Laporan",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5 max-w-[360px]">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="line-clamp-1" title={item.title}>
              {item.title}
            </span>
          </div>
          {item.description && (
            <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "year",
      header: "Tahun",
      sortable: true,
      render: (item) => (
        <Badge variant="blue" className="text-xs font-semibold">
          {item.year}
        </Badge>
      ),
    },
    {
      key: "fileUrl",
      header: "Berkas PDF",
      render: (item) => (
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-medium"
        >
          <Download className="w-3 h-3" />
          <span>Unduh PDF</span>
        </a>
      ),
    },
    {
      key: "createdAt",
      header: "Diarsipkan",
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
        title="Manajemen Laporan Kinerja & Akuntabilitas"
        description="Kelola arsip dokumen laporan tahunan, evaluasi berkala capaian target, dan LAKIP KEK Indonesia."
        createHref="/admin/laporan/new"
        createLabel="Tambah Laporan Baru"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari judul laporan atau ringkasan..."
        searchKey={(item) => `${item.title} ${item.year} ${item.description || ""}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Lihat berkas laporan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/admin/laporan/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit laporan"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus laporan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Laporan"
        description={`Apakah Anda yakin ingin menghapus laporan "${deleteTarget?.title}"? Dokumen ini akan dihapus dari arsip publik.`}
        confirmLabel="Hapus Laporan"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
