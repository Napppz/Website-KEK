import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { GalleryViewer } from "@/components/gallery/gallery-viewer";
import { Pagination } from "@/components/common/pagination";
import { getGalleriesPaginated, getGalleryCategories } from "@/lib/data/gallery";
import { galleryQuerySchema } from "@/lib/validations/query";

export const metadata: Metadata = {
  title: "Galeri Foto Fasilitas & Infrastruktur — KEK Indonesia",
  description:
    "Dokumentasi visual fasilitas pelabuhan, klaster industri manufaktur, sirkuit sport tourism, dan pusat data di Kawasan Ekonomi Khusus Indonesia.",
};

interface GaleriPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GaleriPage({ searchParams }: GaleriPageProps) {
  const rawParams = await searchParams;

  const parsed = galleryQuerySchema.safeParse({
    category: typeof rawParams.category === "string" ? rawParams.category : "ALL",
    page: rawParams.page,
    limit: rawParams.limit || 12,
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        category: "ALL",
        page: 1,
        limit: 12,
      };

  const [paginated, categories] = await Promise.all([
    getGalleriesPaginated(queryParams),
    getGalleryCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Dokumentasi Visual"
        title="Galeri Kawasan Ekonomi Khusus"
        description="Potret kemajuan fisik infrastruktur maritim, fasilitas dry port, klaster manufaktur berteknologi tinggi, dan destinasi pariwisata berkelas dunia di seluruh KEK Indonesia."
        breadcrumbs={[{ label: "Galeri" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <GalleryViewer
          initialGalleries={paginated.data}
          categories={categories}
          activeCategory={queryParams.category}
        />

        {/* Server-side Pagination */}
        <Pagination
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
        />
      </div>
    </div>
  );
}
