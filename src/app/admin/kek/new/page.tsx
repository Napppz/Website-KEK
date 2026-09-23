import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { KEKForm } from "@/components/admin/forms/kek-form";

export const metadata = {
  title: "Tambah Kawasan KEK Baru | Admin KEK",
};

export default function NewKekPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/kek"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Tambah Kawasan Ekonomi Khusus Baru
          </h1>
          <p className="text-xs text-slate-500">
            Daftarkan entitas kawasan baru ke dalam direktori portal KEK Indonesia.
          </p>
        </div>
      </div>

      <KEKForm />
    </div>
  );
}
