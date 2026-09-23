import { Metadata } from "next";
import Link from "next/link";
import {
  Percent,
  Shield,
  Coins,
  FileCheck2,
  Building,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Panduan & Insentif Investasi — KEK Indonesia",
  description:
    "Fasilitas dan insentif penanaman modal terlengkap di Kawasan Ekonomi Khusus Indonesia: Tax Holiday 100%, Tax Allowance, fasilitas kepabeanan, dan pelayanan perizinan terpadu.",
};

export default function InvestasiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="Peluang Investasi"
        title="Investasi di Kawasan Ekonomi Khusus"
        description="Pemerintah Republik Indonesia menawarkan kepastian hukum dan paket insentif fiskal serta non-fiskal terlengkap di Asia Tenggara untuk mempercepat pengembalian modal dan efisiensi rantai pasok industri Anda."
        breadcrumbs={[{ label: "Investasi" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        {/* 1. INSENTIF FISKAL UTAMA */}
        <div id="fasilitas-fiskal" className="space-y-8 scroll-mt-24">
          <SectionHeader
            badge="Insentif Fiskal"
            title="Keringanan Pajak & Kepabeanan"
            description="Fasilitas perpajakan yang diatur dalam Peraturan Menteri Keuangan untuk menjamin struktur biaya produksi yang sangat efisien."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-emerald-200/80 bg-emerald-50/20 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tax Holiday Hingga 100%</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pengurangan Pajak Penghasilan (PPh) Badan sebesar 100% selama 10 hingga 20 tahun bagi investasi di bidang usaha utama, ditambah pengurangan PPh Badan 50% selama 2 tahun berikutnya.
                </p>
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded">
                  Nilai Investasi minimal Rp 100 Miliar
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200/80 bg-blue-50/20 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Pembebasan Bea Masuk & PDRI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pembebasan Bea Masuk dan tidak dipungut Pajak Dalam Rangka Impor (PDRI) atas pemasukan barang modal mesin, instalasi pabrik, dan bahan baku produksi ke dalam KEK.
                </p>
                <div className="text-[11px] text-blue-800 font-semibold bg-blue-100/60 p-2 rounded">
                  Berlaku selama masa konstruksi & operasional
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/80 bg-amber-50/20 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Fasilitas PPN & PPnBM</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PPN atau PPnBM tidak dipungut atas penyerahan Barang Kena Pajak antar pelaku usaha di dalam KEK maupun dari luar Daerah Pabean langsung ke KEK.
                </p>
                <div className="text-[11px] text-amber-800 font-semibold bg-amber-100/60 p-2 rounded">
                  Efisiensi arus kas modal kerja penanaman modal
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 2. KEMUDAHAN NON-FISKAL & BERUSAHA */}
        <div id="kemudahan-berusaha" className="space-y-8 pt-8 border-t border-slate-200 scroll-mt-24">
          <SectionHeader
            badge="Kemudahan Berusaha"
            title="Pelayanan Terpadu & Fleksibilitas Regulasi"
            description="Kepastian dan percepatan proses birokrasi melalui pendelegasian kewenangan penuh ke Administrator KEK."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Layanan Perizinan Terpadu OSS</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Penerbitan Nomor Induk Berusaha (NIB), izin operasional, Amdal, hingga Persetujuan Bangunan Gedung (PBG) diproses langsung oleh Administrator KEK setempat tanpa perlu ke kementerian pusat.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Kepemilikan Properti & Kemudahan WNA</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kemudahan kepemilikan hunian/apartemen bagi Warga Negara Asing (WNA) di KEK Pariwisata, serta pemberian fasilitas visa tinggal terbatas bagi tenaga ahli dan eksekutif asing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. PROSEDUR INVESTASI */}
        <div id="prosedur" className="space-y-8 pt-8 border-t border-slate-200 scroll-mt-24">
          <SectionHeader
            badge="Alur Proses"
            title="Tahapan Memulai Investasi di KEK"
            description="Empat langkah sederhana untuk mendaftarkan dan merealisasikan fasilitas usaha di Kawasan Ekonomi Khusus."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-[#0f284e] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Pemilihan Kawasan & Lahan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tentukan KEK tujuan sesuai kesesuaian klaster industri dan lakukan MoU pemesanan kavling industri dengan Badan Usaha Pembangun KEK.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-[#0f284e] text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Registrasi Akun OSS</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Daftarkan profil perusahaan melalui portal OSS RBA dan pilih lokasi usaha di dalam zona Kawasan Ekonomi Khusus.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-[#0f284e] text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Penetapan Fasilitas KEK</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Administrator KEK memvalidasi dokumen dan secara otomatis menetapkan Surat Keputusan pemberian fasilitas Tax Holiday/Tax Allowance dan kepabeanan.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-[#0f284e] text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Konstruksi & Operasional</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mulai pembangunan fisik pabrik dengan fasilitas impor bebas bea masuk barang modal, dilanjutkan peresmian produksi komersial.
              </p>
            </div>
          </div>
        </div>

        {/* CTA BANTUAN KONSULTASI */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0b1f3c] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Butuh Pendampingan Perhitungan Fasilitas Investasi?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tim asistensi helpdesk penanaman modal KEK siap menyimulasikan perhitungan besaran insentif pajak yang berhak diterima proyek Anda.
            </p>
          </div>
          <Link href="/kontak" className="shrink-0">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none">
              Hubungi Tim Investasi &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
