import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Kawasan Ekonomi Khusus — KEK Indonesia",
  description: "Persebaran dan direktori Kawasan Ekonomi Khusus (KEK) di seluruh wilayah Indonesia.",
};

const sampleKeks = [
  { name: "KEK Sei Mangkei", province: "Sumatera Utara", focus: "Kelapa Sawit & Karet", status: "BEROPERASI" },
  { name: "KEK Kendal", province: "Jawa Tengah", focus: "Manufaktur & Otomotif", status: "BEROPERASI" },
  { name: "KEK Mandalika", province: "Nusa Tenggara Barat", focus: "Pariwisata & Sport Tourism", status: "BEROPERASI" },
  { name: "KEK Nongsa Digital Park", province: "Kepulauan Riau", focus: "Ekonomi Digital & Data Center", status: "BEROPERASI" },
  { name: "KEK Sanur", province: "Bali", focus: "Pariwisata Kesehatan / Medis", status: "BEROPERASI" },
  { name: "KEK Morotai", province: "Maluku Utara", focus: "Perikanan & Logistik", status: "TAHAP_PEMBANGUNAN" },
];

export default function KekIndonesiaPage() {
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
              <BreadcrumbPage>Kawasan KEK Indonesia</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Direktori Kawasan</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Kawasan Ekonomi Khusus Indonesia
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Direktori komprehensif Kawasan Ekonomi Khusus yang tersebar dari Sabang sampai Merauke, dengan fokus industri manufaktur, hilirisasi sumber daya alam, ekonomi digital, dan pariwisata.
          </p>
        </div>

        {/* Placeholder Interactive Map container */}
        <div id="peta" className="p-8 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-800 mx-auto flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Peta Interaktif Persebaran KEK</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Modul Peta GIS interaktif menggunakan React Leaflet akan diintegrasikan pada tahap berikutnya dengan marker koordinat lengkap seluruh KEK Indonesia.
          </p>
        </div>

        {/* List of sample SEZs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {sampleKeks.map((kek) => (
            <Card key={kek.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={kek.status === "BEROPERASI" ? "emerald" : "amber"}>
                    {kek.status === "BEROPERASI" ? "Beroperasi" : "Tahap Pembangunan"}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium">{kek.province}</span>
                </div>
                <h3 className="font-bold text-slate-900">{kek.name}</h3>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Fokus:</span> {kek.focus}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1">
                    Detail Kawasan <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
