import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Shield, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Peluang & Insentif Investasi — KEK Indonesia",
  description: "Fasilitas perpajakan, kepabeanan, kemudahan berusaha, dan prosedur investasi di KEK Indonesia.",
};

export default function InvestasiPage() {
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
              <BreadcrumbPage>Peluang Investasi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4 max-w-3xl">
          <Badge variant="emerald">Insentif & Kemudahan Berusaha</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Investasi di Kawasan Ekonomi Khusus Indonesia
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Pemerintah Republik Indonesia menyediakan paket insentif fiskal dan non-fiskal terlengkap dan paling kompetitif di Asia Tenggara bagi para investor dan pelaku usaha di KEK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Card className="border-emerald-200/60 bg-emerald-50/20">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Insentif Fiskal Utama</h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tax Holiday 100%:</strong> Pengurangan PPh Badan hingga 100% selama 10-20 tahun untuk penanaman modal utama.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pembebasan Bea Masuk:</strong> Bebas bea masuk dan PDRI atas impor barang modal, mesin, dan bahan baku produksi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Fasilitas PPN & PPnBM:</strong> Tidak dipungut atas transaksi pemasukan Barang Kena Pajak ke dalam kawasan.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200/60 bg-blue-50/20">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kemudahan Non-Fiskal</h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Layanan Satu Pintu (Administrator KEK):</strong> Pengurusan izin usaha terpusat langsung di lokasi kawasan tanpa hambatan birokrasi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Kepemilikan Properti & WNA:</strong> Kemudahan perpanjangan izin tinggal dan kepemilikan hunian di KEK Pariwisata.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Dukungan Utilitas Lengkap:</strong> Jaringan listrik stabil, pasokan air industri, gas alam pipa, dan telekomunikasi berkecepatan tinggi.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
