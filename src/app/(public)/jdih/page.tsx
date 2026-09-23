import { Metadata } from "next";
import { Download, ExternalLink, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchFilterControls } from "@/components/common/search-filter-controls";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { getDocumentsPaginated, getDocumentCategories, getDocumentYears } from "@/lib/data/document";
import { documentQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "JDIH — Jaringan Dokumentasi & Informasi Hukum KEK Indonesia",
  description:
    "Basis data regulasi hukum, Peraturan Pemerintah, Keputusan Presiden, dan Peraturan Menteri Keuangan yang mengatur penyelenggaraan Kawasan Ekonomi Khusus.",
};

interface JdihPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JdihPage({ searchParams }: JdihPageProps) {
  const rawParams = await searchParams;

  const parsed = documentQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : "",
    category: typeof rawParams.category === "string" ? rawParams.category : "ALL",
    year: rawParams.year,
    page: rawParams.page,
    limit: rawParams.limit || 10,
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        q: "",
        category: "ALL",
        year: undefined,
        page: 1,
        limit: 10,
      };

  const [paginated, categories, years] = await Promise.all([
    getDocumentsPaginated(queryParams),
    getDocumentCategories(),
    getDocumentYears(),
  ]);

  const filterConfigs = [
    {
      key: "category",
      label: "Kategori Regulasi",
      options: categories.map((c) => ({ label: c, value: c })),
    },
    {
      key: "year",
      label: "Tahun Penetapan",
      options: years.map((y) => ({ label: `Tahun ${y}`, value: y.toString() })),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="JDIH KEK Indonesia"
        title="Jaringan Dokumentasi & Informasi Hukum"
        description="Pusat penelusuran produk hukum dan regulasi resmi seputar penetapan kawasan, kepabeanan, insentif perpajakan, dan tata cara perizinan berusaha di Kawasan Ekonomi Khusus."
        breadcrumbs={[{ label: "JDIH & Regulasi" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* URL query params driven search & filters */}
        <SearchFilterControls
          placeholder="Cari nomor peraturan, judul regulasi, atau kata kunci JDIH..."
          searchKey="q"
          filters={filterConfigs}
          totalResults={paginated.total}
          resultLabel="dokumen regulasi"
        />

        {/* Content Section */}
        {paginated.data.length === 0 ? (
          <EmptyState
            title="Dokumen Tidak Ditemukan"
            description="Tidak ada dokumen hukum atau regulasi yang cocok dengan kriteria pencarian dan filter Anda."
            actionText="Reset Pencarian"
            actionHref="/jdih"
          />
        ) : (
          <div className="space-y-6">
            {/* 1. DESKTOP TABLE VIEW */}
            <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b1f3c] text-white text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-4 px-5 w-1/4">Nomor & Kategori</th>
                    <th scope="col" className="py-4 px-5 w-1/2">Judul Dokumen Regulasi</th>
                    <th scope="col" className="py-4 px-5 text-center w-24">Tahun</th>
                    <th scope="col" className="py-4 px-5 text-right w-48">Akses Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.data.map((doc) => {
                    const hasValidFile = doc.fileUrl && doc.fileUrl.trim() !== "" && doc.fileUrl !== "#";

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 align-top">
                          <div className="space-y-1">
                            <Badge variant="blue" className="text-[10px] font-semibold">
                              {doc.category}
                            </Badge>
                            <p className="font-bold text-slate-900 text-xs">
                              {doc.documentNumber}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-5 align-top">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 leading-snug">
                              {doc.title}
                            </h4>
                            {doc.description && (
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-5 align-top text-center">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700">
                            {doc.year}
                          </span>
                        </td>
                        <td className="py-4 px-5 align-top text-right">
                          {hasValidFile ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Buka Dokumen di Tab Baru"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Lihat</span>
                              </a>
                              <a
                                href={doc.fileUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b1f3c] text-white hover:bg-[#1a3b6b] transition-colors shadow-2xs"
                                title="Unduh Berkas Resmi PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh</span>
                              </a>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                              <AlertCircle className="w-3 h-3" />
                              Berkas belum tersedia
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE CARD VIEW */}
            <div className="md:hidden space-y-3">
              {paginated.data.map((doc) => {
                const hasValidFile = doc.fileUrl && doc.fileUrl.trim() !== "" && doc.fileUrl !== "#";

                return (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="blue" className="text-[10px]">
                        {doc.category}
                      </Badge>
                      <span className="text-xs font-bold text-slate-500">Tahun {doc.year}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-blue-800">{doc.documentNumber}</span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </h4>
                      {doc.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      {hasValidFile ? (
                        <>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </a>
                          <a
                            href={doc.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b1f3c] text-white hover:bg-[#1a3b6b]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh PDF</span>
                          </a>
                        </>
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
