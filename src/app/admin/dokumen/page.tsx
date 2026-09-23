"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, FileText, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface DocumentItem {
  id: string;
  title: string;
  documentNumber: string;
  year: number;
  category: string;
  fileUrl: string;
  description?: string | null;
  kek?: { name: string } | null;
  createdAt: string;
}

export default function AdminDocumentPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/dokumen");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat dokumen:", err);
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
      const res = await fetch(`/api/dokumen/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus dokumen");
      }

      addToast({
        title: "Dokumen Dihapus",
        description: `Regulasi "${deleteTarget.documentNumber}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus dokumen.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Derive categories and years for filters
  const uniqueCategories = Array.from(new Set(data.map((d) => d.category))).sort();
  const uniqueYears = Array.from(new Set(data.map((d) => d.year.toString()))).sort(
    (a, b) => Number(b) - Number(a)
  );

  const filters: FilterOption[] = [
    {
      key: "category",
      label: "Kategori Regulasi",
      options: uniqueCategories.map((c) => ({ label: c, value: c })),
    },
    {
      key: "year",
      label: "Tahun",
      options: uniqueYears.map((y) => ({ label: y, value: y })),
    },
  ];

  const columns: Column<DocumentItem>[] = [
    {
      key: "documentNumber",
      header: "Nomor Dokumen",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{item.documentNumber}</span>
          </div>
          <div className="text-[11px] text-slate-400">Tahun {item.year}</div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Tentang / Judul Dokumen",
      sortable: true,
      render: (item) => (
        <div className="max-w-[340px]">
          <span className="text-xs text-slate-800 line-clamp-2" title={item.title}>
            {item.title}
          </span>
          {item.kek && (
            <span className="text-[10px] text-blue-600 font-medium block mt-0.5">
              Terkait: {item.kek.name}
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
        <Badge variant="outline" className="text-[10px] font-semibold border-slate-200">
          {item.category}
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
          <span>Unduh</span>
        </a>
      ),
    },
    {
      key: "createdAt",
      header: "Ditambahkan",
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
        title="Manajemen Dokumen JDIH & Regulasi"
        description="Kelola arsip Undang-Undang, Peraturan Pemerintah, dan ketetapan perundangan Kawasan Ekonomi Khusus."
        createHref="/admin/dokumen/new"
        createLabel="Tambah Regulasi Baru"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari nomor dokumen, judul perundangan, atau tahun..."
        searchKey={(item) => `${item.documentNumber} ${item.title} ${item.category} ${item.year}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Lihat berkas dokumen"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/admin/dokumen/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit dokumen"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus dokumen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Dokumen JDIH"
        description={`Apakah Anda yakin ingin menghapus regulasi "${deleteTarget?.documentNumber}"? Berkas tidak akan lagi tersedia di portal JDIH publik.`}
        confirmLabel="Hapus Dokumen"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
