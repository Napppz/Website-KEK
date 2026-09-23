import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak & Layanan Helpdesk — KEK Indonesia",
  description: "Hubungi Sekretariat Jenderal Dewan Nasional KEK Indonesia untuk konsultasi perizinan dan investasi.",
};

export default function KontakPage() {
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
              <BreadcrumbPage>Kontak & Helpdesk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="blue">Layanan Konsultasi</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Tim layanan helpdesk investasi KEK siap membantu Anda dengan informasi regulasi, asistensi perizinan terpadu, dan penjadwalan kunjungan lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-slate-900">Alamat Kantor Pelayanan</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>Gedung Kementerian Koordinator Bidang Perekonomian, Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat 10710</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>(021) 345-6789 (Hunting)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>info@kek.go.id</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-900">Formulir Pertanyaan & Konsultasi</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Nama Lengkap</label>
                  <Input placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Email</label>
                  <Input type="email" placeholder="nama@perusahaan.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Pesan / Topik Konsultasi</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tuliskan kebutuhan informasi investasi Anda..."
                  />
                </div>
                <Button className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Kirim Pesan Konsultasi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
