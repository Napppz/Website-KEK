"use client";

import * as React from "react";
import { Plus, Search, Edit2, Trash2, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportDialog, type ReportData } from "@/components/admin/report-dialog";

export default function AdminReportPage() {
  const [reports, setReports] = React.useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<ReportData | null>(null);

  const loadReports = React.useCallback(async () => {
    try {
      const res = await fetch("/api/laporan");
      const json = await res.json();
      if (json.success) {
        setReports(json.data || []);
      }
    } catch (err) {
      console.error("Failed fetching reports", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/laporan");
        const json = await res.json();
        if (isMounted && json.success) {
          setReports(json.data || []);
        }
      } catch (err) {
        console.error("Failed fetching reports", err);
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
    if (!confirm(`Apakah Anda yakin ingin menghapus laporan "${title}"?`)) return;

    try {
      const res = await fetch(`/api/laporan/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadReports();
      } else {
        alert(json.error || "Gagal menghapus laporan");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus data.");
    }
  };

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Laporan Kinerja Tahunan</h1>
          <p className="text-xs text-slate-500">
            Arsip dokumen publikasi akuntabilitas kinerja kawasan.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedReport(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Laporan Baru
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Cari laporan berdasarkan judul atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat laporan tahunan...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <BarChart3 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada laporan ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Judul Laporan</th>
                  <th className="py-3 px-4">Tahun</th>
                  <th className="py-3 px-4">Deskripsi Ringkas</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-sm">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-bold">
                      {item.year}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                      {item.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Unduh Berkas PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(item);
                          setIsDialogOpen(true);
                        }}
                        className="h-7 w-7 p-0"
                        title="Edit Laporan"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
                        title="Hapus Laporan"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Modal Dialog */}
      <ReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedReport}
        onSuccess={loadReports}
      />
    </div>
  );
}
