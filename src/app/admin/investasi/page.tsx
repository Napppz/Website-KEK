"use client";

import * as React from "react";
import Link from "next/link";
import { Edit2, Trash2, Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";

interface InvestmentItem {
  id: string;
  kekId: string;
  year: number;
  investmentValue: number | string;
  employeeCount: number;
  description?: string | null;
  kek?: {
    name: string;
    province: string;
    focus: string;
  };
  createdAt: string;
}

export default function AdminInvestasiPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<InvestmentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<InvestmentItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/investasi");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat data investasi:", err);
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
      const res = await fetch(`/api/investasi/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus data investasi");
      }

      addToast({
        title: "Data Investasi Dihapus",
        description: `Capaian investasi tahun ${deleteTarget.year} berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus data.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueYears = Array.from(new Set(data.map((d) => d.year.toString()))).sort(
    (a, b) => Number(b) - Number(a)
  );

  const uniqueKeks = Array.from(
    new Set(data.map((d) => d.kek?.name).filter(Boolean))
  ) as string[];

  const filters: FilterOption[] = [
    {
      key: "year",
      label: "Tahun Periode",
      options: uniqueYears.map((y) => ({ label: y, value: y })),
    },
    {
      key: "kekName",
      label: "Kawasan KEK",
      options: uniqueKeks.map((k) => ({ label: k, value: k })),
    },
  ];

  const columns: Column<InvestmentItem>[] = [
    {
      key: "kek",
      header: "Kawasan KEK",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{item.kek?.name || "Kawasan KEK"}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {item.kek?.province} • {item.kek?.focus}
          </div>
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
      key: "investmentValue",
      header: "Nilai Realisasi",
      sortable: true,
      render: (item) => {
        const val = Number(item.investmentValue) || 0;
        let formatted = `Rp ${val.toLocaleString("id-ID")}`;
        if (val >= 1_000_000_000_000) {
          formatted = `Rp ${(val / 1_000_000_000_000).toFixed(2)} Triliun`;
        } else if (val >= 1_000_000_000) {
          formatted = `Rp ${(val / 1_000_000_000).toFixed(2)} Miliar`;
        }
        return (
          <span className="text-xs font-bold text-indigo-700 tracking-tight">
            {formatted}
          </span>
        );
      },
    },
    {
      key: "employeeCount",
      header: "Tenaga Kerja",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
          <Users className="w-3 h-3 text-slate-400" />
          <span>{Number(item.employeeCount).toLocaleString("id-ID")} Jiwa</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Catatan Proyek",
      render: (item) => (
        <span
          className="text-xs text-slate-500 max-w-[220px] truncate block"
          title={item.description || "-"}
        >
          {item.description || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Dicatat",
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
        title="Manajemen Realisasi Investasi & Tenaga Kerja"
        description="Kelola pencatatan komitmen modal masuk, serapan lapangan kerja, dan data tren investasi per kawasan KEK."
        createHref="/admin/investasi/new"
        createLabel="Catat Investasi Baru"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari nama kawasan, catatan investor, atau tahun..."
        searchKey={(item) =>
          `${item.kek?.name || ""} ${item.year} ${item.description || ""} ${item.kek?.province || ""}`
        }
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              href={`/admin/investasi/${item.id}/edit`}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-colors"
              title="Edit data investasi"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus data investasi"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Data Investasi"
        description={`Apakah Anda yakin ingin menghapus data realisasi investasi ${deleteTarget?.kek?.name} tahun ${deleteTarget?.year}? Statistik capaian akan diperbarui otomatis.`}
        confirmLabel="Hapus Data"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
