import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminBeritaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Berita & Siaran Pers</h1>
          <p className="text-xs text-slate-500">Publikasi artikel, berita kawasan, dan siaran pers resmi.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Tulis Berita Baru
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
        Tabel manajemen berita dan integrasi Rich Text Editor (Tiptap) disiapkan untuk modul publikasi.
      </div>
    </div>
  );
}
