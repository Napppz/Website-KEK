import { Metadata } from "next";
import Link from "next/link";
import { Search, Building2, Newspaper, FileText, BarChart3, ArrowRight, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { performGlobalSearch, SearchItem } from "@/lib/data/search";
import { globalSearchQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "Pencarian Terpadu Portal KEK Indonesia",
  description: "Cari data profil kawasan KEK, berita dan siaran pers resmi, regulasi JDIH, serta publikasi laporan akuntabilitas kinerja.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GlobalSearchPage({ searchParams }: SearchPageProps) {
  const rawParams = await searchParams;
  const parsed = globalSearchQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : "",
    tab: typeof rawParams.tab === "string" ? rawParams.tab : "ALL",
  });

  const { q, tab } = parsed.success ? parsed.data : { q: "", tab: "ALL" };
  const results = await performGlobalSearch(q);

  const tabs = [
    { key: "ALL", label: "Semua Hasil", count: results.total },
    { key: "KEK", label: "Kawasan KEK", count: results.keks.length, icon: Building2 },
    { key: "NEWS", label: "Berita & Siaran Pers", count: results.news.length, icon: Newspaper },
    { key: "DOCUMENT", label: "Dokumen JDIH", count: results.documents.length, icon: FileText },
    { key: "REPORT", label: "Laporan Kinerja", count: results.reports.length, icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Pencarian Global"
        title="Pencarian Terpadu Portal KEK"
        description="Temukan informasi kawasan, siaran pers, regulasi hukum, dan laporan tahunan secara terintegrasi di seluruh basis data resmi KEK Republik Indonesia."
        breadcrumbs={[{ label: "Pencarian" }]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* Search Bar Form */}
        <form action="/search" method="GET" className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari kawasan (misal: Kendal, Sei Mangkei), regulasi, atau berita..."
            className="w-full h-14 pl-12 pr-28 rounded-2xl border border-slate-300 bg-white shadow-xs text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#0b1f3c] text-white font-semibold text-xs rounded-xl hover:bg-[#1a3b6b] transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Query Summary & Category Tabs */}
        {q ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="text-sm text-slate-600">
                Menampilkan hasil pencarian untuk kata kunci: <strong className="text-slate-900 font-bold">&ldquo;{q}&rdquo;</strong>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Ditemukan <span className="text-amber-600 font-bold">{results.total}</span> hasil yang cocok
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {tabs.map((item) => {
                const isActive = tab === item.key;
                return (
                  <Link
                    key={item.key}
                    href={`/search?q=${encodeURIComponent(q)}&tab=${item.key}`}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-[#0b1f3c] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-amber-500 text-slate-950 font-bold" : "bg-white text-slate-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Mulai Pencarian Informasi</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Masukkan kata kunci seperti nama kawasan, bidang industri, nomor peraturan, atau topik berita pada kolom di atas.
            </p>
          </div>
        )}

        {/* Results Sections */}
        {q && results.total === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto font-bold text-lg">
              !
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data tidak ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Tidak ada entitas KEK, artikel berita, regulasi JDIH, atau berkas laporan yang sesuai dengan kata kunci &ldquo;{q}&rdquo;.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Hapus Pencarian
              </Link>
            </div>
          </div>
        )}

        {q && results.total > 0 && (
          <div className="space-y-8">
            {/* 1. KEK Results */}
            {(tab === "ALL" || tab === "KEK") && results.keks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b1f3c] border-b border-slate-200 pb-2">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <span>Kawasan Ekonomi Khusus ({results.keks.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.keks.map((item) => (
                    <SearchResultCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* 2. News Results */}
            {(tab === "ALL" || tab === "NEWS") && results.news.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b1f3c] border-b border-slate-200 pb-2">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>Berita & Siaran Pers ({results.news.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.news.map((item) => (
                    <SearchResultCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Document Results */}
            {(tab === "ALL" || tab === "DOCUMENT") && results.documents.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b1f3c] border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Dokumen Regulasi JDIH ({results.documents.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.documents.map((item) => (
                    <SearchResultCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* 4. Report Results */}
            {(tab === "ALL" || tab === "REPORT") && results.reports.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0b1f3c] border-b border-slate-200 pb-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Laporan Kinerja ({results.reports.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.reports.map((item) => (
                    <SearchResultCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ item }: { item: SearchItem }) {
  return (
    <Link
      href={item.href}
      className="group block p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
          {item.category}
        </span>
        {item.badge && (
          <Badge variant="outline" className="text-[10px] py-0 px-2">
            {item.badge}
          </Badge>
        )}
        {item.date && (
          <span className="text-[10px] text-slate-400">{item.date}</span>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
        {item.title}
      </h4>

      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#0b1f3c] group-hover:text-amber-600 transition-colors">
        <span>Buka rincian</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
