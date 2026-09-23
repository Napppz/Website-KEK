import Link from "next/link";
import {
  Compass,
  TrendingUp,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Coins,
  Scale,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";
import { SectionHeader } from "@/components/common/section-header";
import { KekCard } from "@/components/kek/kek-card";
import { NewsCard } from "@/components/berita/news-card";
import { KekLeafletMap } from "@/components/map/kek-leaflet-map";
import { getKekStats, getFeaturedKeks, getAllKeks } from "@/lib/data/kek";
import { getLatestNews } from "@/lib/data/news";
import { getDocuments } from "@/lib/data/document";
import { formatCurrencyIDR, formatNumber } from "@/lib/utils";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawParams = await searchParams;
  const yearParam =
    typeof rawParams?.year === "string" && !isNaN(parseInt(rawParams.year, 10))
      ? parseInt(rawParams.year, 10)
      : undefined;

  // Fetch data secara paralel dari Neon PostgreSQL (dengan graceful development fallback)
  const [stats, featuredKeks, allKeks, latestNews, recentDocs] = await Promise.all([
    getKekStats(yearParam),
    getFeaturedKeks(4),
    getAllKeks(),
    getLatestNews(3),
    getDocuments({ year: 2021 }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#07172e] via-[#0b1f3c] to-[#122b52] text-white py-18 sm:py-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-amber-300 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Resmi Penanaman Modal & Kawasan Ekonomi Khusus Indonesia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
              Mempercepat Pertumbuhan Ekonomi Melalui Kawasan Ekonomi Khusus
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Portal informasi Kawasan Ekonomi Khusus Indonesia yang menghadirkan informasi kawasan, investasi, berita, regulasi, dan peluang pengembangan ekonomi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/kek-indonesia">
                <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none shadow-md">
                  <Compass className="w-4 h-4" />
                  Jelajahi KEK
                </Button>
              </Link>
              <Link href="/investasi">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Informasi Investasi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK SECTION */}
      <section className="py-12 bg-white border-b border-slate-200/80 -mt-8 relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        {stats.isDevelopmentData && (
          <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span className="font-medium">
              ℹ️ Catatan: Data statistik saat ini menggunakan data development realistis. Begitu kredensial Neon dihubungkan, data akan langsung bersumber dari database produksi Anda.
            </span>
            <Badge variant="amber" className="text-[10px]">Development Data</Badge>
          </div>
        )}

        {/* Selector Tahun Realisasi Dinamis dari Database */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Statistik Realisasi Penanaman Modal Nasional (Tahun {stats.selectedYear}):</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">Pilih Tahun:</span>
            {stats.availableYears.map((yr) => (
              <Link
                key={yr}
                href={`/?year=${yr}#statistik`}
                scroll={false}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  stats.selectedYear === yr
                    ? "bg-[#0b1f3c] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {yr}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Total Kawasan KEK"
            value={`${stats.totalKek} Kawasan`}
            subtitle="Tersebar strategis dari barat hingga timur"
            icon={<Building2 className="w-5 h-5" />}
          />
          <StatCard
            label="Jumlah Provinsi"
            value={`${stats.totalProvinces} Provinsi`}
            subtitle="Lokasi berdaya saing geostrategis tinggi"
            icon={<MapPin className="w-5 h-5" />}
          />
          <StatCard
            label="Total Realisasi Investasi"
            value={formatCurrencyIDR(stats.totalInvestment, { compact: true })}
            subtitle="Komitmen penanaman modal PMA & PMDN"
            icon={<Coins className="w-5 h-5" />}
          />
          <StatCard
            label="Penyerapan Tenaga Kerja"
            value={`${formatNumber(stats.totalLabor)}+`}
            subtitle="Tenaga kerja terampil & profesional"
            icon={<Users className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* 3. TENTANG KEK SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                align="left"
                badge="Mengenal KEK"
                title="Memahami Kawasan Ekonomi Khusus"
                description="Kawasan Ekonomi Khusus (KEK) merupakan zona dengan batas tertentu dalam wilayah hukum Negara Kesatuan Republik Indonesia yang ditetapkan untuk menyelenggarakan fungsi perekonomian dan memperoleh fasilitas tertentu."
              />

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Keunggulan Geoekonomi & Geostrategis:</strong> Terletak pada jalur perdagangan internasional dan berdekatan dengan sentra bahan baku komoditas unggulan nasional.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Fasilitas Fiskal Terpadu:</strong> Keringanan Pajak Penghasilan (Tax Holiday & Tax Allowance), pembebasan bea masuk impor mesin/peralatan, dan fasilitas PPN.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900">Pelayanan Satu Pintu (OSS Administrator):</strong> Seluruh perizinan berusaha, lingkungan, dan ketenagakerjaan diproses cepat di bawah satu atap.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/tentang-kek">
                  <Button className="gap-2 font-bold bg-[#0f284e] hover:bg-[#1a3b6b]">
                    Pelajari Tentang KEK
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Klasifikasi Zona KEK</h4>
                    <p className="text-xs text-slate-500">Pilar diversifikasi ekonomi nasional</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h5 className="text-xs font-bold text-blue-900">KEK Industri & Manufaktur</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Fokus pada hilirisasi kelapa sawit, oleokimia, perakitan elektronik, otomotif listrik, dan pengolahan mineral.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h5 className="text-xs font-bold text-emerald-900">KEK Pariwisata & Kreatif</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Destinasi sport tourism berkelas internasional, eco-resort berwawasan lingkungan, serta marina terpadu.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h5 className="text-xs font-bold text-purple-900">KEK Ekonomi Digital</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Hub data center hyperscale ramah lingkungan, studio animasi, software engineering, dan riset AI.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h5 className="text-xs font-bold text-amber-900">KEK Kesehatan & Jasa</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Pusat kebugaran, regenerasi medis, dan rumah sakit berstandar global dengan teknologi terkini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PERSEBARAN KEK (INTERACTIVE LEAFLET MAP) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              align="left"
              badge="Geospasial KEK"
              title="Persebaran KEK Indonesia"
              description="Peta interaktif persebaran lokasi Kawasan Ekonomi Khusus di seluruh nusantara. Klik pada titik lokasi untuk melihat profil singkat dan fokus pengembangan tiap kawasan."
            />
            <Link href="/kek-indonesia" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                Lihat Semua di Direktori <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <KekLeafletMap keks={allKeks} />
        </div>
      </section>

      {/* 5. FEATURED KEK */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              align="left"
              badge="Kawasan Unggulan"
              title="Kawasan Ekonomi Khusus Prioritas"
              description="Beberapa kawasan strategis yang telah beroperasi dengan realisasi investasi tinggi dan ekosistem industri yang mapan."
            />
            <Link href="/kek-indonesia" className="shrink-0">
              <Button variant="default" size="sm" className="gap-1.5 font-semibold text-xs bg-[#0f284e]">
                Eksplorasi Semua Kawasan <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredKeks.map((kek) => (
              <KekCard key={kek.id} kek={kek} featured />
            ))}
          </div>
        </div>
      </section>

      {/* 6. INVESTASI & FASILITAS */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <SectionHeader
            badge="Kemudahan Penanaman Modal"
            title="Investasi di Kawasan Ekonomi Khusus"
            description="Pemerintah memberikan paket kepastian hukum dan insentif terluas untuk menjamin daya saing dan tingkat pengembalian investasi yang optimal."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Insentif Fiskal Lengkap</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tax Holiday 100% hingga 20 tahun</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bebas Bea Masuk mesin & bahan baku</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>PPN & PPnBM Tidak Dipungut</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/investasi" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                    Detail Insentif Fiskal &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Kemudahan Berusaha</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Layanan Administrator KEK setempat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Proses perizinan melalui sistem OSS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Kemudahan hak atas tanah & izin kerja WNA</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/investasi" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                    Panduan Berusaha &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Infrastruktur Terintegrasi</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Akses pelabuhan hub internasional & bandara</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Koneksi jalan tol dan jalur kereta barang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Pasokan energi terbarukan & air industri</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/investasi" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                    Kesiapan Utilitas &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. BERITA TERBARU */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              align="left"
              badge="Warta Kawasan"
              title="Kabar & Informasi Terkini"
              description="Siaran pers resmi pemerintah, peresmian fasilitas industri baru, dan agenda strategis Kawasan Ekonomi Khusus."
            />
            <Link href="/berita" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                Lihat Arsip Berita <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. REGULASI JDIH TERBARU */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeader
              align="left"
              badge="Basis Regulasi"
              title="JDIH & Instrumen Hukum KEK"
              description="Kumpulan regulasi perundang-undangan pokok yang menjamin kepastian tata kelola KEK Indonesia."
            />
            <Link href="/jdih" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                Telusuri Semua Dokumen <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all space-y-2">
                <Badge variant="secondary" className="text-[10px]">
                  {doc.category}
                </Badge>
                <div className="text-xs font-bold text-blue-900">{doc.documentNumber}</div>
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                  {doc.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0b1f3c] via-[#0f284e] to-[#122b52] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <Badge variant="amber" className="text-xs px-3 py-1 font-bold">
            Konsultasi Investasi
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Siap Menjadi Bagian dari Pertumbuhan Ekonomi Indonesia?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Hubungi helpdesk investasi kami untuk mendapatkan informasi tata cara pendaftaran, asistensi fasilitas fiskal, dan verifikasi kelayakan proyek usaha Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/kontak">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none shadow-md">
                Hubungi Tim Helpdesk
              </Button>
            </Link>
            <Link href="/investasi">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Pelajari Insentif Fiskal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
