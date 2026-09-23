import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminDokumenPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Dokumen JDIH</h1>
          <p className="text-xs text-slate-500">Manajemen regulasi hukum dan ketetapan menteri.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Unggah Dokumen Regulasi
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
        Tabel manajemen dokumen dan pengunggahan berkas PDF siap dikonfigurasikan.
      </div>
    </div>
  );
}
