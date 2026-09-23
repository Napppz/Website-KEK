import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Foto Kawasan — KEK Indonesia",
  description: "Dokumentasi visual perkembangan infrastruktur, fasilitas, dan kegiatan di Kawasan Ekonomi Khusus Indonesia.",
};

export default function GaleriPage() {
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
              <BreadcrumbPage>Galeri Visual</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Dokumentasi Visual</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kawasan Ekonomi Khusus
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Potret perkembangan fasilitas industri, infrastruktur maritim, pariwisata, dan peresmian proyek strategis KEK di nusantara.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8" />
              </div>
              <CardContent className="p-4 space-y-1">
                <Badge variant="secondary" className="text-[10px]">Infrastruktur</Badge>
                <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">
                  Dokumentasi Fasilitas Kawasan #{i}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
