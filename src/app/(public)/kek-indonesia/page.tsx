import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { SearchFilterControls } from "@/components/common/search-filter-controls";
import { KekCard } from "@/components/kek/kek-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/states";
import { getKeksPaginated, getKekProvinces, getKekFoci } from "@/lib/data/kek";
import { kekQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "Direktori Kawasan Ekonomi Khusus Indonesia",
  description:
    "Katalog lengkap seluruh Kawasan Ekonomi Khusus (KEK) di Indonesia. Temukan keunggulan geo-ekonomi, kesiapan infrastruktur, dan fokus investasi tiap kawasan.",
};

interface KekPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KekIndonesiaPage({ searchParams }: KekPageProps) {
  const rawParams = await searchParams;

  const parsed = kekQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : "",
    province: typeof rawParams.province === "string" ? rawParams.province : "ALL",
    focus: typeof rawParams.focus === "string" ? rawParams.focus : "ALL",
    status: typeof rawParams.status === "string" ? rawParams.status : "ALL",
    sort: typeof rawParams.sort === "string" ? rawParams.sort : "name-asc",
    page: rawParams.page,
    limit: rawParams.limit || 9,
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        q: "",
        province: "ALL",
        focus: "ALL",
        status: "ALL" as const,
        sort: "name-asc" as const,
        page: 1,
        limit: 9,
      };

  const [paginated, provinces, foci] = await Promise.all([
    getKeksPaginated(queryParams),
    getKekProvinces(),
    getKekFoci(),
  ]);

  const filterConfigs = [
    {
      key: "province",
      label: "Provinsi",
      options: provinces.map((p) => ({ label: p, value: p })),
    },
    {
      key: "focus",
      label: "Sektor Fokus",
      options: foci.map((f) => ({ label: f, value: f })),
    },
    {
      key: "status",
      label: "Status Kawasan",
      options: [
        { label: "Beroperasi", value: "BEROPERASI" },
        { label: "Tahap Pembangunan", value: "TAHAP_PEMBANGUNAN" },
      ],
    },
  ];

  const sortConfigs = [
    { label: "Nama A — Z", value: "name-asc" },
    { label: "Nama Z — A", value: "name-desc" },
    { label: "Terbaru Ditambahkan", value: "latest" },
    { label: "Terlama", value: "oldest" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Direktori Kawasan"
        title="Kawasan Ekonomi Khusus Indonesia"
        description="Jelajahi profil lengkap seluruh kawasan ekonomi khusus yang tersebar di wilayah strategis nusantara. Cari berdasarkan nama kawasan, lokasi provinsi, atau fokus klaster industri."
        breadcrumbs={[{ label: "Kawasan KEK" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* Search & Filter Controls (URL query params driven) */}
        <SearchFilterControls
          placeholder="Cari nama KEK, provinsi, kota, atau fokus industri..."
          searchKey="q"
          filters={filterConfigs}
          sortOptions={sortConfigs}
          sortKey="sort"
          totalResults={paginated.total}
          resultLabel="kawasan ditemukan"
        />

        {/* Content Section */}
        {paginated.data.length === 0 ? (
          <EmptyState
            title="Data tidak ditemukan"
            description="Periksa kembali kata kunci atau filter yang digunakan."
            actionText="Reset Filter"
            actionHref="/kek-indonesia"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.data.map((kek) => (
                <KekCard key={kek.id} kek={kek} />
              ))}
            </div>

            {/* Server-side Pagination */}
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
