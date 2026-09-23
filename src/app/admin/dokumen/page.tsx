"use client";

import * as React from "react";
import { Plus, Search, Edit2, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DocumentDialog, type DocumentData } from "@/components/admin/document-dialog";

export default function AdminDocumentPage() {
  const [documents, setDocuments] = React.useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentData | null>(null);

  const loadDocs = React.useCallback(async () => {
    try {
      const res = await fetch("/api/dokumen");
      const json = await res.json();
      if (json.success) {
        setDocuments(json.data || []);
      }
    } catch (err) {
      console.error("Failed fetching documents", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dokumen");
        const json = await res.json();
        if (isMounted && json.success) {
          setDocuments(json.data || []);
        }
      } catch (err) {
        console.error("Failed fetching documents", err);
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
    if (!confirm(`Apakah Anda yakin ingin menghapus dokumen "${title}"?`)) return;

    try {
      const res = await fetch(`/api/dokumen/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadDocs();
      } else {
        alert(json.error || "Gagal menghapus dokumen");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus data.");
    }
  };

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Dokumen JDIH</h1>
          <p className="text-xs text-slate-500">
            Arsip regulasi, Peraturan Pemerintah, dan ketetapan hukum KEK Indonesia.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedDoc(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Dokumen JDIH
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Cari dokumen berdasarkan nomor, judul, atau perihal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat dokumen JDIH...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Tidak ada dokumen ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Judul Peraturan</th>
                  <th className="py-3 px-4">Nomor Dokumen</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tahun</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-md">
                      {doc.title}
                      {doc.description && (
                        <span className="block text-[10px] font-normal text-slate-500 line-clamp-1">
                          {doc.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      {doc.documentNumber}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="amber" className="text-[10px]">
                        {doc.category.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {doc.year}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
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
                          setSelectedDoc(doc);
                          setIsDialogOpen(true);
                        }}
                        className="h-7 w-7 p-0"
                        title="Edit Dokumen"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
                        title="Hapus Dokumen"
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

      {/* Document Modal Dialog */}
      <DocumentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={selectedDoc}
        onSuccess={loadDocs}
      />
    </div>
  );
}
