import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminGaleriPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Galeri Foto</h1>
          <p className="text-xs text-slate-500">Koleksi dokumentasi foto kawasan dan infrastruktur.</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Unggah Foto Galeri
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
        Galeri manajemen media dan kategorisasi foto.
      </div>
    </div>
  );
}
