import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Berita & Siaran Pers — KEK Indonesia",
  description: "Kumpulan berita, rilis pers resmi, dan artikel perkembangan kawasan ekonomi khusus di Indonesia.",
};

export default function BeritaPage() {
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
              <BreadcrumbPage>Berita & Siaran Pers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Pemberitaan Resmi</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kabar & Informasi Terkini KEK
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Informasi valid mengenai peresmian proyek baru, pencapaian realisasi investasi, regulasi terkini, dan agenda nasional Kawasan Ekonomi Khusus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-44 bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
              Thumbnail Foto Berita
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>15 Maret 2026</span>
                <span>•</span>
                <span className="text-blue-700 font-medium">Siaran Pers</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Pemerintah Tingkatkan Efisiensi Layanan Perizinan Tunggal di Seluruh KEK
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                Integrasi sistem OSS dengan administrator KEK terus dimutakhirkan guna kepastian hukum investasi.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-700 inline-flex items-center gap-1">
                Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
