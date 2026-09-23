import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "JDIH — Jaringan Dokumentasi & Informasi Hukum KEK",
  description: "Basis data peraturan perundang-undangan, keputusan, dan instrumen hukum Kawasan Ekonomi Khusus Indonesia.",
};

const sampleDocs = [
  {
    title: "Peraturan Pemerintah Nomor 40 Tahun 2021 tentang Penyelenggaraan Kawasan Ekonomi Khusus",
    number: "PP No. 40/2021",
    year: 2021,
    type: "Peraturan Pemerintah",
  },
  {
    title: "Peraturan Menteri Keuangan Nomor 237/PMK.010/2020 tentang Perlakuan Perpajakan dan Kepabeanan KEK",
    number: "PMK No. 237/PMK.010/2020",
    year: 2020,
    type: "Peraturan Menteri Keuangan",
  },
];

export default function JdihPage() {
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
              <BreadcrumbPage>JDIH & Regulasi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="amber">JDIH KEK Indonesia</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Jaringan Dokumentasi & Informasi Hukum
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Pusat penelusuran dokumen regulasi, undang-undang, peraturan pemerintah, dan keputusan teknis terkait penyelenggaraan dan fasilitas KEK.
          </p>
        </div>

        <div className="max-w-md">
          <Input placeholder="Cari nomor peraturan, judul, atau kata kunci..." />
        </div>

        <div className="space-y-3 pt-2">
          {sampleDocs.map((doc) => (
            <Card key={doc.number}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {doc.type}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">Tahun {doc.year}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                  <p className="text-xs text-slate-500">{doc.number}</p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 shrink-0">
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Unduh Dokumen</span>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
