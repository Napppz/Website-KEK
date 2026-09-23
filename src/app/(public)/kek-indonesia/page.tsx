import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { KekFilterClient } from "@/components/kek/kek-filter-client";
import { getAllKeks, getKekProvinces } from "@/lib/data/kek";

export const metadata: Metadata = {
  title: "Direktori Kawasan Ekonomi Khusus Indonesia",
  description:
    "Katalog lengkap seluruh Kawasan Ekonomi Khusus (KEK) di Indonesia. Temukan keunggulan geo-ekonomi, kesiapan infrastruktur, dan fokus investasi tiap kawasan.",
};

export default async function KekIndonesiaPage() {
  const [keks, provinces] = await Promise.all([
    getAllKeks(),
    getKekProvinces(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Direktori Kawasan"
        title="Kawasan Ekonomi Khusus Indonesia"
        description="Jelajahi profil lengkap seluruh kawasan ekonomi khusus yang tersebar di wilayah strategis nusantara. Cari berdasarkan nama kawasan, lokasi provinsi, atau fokus klaster industri."
        breadcrumbs={[{ label: "Kawasan KEK" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <KekFilterClient initialKeks={keks} provinces={provinces} />
      </div>
    </div>
  );
}
