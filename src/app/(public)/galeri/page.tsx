import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { GalleryViewer } from "@/components/gallery/gallery-viewer";
import { getGalleries, getGalleryCategories } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Galeri Foto Fasilitas & Infrastruktur — KEK Indonesia",
  description:
    "Dokumentasi visual fasilitas pelabuhan, klaster industri manufaktur, sirkuit sport tourism, dan pusat data di Kawasan Ekonomi Khusus Indonesia.",
};

export default async function GaleriPage() {
  const [galleries, categories] = await Promise.all([
    getGalleries(),
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

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <GalleryViewer
          initialGalleries={galleries}
          categories={categories}
        />
      </div>
    </div>
  );
}
