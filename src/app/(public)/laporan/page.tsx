import { Metadata } from "next";
import { Download, FileText, ExternalLink, AlertCircle, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchFilterControls } from "@/components/common/search-filter-controls";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { getReportsPaginated, getReportYears } from "@/lib/data/report";
import { reportQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "Laporan Kinerja & Akuntabilitas — KEK Indonesia",
  description:
    "Publikasi berkala laporan kinerja tahunan, capaian realisasi investasi, serapan tenaga kerja, dan akuntabilitas Kawasan Ekonomi Khusus Indonesia.",
};

interface LaporanPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LaporanPage({ searchParams }: LaporanPageProps) {
  const rawParams = await searchParams;

  const parsed = reportQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : "",
    year: rawParams.year,
    page: rawParams.page,
    limit: rawParams.limit || 8,
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        q: "",
        year: undefined,
        page: 1,
        limit: 8,
      };

  const [paginated, years] = await Promise.all([
    getReportsPaginated(queryParams),
    getReportYears(),
  ]);

  const filterConfigs = [
    {
      key: "year",
      label: "Tahun Laporan",
      options: years.map((y) => ({ label: `Tahun ${y}`, value: y.toString() })),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Akuntabilitas Publik"
        title="Laporan Kinerja Kawasan Ekonomi Khusus"
        description="Akses transparansi publik terhadap laporan kinerja perkembangan tahunan, evaluasi daya saing kawasan, neraca realisasi investasi PMA/PMDN, dan ekspor produk unggulan KEK."
        breadcrumbs={[{ label: "Laporan" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* Search & Filter Controls */}
        <SearchFilterControls
          placeholder="Cari judul laporan akuntabilitas, evaluasi investasi, atau audit tahunan..."
          searchKey="q"
          filters={filterConfigs}
          totalResults={paginated.total}
          resultLabel="laporan kinerja"
        />

        {/* Content Section */}
        {paginated.data.length === 0 ? (
          <EmptyState
            title="Laporan Tidak Ditemukan"
            description="Tidak ada dokumen laporan kinerja yang sesuai dengan kata kunci atau filter tahun yang dipilih."
            actionText="Reset Pencarian"
            actionHref="/laporan"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginated.data.map((report) => {
                const hasValidFile = report.fileUrl && report.fileUrl.trim() !== "" && report.fileUrl !== "#";

                return (
                  <div
                    key={report.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="blue" className="gap-1 text-xs">
                          <Calendar className="w-3 h-3" /> Tahun {report.year}
                        </Badge>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Laporan Resmi
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {report.title}
                          </h3>
                          {report.description && (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Format: Dokumen PDF Resmi</span>
                      {hasValidFile ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka</span>
                          </a>
                          <a
                            href={report.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b1f3c] text-white hover:bg-[#1a3b6b] transition-colors shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Laporan</span>
                          </a>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                          <AlertCircle className="w-3 h-3" />
                          Berkas belum tersedia
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={paginated.currentPage}
              totalPages={paginated.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
