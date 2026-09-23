import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark, Target, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang KEK — Dewan Nasional Kawasan Ekonomi Khusus",
  description: "Profil, visi, misi, dan landasan hukum pembentukan Kawasan Ekonomi Khusus Republik Indonesia.",
};

export default function TentangKekPage() {
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
              <BreadcrumbPage>Tentang KEK</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Profil Kelembagaan</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tentang Kawasan Ekonomi Khusus Indonesia
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Kawasan Ekonomi Khusus (KEK) dibentuk melalui Undang-Undang Republik Indonesia untuk mempercepat pencapaian pembangunan ekonomi nasional melalui penyiapan kawasan yang memiliki keunggulan geoekonomi dan geostrategis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Landasan Pembentukan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                UU No. 39 Tahun 2009 serta peraturan perubahannya dalam kerangka peningkatan ekosistem investasi dan penciptaan lapangan kerja berkualitas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Visi & Tujuan Strategis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menjadikan Indonesia sebagai magnet investasi manufaktur bernilai tambah tinggi dan destinasi pariwisata berkelas dunia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Dewan Nasional KEK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dipimpin oleh Menteri Koordinator Bidang Perekonomian bersama para menteri terkait untuk perumusan kebijakan dan evaluasi kawasan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
