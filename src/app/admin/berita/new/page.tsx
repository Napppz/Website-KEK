import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { NewsForm } from "@/components/admin/forms/news-form";

export const metadata = {
  title: "Tulis Berita Baru | Admin KEK",
};

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/berita"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-600" />
            Tulis Artikel & Siaran Pers Baru
          </h1>
          <p className="text-xs text-slate-500">
            Publikasikan kabar terbaru seputar Kawasan Ekonomi Khusus ke portal publik.
          </p>
        </div>
      </div>

      <NewsForm />
    </div>
  );
}
