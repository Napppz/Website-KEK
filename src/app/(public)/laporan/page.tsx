import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Laporan Kinerja & Publikasi — KEK Indonesia",
  description: "Laporan perkembangan, realisasi investasi tahunan, dan akuntabilitas kinerja Kawasan Ekonomi Khusus.",
};

const sampleReports = [
  {
    title: "Laporan Perkembangan Kawasan Ekonomi Khusus Indonesia Tahun 2025",
    year: 2025,
    size: "14.2 MB",
  },
  {
    title: "Laporan Kinerja Tahunan Realisasi Investasi KEK Indonesia Tahun 2024",
    year: 2024,
    size: "18.5 MB",
  },
];

export default function LaporanPage() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laporan Kinerja</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Akuntabilitas & Publikasi</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Kinerja Kawasan Ekonomi Khusus
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Publikasi berkala mengenai realisasi investasi, penciptaan lapangan kerja, evaluasi perkembangan infrastruktur, dan kontribusi KEK terhadap pertumbuhan ekonomi nasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {sampleReports.map((rep) => (
            <Card key={rep.title}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Tahun {rep.year}</Badge>
                  <span className="text-xs text-slate-400">{rep.size}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{rep.title}</h3>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Unduh Laporan PDF
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
