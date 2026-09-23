"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface KekItem {
  id: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  area: number;
  focus: string;
  status: "BEROPERASI" | "TAHAP_PEMBANGUNAN";
  createdAt: string;
}

export default function AdminKekPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<KekItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<KekItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/kek");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat data KEK:", err);
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
      const res = await fetch(`/api/kek/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus data KEK");
      }

      addToast({
        title: "Data KEK Dihapus",
        description: `Kawasan ${deleteTarget.name} berhasil dihapus dari sistem.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus KEK.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Provinces filter options derived dynamically
  const uniqueProvinces = Array.from(new Set(data.map((d) => d.province))).sort();
  const filters: FilterOption[] = [
    {
      key: "status",
      label: "Status Operasional",
      options: [
        { label: "Beroperasi", value: "BEROPERASI" },
        { label: "Tahap Pembangunan", value: "TAHAP_PEMBANGUNAN" },
      ],
    },
    {
      key: "province",
      label: "Provinsi",
      options: uniqueProvinces.map((p) => ({ label: p, value: p })),
    },
  ];

  const columns: Column<KekItem>[] = [
    {
      key: "name",
      header: "Nama KEK",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">/kek/{item.slug}</div>
        </div>
      ),
    },
    {
      key: "province",
      header: "Provinsi",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{item.province}</span>
        </div>
      ),
    },
    {
      key: "city",
      header: "Kota / Kab",
      sortable: true,
      render: (item) => <span className="text-xs text-slate-600">{item.city}</span>,
    },
    {
      key: "area",
      header: "Luas (Ha)",
      sortable: true,
      render: (item) => (
        <span className="text-xs font-semibold text-slate-800">
          {Number(item.area).toLocaleString("id-ID")} Ha
        </span>
      ),
    },
    {
      key: "focus",
      header: "Sektor Fokus",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-600 max-w-[180px] truncate block" title={item.focus}>
          {item.focus}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => (
        <Badge
          variant={item.status === "BEROPERASI" ? "emerald" : "amber"}
          className="text-[10px] font-semibold"
        >
          {item.status === "BEROPERASI" ? "Beroperasi" : "Tahap Pembangunan"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Terdaftar",
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
        title="Manajemen Kawasan Ekonomi Khusus"
        description="Kelola spesifikasi, lokasi koordinat GIS, letak wilayah, dan status operasional KEK Indonesia."
        createHref="/admin/kek/new"
        createLabel="Tambah KEK Baru"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari nama kawasan, provinsi, atau sektor fokus..."
        searchKey={(item) => `${item.name} ${item.province} ${item.city} ${item.focus}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/kek/${item.slug}`}
              target="_blank"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Lihat halaman publik"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/admin/kek/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit data KEK"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus data KEK"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Kawasan KEK"
        description={`Apakah Anda yakin ingin menghapus data KEK "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus KEK"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
