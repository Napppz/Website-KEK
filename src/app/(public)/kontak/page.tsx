import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Kontak & Helpdesk Pelayanan Investasi — KEK Indonesia",
  description:
    "Hubungi Sekretariat Jenderal Dewan Nasional KEK Indonesia untuk konsultasi perizinan usaha, fasilitas fiskal, atau layanan pengaduan.",
};

export default function KontakPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Pusat Bantuan & Asistensi"
        title="Kontak & Helpdesk Pelayanan Investasi"
        description="Tim sekretariat dan konsultan penanaman modal KEK Indonesia siap membantu menjawab kebutuhan informasi perizinan, verifikasi kelayakan usaha, serta penjadwalan asistensi teknis."
        breadcrumbs={[{ label: "Kontak" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Kolom Informasi Kantor & Saluran Layanan */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-xs bg-slate-50/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Sekretariat Jenderal Dewan Nasional KEK
                </h3>

                <div className="space-y-4 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Alamat Kantor:</strong>
                      <span>Gedung Ali Wardhana Lt. 5, Kementerian Koordinator Bidang Perekonomian, Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat 10710</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Telepon & Call Center:</strong>
                      <span>+62 (021) 345-6789 (Hunting)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Alamat Email Resmi:</strong>
                      <span>info@kek.go.id / layanan.investasi@kek.go.id</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-purple-700 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Waktu Pelayanan:</strong>
                      <span>Senin - Jumat: 08.00 - 16.30 WIB (Kecuali Hari Libur Nasional)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/80 bg-emerald-50/30 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" /> Komitmen Bebas Gratifikasi
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seluruh layanan konsultasi, panduan investasi, dan pengurusan fasilitasi di Sekretariat Dewan Nasional KEK Indonesia diselenggarakan secara profesional, transparan, dan tanpa dipungut biaya apa pun.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Formulir Interaktif */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
