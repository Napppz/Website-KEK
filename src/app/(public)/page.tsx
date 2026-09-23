import Link from "next/link";
import {
  Building2,
  TrendingUp,
  FileText,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* 1. HERO SECTION: Institutional & Investment Banner */}
      <section className="relative bg-[#0b1f3c] text-white py-16 sm:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-amber-300 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Terpadu Kawasan Ekonomi Khusus Republik Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight text-white">
              Akselerasi Investasi & Pertumbuhan Ekonomi Berkelanjutan
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Selamat datang di portal resmi Kawasan Ekonomi Khusus (KEK) Indonesia. Temukan potensi kawasan strategis, insentif fiskal, kepastian regulasi, dan peluang kemitraan investasi nasional.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/kek-indonesia">
                <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none">
                  <Compass className="w-4 h-4" />
                  Jelajahi Kawasan KEK
                </Button>
              </Link>
              <Link href="/investasi">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Panduan Investasi
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics Highlight Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">20+</div>
              <div className="text-xs text-slate-300 mt-1">Kawasan Tersebar di Nusantara</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">Rp 170+ T</div>
              <div className="text-xs text-slate-300 mt-1">Akumulasi Komitmen Investasi</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-sky-400">60.000+</div>
              <div className="text-xs text-slate-300 mt-1">Penyerapan Tenaga Kerja</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400">100%</div>
              <div className="text-xs text-slate-300 mt-1">Pelayanan Perizinan Terpadu OSS</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES & SECTION OVERVIEW */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <Badge variant="blue">Layanan Utama Portal</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Informasi Terpadu untuk Pelaku Usaha & Publik
            </h2>
            <p className="text-sm text-slate-600">
              Akses cepat ke berbagai instrumen data, kebijakan perundang-undangan, dan layanan pendukung KEK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Profil & Persebaran Kawasan
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Pelajari keunggulan geo-ekonomi, kesiapan infrastruktur, fokus sektor industri, dan akses transportasi tiap KEK.
                </p>
                <Link
                  href="/kek-indonesia"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
                >
                  Lihat Direktori Kawasan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Insentif & Kemudahan Berusaha
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Fasilitas Tax Holiday hingga 100%, pembebasan bea masuk impor mesin, kepastian perizinan, dan kepemilikan properti.
                </p>
                <Link
                  href="/investasi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  Panduan Insentif Fiskal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  JDIH & Regulasi Hukum
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Basis data perundang-undangan, Peraturan Pemerintah, Keputusan Presiden, dan Peraturan Menteri Keuangan terkini.
                </p>
                <Link
                  href="/jdih"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900"
                >
                  Telusuri Dokumen Hukum <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
