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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
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
    };
  }

  return {
    title: `${kek.name} — Profil Kawasan Ekonomi Khusus`,
    description: kek.description,
    openGraph: {
      title: `${kek.name} — KEK Indonesia`,
      description: kek.description,
      images: kek.imageUrl ? [{ url: kek.imageUrl }] : undefined,
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

  // Hitung total investasi & tenaga kerja
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

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/kek-indonesia"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Seluruh Kawasan
          </Link>
        </div>

        {/* 2. HERO IMAGE & KEY INDICATORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src={kek.imageUrl || defaultImage}
                alt={kek.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 font-semibold inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {kek.address}
                </span>
              </div>
            </div>

            {/* Deskripsi Kawasan */}
            <div className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Profil & Keunggulan Kawasan
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {kek.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="border-slate-200 shadow-xs bg-slate-50/50">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                  Indikator Kawasan
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Fokus Sektor Industri:</span>
                    <strong className="text-slate-900 text-sm block leading-snug">
                      {kek.focus}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block">Luas Wilayah:</span>
                      <strong className="text-slate-900 text-base">
                        {kek.area} <span className="text-xs font-normal">Ha</span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <Badge variant={isOperating ? "emerald" : "amber"} className="text-[10px] mt-1">
                        {isOperating ? "Beroperasi" : "Konstruksi"}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
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
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
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

                  <div className="pt-4 border-t border-slate-200/80">
                    <Link href="/kontak" className="w-full block">
                      <Button className="w-full gap-2 font-bold bg-[#0f284e] hover:bg-[#1a3b6b] text-xs">
                        Konsultasi Peluang Investasi
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Koordinat Geospasial */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Compass className="w-4 h-4 text-blue-700" /> Koordinat Geografis GIS
                </div>
                <div className="text-slate-500 font-mono text-[11px] bg-slate-100 p-2 rounded">
                  Latitude: {kek.latitude.toFixed(4)} | Longitude: {kek.longitude.toFixed(4)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. RIWAYAT INVESTASI TAHUNAN */}
        {kek.investments && kek.investments.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Capaian Realisasi Investasi & Tenaga Kerja
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kek.investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Tahun {inv.year}</Badge>
                    <span className="text-xs font-bold text-emerald-700">
                      {formatCurrencyIDR(Number(inv.investmentValue))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{inv.description}</p>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Penyerapan Tenaga Kerja: <strong>{formatNumber(inv.employeeCount)} orang</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BERITA TERKAIT KAWASAN */}
        {kek.news && kek.news.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Warta & Berita Terkini Seputar {kek.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kek.news.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
                >
                  <Link href={`/berita/${n.slug}`}>
                    <h4 className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                      {n.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2">{n.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
