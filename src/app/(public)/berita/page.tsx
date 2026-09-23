import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { NewsFilterClient } from "@/components/berita/news-filter-client";
import { getAllNews, getNewsCategories } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "Berita & Siaran Pers Resmi — KEK Indonesia",
  description:
    "Warta terkini, siaran pers kementerian, pengumuman regulasi baru, dan liputan perkembangan pembangunan di seluruh Kawasan Ekonomi Khusus Indonesia.",
};

export default async function BeritaPage() {
  const [news, categories] = await Promise.all([
    getAllNews(),
    getNewsCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Warta & Publikasi"
        title="Berita & Siaran Pers KEK Indonesia"
        description="Dapatkan kabar resmi terpercaya mengenai realisasi investasi, kemitraan bilateral, kebijakan baru, serta dinamika kemajuan industri di Kawasan Ekonomi Khusus."
        breadcrumbs={[{ label: "Berita" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <NewsFilterClient initialNews={news} categories={categories} />
      </div>
    </div>
  );
}
