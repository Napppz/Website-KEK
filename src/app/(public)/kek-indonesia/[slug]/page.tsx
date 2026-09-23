import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  Coins,
  ArrowLeft,
  Compass,
  Calendar,
  Layers,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { SocialShare } from "@/components/common/social-share";
import { KekLeafletMap } from "@/components/map/kek-leaflet-map";
import { getKekBySlug } from "@/lib/data/kek";
import { formatCurrencyIDR, formatNumber } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const kek = await getKekBySlug(slug);

  if (!kek) {
    return {
      title: "Kawasan Tidak Ditemukan — KEK Indonesia",
      description: "Informasi Kawasan Ekonomi Khusus tidak ditemukan.",
    };
  }

  return {
    title: `${kek.name} — Profil & Fasilitas Investasi KEK Indonesia`,
    description: kek.description,
    openGraph: {
      title: `${kek.name} — Kawasan Ekonomi Khusus Indonesia`,
      description: kek.description,
      images: kek.imageUrl ? [{ url: kek.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${kek.name} — KEK Indonesia`,
      description: kek.description,
      images: kek.imageUrl ? [kek.imageUrl] : undefined,
    },
  };
}

export default async function KekDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const kek = await getKekBySlug(slug);

  if (!kek) {
    notFound();
  }

  const isOperating = kek.status === "BEROPERASI";
  const defaultImage =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80";

  // Aggregates
  let totalInvestment = 0;
  let totalLabor = 0;
  if (kek.investments && kek.investments.length > 0) {
    for (const inv of kek.investments) {
      totalInvestment += Number(inv.investmentValue);
      totalLabor += inv.employeeCount;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO HEADER */}
      <PageHeader
        badge={isOperating ? "Kawasan Beroperasi" : "Tahap Pembangunan"}
        badgeVariant={isOperating ? "emerald" : "amber"}
        title={kek.name}
        description={`${kek.city}, Provinsi ${kek.province}`}
        breadcrumbs={[
          { label: "Kawasan KEK", href: "/kek-indonesia" },
          { label: kek.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* Navigation & Social Sharing Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/kek-indonesia"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0b1f3c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Direktori KEK Indonesia
          </Link>

          <span className="text-xs text-slate-400">
            Terakhir diperbarui: {new Date(kek.updatedAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
          </span>
        </div>

        {/* 2. HERO IMAGE & KEY INDICATORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual & Overview */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src={kek.imageUrl || defaultImage}
                alt={kek.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-amber-300 font-semibold inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {kek.address}
                </span>
                <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-slate-200 font-semibold">
                  Luas Wilayah: {kek.area} Ha
                </span>
              </div>
            </div>

            {/* Deskripsi Kawasan */}
            <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                Profil & Keunggulan Geo-Ekonomi
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {kek.description}
              </p>
            </div>

            {/* Peta Lokasi Spesifik Kawasan */}
            <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Lokasi Geografis & Peta Kawasan
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {kek.latitude.toFixed(4)}, {kek.longitude.toFixed(4)}
                </span>
              </div>
              <KekLeafletMap keks={[kek]} />
            </div>

            {/* Social Sharing Component */}
            <SocialShare title={kek.name} />
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <Card className="border-slate-200 shadow-xs bg-slate-50/70">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                  Metrik & Data Utama
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Sektor Fokus Utama:</span>
                    <strong className="text-slate-900 text-sm block leading-snug">
                      {kek.focus}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block">Luas Kawasan:</span>
                      <strong className="text-slate-900 text-base">
                        {kek.area} <span className="text-xs font-normal">Ha</span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status Operasional:</span>
                      <Badge variant={isOperating ? "emerald" : "amber"} className="text-[10px] mt-1">
                        {isOperating ? "Beroperasi" : "Konstruksi"}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Realisasi Investasi:</span>
                        <strong className="text-slate-900 text-sm">
                          {totalInvestment > 0
                            ? formatCurrencyIDR(totalInvestment, { compact: true })
                            : "Rp 10+ Triliun"}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Tenaga Kerja Terserap:</span>
                        <strong className="text-slate-900 text-sm">
                          {totalLabor > 0 ? `${formatNumber(totalLabor)} Orang` : "3.000+ Orang"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Link href="/kontak" className="w-full block">
                      <Button className="w-full gap-2 font-bold bg-[#0b1f3c] hover:bg-[#1a3b6b] text-xs h-10 rounded-xl">
                        Konsultasi Helpdesk Investasi
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card className="border-slate-200 shadow-xs bg-white">
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" /> Layanan Terkait Kawasan
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li>
                    <Link href="/investasi" className="hover:text-blue-600 hover:underline flex items-center justify-between">
                      <span>Paket Insentif Fiskal (Tax Holiday)</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </li>
                  <li>
                    <Link href={`/jdih?q=${encodeURIComponent(kek.name)}`} className="hover:text-blue-600 hover:underline flex items-center justify-between">
                      <span>Dasar Hukum & Regulasi Pembentukan</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/galeri" className="hover:text-blue-600 hover:underline flex items-center justify-between">
                      <span>Dokumentasi Visual Kawasan</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. RIWAYAT INVESTASI TAHUNAN */}
        {kek.investments && kek.investments.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Histori Capaian Investasi & Penyerapan Tenaga Kerja
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan akumulasi penanaman modal dan rekrutmen tenaga kerja per periode tahun
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kek.investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="blue" className="text-xs">
                      Tahun {inv.year}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-700">
                      {formatCurrencyIDR(Number(inv.investmentValue))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{inv.description}</p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Penyerapan Tenaga Kerja:</span>
                    <strong className="text-slate-900">{formatNumber(inv.employeeCount)} orang</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. RELATED NEWS SECTION */}
        {kek.news && kek.news.length > 0 && (
          <div className="space-y-5 pt-6 border-t border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Berita & Siaran Pers Terkait {kek.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kabar perkembangan pembangunan, kemitraan strategis, dan aktivitas operasional kawasan
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kek.news.map((n) => (
                <div
                  key={n.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-amber-600 uppercase">
                        {n.category?.name || "Kabar Kawasan"}
                      </span>
                      {n.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(n.publishedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                        </span>
                      )}
                    </div>
                    <Link href={`/berita/${n.slug}`}>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                        {n.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.excerpt}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={`/berita/${n.slug}`}
                      className="text-xs font-semibold text-[#0b1f3c] hover:text-amber-600 transition-colors inline-flex items-center gap-1"
                    >
                      Baca Selengkapnya &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
