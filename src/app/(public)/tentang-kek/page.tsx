import { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  Target,
  ShieldCheck,
  Users2,
  FileCheck2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tentang KEK — Profil & Landasan Hukum Dewan Nasional KEK",
  description:
    "Profil resmi, dasar hukum pembentukan, visi misi, serta struktur kelembagaan Dewan Nasional Kawasan Ekonomi Khusus Republik Indonesia.",
};

export default function TentangKekPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. PAGE HEADER */}
      <PageHeader
        badge="Kelembagaan Resmi"
        title="Tentang Kawasan Ekonomi Khusus Indonesia"
        description="Pusat akselerasi pertumbuhan ekonomi nasional melalui penyiapan kawasan berdaya saing global, fasilitas fiskal terbaik, dan pelayanan terpadu satu pintu."
        breadcrumbs={[{ label: "Tentang KEK" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        {/* 2. PENDAHULUAN & LANDASAN HUKUM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Akselerator Pembangunan Ekonomi Inklusif & Berkelanjutan
            </h2>
            <p>
              Kawasan Ekonomi Khusus (KEK) dikembangkan untuk memaksimalkan kegiatan industri, ekspor, impor, dan kegiatan ekonomi lain yang bernilai ekonomi tinggi serta memiliki keunggulan geostrategis.
            </p>
            <p>
              Melalui <strong>Undang-Undang Nomor 39 Tahun 2009 tentang Kawasan Ekonomi Khusus</strong> dan disempurnakan melalui <strong>Peraturan Pemerintah Nomor 40 Tahun 2021 tentang Penyelenggaraan KEK</strong>, negara memberikan kepastian regulasi, percepatan izin usaha, dan kemudahan fasilitas guna menarik modal berkualitas dan menciptakan lapangan kerja luas.
            </p>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 text-xs sm:text-sm text-blue-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-blue-950">
                <FileCheck2 className="w-4 h-4 text-blue-700" /> Landasan Kebijakan Nasional
              </span>
              <p className="text-blue-800 leading-relaxed text-xs">
                KEK dipersiapkan tidak hanya sebagai sentra produksi manufaktur, melainkan juga ekosistem inovasi teknologi, pariwisata berkelanjutan, dan pelayanan kesehatan berstandar internasional.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Visi & Sasaran Strategis</h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mewujudkan sentra pertumbuhan ekonomi baru di luar Pulau Jawa untuk pemerataan pembangunan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Meningkatkan daya saing ekspor produk bernilai tambah tinggi melalui hilirisasi sumber daya domestik.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menyerap tenaga kerja trampil lokal dan transfer teknologi terkini ke industri nasional.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. TATA KELOLA & DEWAN NASIONAL KEK */}
        <div className="space-y-8 pt-6 border-t border-slate-200">
          <SectionHeader
            badge="Tata Kelola Kelembagaan"
            title="Struktur Pengelolaan Kawasan Ekonomi Khusus"
            description="Penyelenggaraan KEK dijalankan secara terkoordinasi melalui Dewan Nasional, Dewan Kawasan, dan Administrator KEK."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Dewan Nasional KEK</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dipimpin oleh Menteri Koordinator Bidang Perekonomian bersama para menteri sektor teknis. Bertugas merumuskan kebijakan umum, menetapkan standar kawasan, dan memberikan rekomendasi penetapan KEK kepada Presiden.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Users2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Dewan Kawasan KEK</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dibentuk pada tingkat provinsi oleh Gubernur dan Bupati/Walikota terkait untuk membantu Dewan Nasional dalam pengawasan, pembinaan, dan penyelesaian hambatan operasional di tingkat daerah.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Administrator KEK</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Badan pelaksana pelayanan terpadu satu pintu yang berkedudukan langsung di kawasan KEK. Bertanggung jawab atas penerbitan seluruh izin operasional, fasilitas kepabeanan, dan kemudahan berusaha bagi investor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. MEKANISME USULAN & PENETAPAN */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0b1f3c] text-white space-y-6">
          <div className="max-w-2xl space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ingin Mengusulkan Pembentukan KEK Baru?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pemerintah daerah, badan usaha swasta, atau BUMN/BUMD dapat mengusulkan pembentukan kawasan baru yang memenuhi syarat kesiapan lahan, rencana bisnis, dan dampak ekonomi regional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">Tahap 1</span>
              Penyiapan Dokumen Kelayakan & Lahan Clean & Clear
            </div>
            <div className="p-3.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">Tahap 2</span>
              Verifikasi Lapangan oleh Sekretariat Dewan Nasional
            </div>
            <div className="p-3.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">Tahap 3</span>
              Sidang Pleno Dewan Nasional KEK
            </div>
            <div className="p-3.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">Tahap 4</span>
              Penetapan Melalui Peraturan Pemerintah (PP)
            </div>
          </div>

          <div className="pt-2">
            <Link href="/kontak">
              <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Konsultasikan Pengusulan KEK <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
