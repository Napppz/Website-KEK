import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { ReportFilterClient } from "@/components/laporan/report-filter-client";
import { getReports, getReportYears } from "@/lib/data/report";

export const metadata: Metadata = {
  title: "Laporan Kinerja & Akuntabilitas — KEK Indonesia",
  description:
    "Publikasi berkala laporan kinerja tahunan, capaian realisasi investasi, serapan tenaga kerja, dan akuntabilitas Kawasan Ekonomi Khusus Indonesia.",
};

export default async function LaporanPage() {
  const [reports, years] = await Promise.all([
    getReports(),
    getReportYears(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Akuntabilitas Publik"
        title="Laporan Kinerja Kawasan Ekonomi Khusus"
        description="Akses transparansi publik terhadap laporan kinerja perkembangan tahunan, evaluasi daya saing kawasan, neraca realisasi investasi PMA/PMDN, dan ekspor produk unggulan KEK."
        breadcrumbs={[{ label: "Laporan" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <ReportFilterClient initialReports={reports} years={years} />
      </div>
    </div>
  );
}
