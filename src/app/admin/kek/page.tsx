"use client";

import * as React from "react";
import { Plus, Search, Edit2, Trash2, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KekDialog, type KekData } from "@/components/admin/kek-dialog";

export default function AdminKekPage() {
  const [keks, setKeks] = React.useState<KekData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedKek, setSelectedKek] = React.useState<KekData | null>(null);

  const loadKeks = React.useCallback(async () => {
    try {
      const res = await fetch("/api/kek");
      const json = await res.json();
      if (json.success) {
        setKeks(json.data || []);
      }
    } catch (err) {
      console.error("Failed fetching KEKs", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/kek");
        const json = await res.json();
        if (isMounted && json.success) {
          setKeks(json.data || []);
        }
      } catch (err) {
        console.error("Failed fetching KEKs", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data Kawasan ${name}?`)) return;

    try {
      const res = await fetch(`/api/kek/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadKeks();
      } else {
        alert(json.error || "Gagal menghapus KEK");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus data.");
    }
  };

  const filtered = keks.filter(
    (k) =>
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Kawasan Ekonomi Khusus</h1>
          <p className="text-xs text-slate-500">
            Daftar entitas KEK terdaftar di seluruh wilayah Republik Indonesia.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedKek(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Kawasan Baru
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Cari kawasan berdasarkan nama, provinsi, atau sektor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data KEK...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada data KEK ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Kawasan</th>
                  <th className="py-3 px-4">Provinsi & Lokasi</th>
                  <th className="py-3 px-4">Luas (Ha)</th>
                  <th className="py-3 px-4">Fokus Industri</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((kek) => {
                  const isOperating = kek.status === "BEROPERASI";
                  return (
                    <tr key={kek.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {kek.name}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {kek.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          {kek.province} ({kek.city})
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {kek.area} Ha
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {kek.focus}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={isOperating ? "emerald" : "amber"} className="text-[10px]">
                          {isOperating ? "Beroperasi" : "Pembangunan"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedKek(kek);
                            setIsDialogOpen(true);
                          }}
                          className="h-7 w-7 p-0"
                          title="Edit KEK"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(kek.id, kek.name)}
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
                          title="Hapus KEK"
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

      {/* KEK Modal Dialog */}
      <KekDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedKek}
        onSuccess={loadKeks}
      />
    </div>
  );
}
