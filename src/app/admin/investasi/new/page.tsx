import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { InvestmentForm } from "@/components/admin/forms/investment-form";

export const metadata = {
  title: "Catat Realisasi Investasi Baru | Admin KEK",
};

export default function NewInvestmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/investasi"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Catat Realisasi Investasi Kawasan Baru
          </h1>
          <p className="text-xs text-slate-500">
            Daftarkan capaian modal investasi masuk dan penyerapan tenaga kerja per kawasan.
          </p>
        </div>
      </div>

      <InvestmentForm />
    </div>
  );
}
