import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { SearchFilterControls } from "@/components/common/search-filter-controls";
import { NewsCard } from "@/components/berita/news-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/states";
import { getNewsPaginated, getNewsCategories, getNewsYears } from "@/lib/data/news";
import { newsQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "Berita & Siaran Pers Resmi — KEK Indonesia",
  description:
    "Warta terkini, siaran pers kementerian, pengumuman regulasi baru, dan liputan perkembangan pembangunan di seluruh Kawasan Ekonomi Khusus Indonesia.",
};

interface BeritaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const rawParams = await searchParams;

  const parsed = newsQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : "",
    category: typeof rawParams.category === "string" ? rawParams.category : "ALL",
    year: rawParams.year,
    sort: typeof rawParams.sort === "string" ? rawParams.sort : "latest",
    page: rawParams.page,
    limit: rawParams.limit || 6,
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        q: "",
        category: "ALL",
        year: undefined,
        sort: "latest" as const,
        page: 1,
        limit: 6,
      };

  const [paginated, categories, years] = await Promise.all([
    getNewsPaginated(queryParams),
    getNewsCategories(),
    getNewsYears(),
  ]);

  const filterConfigs = [
    {
      key: "category",
      label: "Kategori",
      options: categories.map((c) => ({ label: c.name, value: c.slug })),
    },
    {
      key: "year",
      label: "Tahun Publikasi",
      options: years.map((y) => ({ label: `Tahun ${y}`, value: y.toString() })),
    },
  ];

  const sortConfigs = [
    { label: "Terbaru (Rilis Terkini)", value: "latest" },
    { label: "Terlama", value: "oldest" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Warta & Publikasi"
        title="Berita & Siaran Pers KEK Indonesia"
        description="Dapatkan kabar resmi terpercaya mengenai realisasi investasi, kemitraan bilateral, kebijakan baru, serta dinamika kemajuan industri di Kawasan Ekonomi Khusus."
        breadcrumbs={[{ label: "Berita" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        {/* URL query params driven search, filter, and sorting */}
        <SearchFilterControls
          placeholder="Cari artikel berita, topik investasi, atau siaran pers..."
          searchKey="q"
          filters={filterConfigs}
          sortOptions={sortConfigs}
          sortKey="sort"
          totalResults={paginated.total}
          resultLabel="berita ditemukan"
        />

        {/* Content Grid */}
        {paginated.data.length === 0 ? (
          <EmptyState
            title="Data tidak ditemukan"
            description="Periksa kembali kata kunci atau filter yang digunakan."
            actionText="Reset Filter"
            actionHref="/berita"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.data.map((item) => (
                <NewsCard key={item.id} news={item} />
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
