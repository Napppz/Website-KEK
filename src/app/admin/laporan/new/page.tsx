import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { ReportForm } from "@/components/admin/forms/report-form";

export const metadata = {
  title: "Tambah Laporan Baru | Admin KEK",
};

export default function NewReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/laporan"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Tambah Laporan Kinerja Baru
          </h1>
          <p className="text-xs text-slate-500">
            Unggah arsip dokumen laporan tahunan, evaluasi berkala, atau LAKIP.
          </p>
        </div>
      </div>

      <ReportForm />
    </div>
  );
}
