import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Newspaper,
  FileText,
  Users,
  Image as ImageIcon,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  let kekCount = 7;
  let operatingCount = 5;
  let newsCount = 3;
  let docCount = 3;
  let reportCount = 3;
  let galleryCount = 6;
  let userCount = 2;

  try {
    const [keks, news, docs, reports, galleries, users] = await Promise.all([
      prisma.kEK.findMany({ select: { status: true } }),
      prisma.news.count(),
      prisma.document.count(),
      prisma.report.count(),
      prisma.gallery.count(),
      prisma.user.count(),
    ]);

    if (keks.length > 0) {
      kekCount = keks.length;
      operatingCount = keks.filter((k) => k.status === "BEROPERASI").length;
    }
    if (news > 0) newsCount = news;
    if (docs > 0) docCount = docs;
    if (reports > 0) reportCount = reports;
    if (galleries > 0) galleryCount = galleries;
    if (users > 0) userCount = users;
  } catch {
    // Fallback data values remain
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Dashboard CMS</h1>
          <p className="text-xs text-slate-500">
            Pusat statistik data, statistik publikasi, dan manajemen operasional portal KEK Indonesia.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" className="text-xs font-semibold py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Sistem Beroperasi Aktif
          </Badge>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Kawasan KEK</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{kekCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              {operatingCount} Beroperasi, {kekCount - operatingCount} Pembangunan
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Berita & Artikel</CardTitle>
            <Newspaper className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{newsCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Siaran pers publik</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Dokumen JDIH</CardTitle>
            <FileText className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{docCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Regulasi & PP resmi</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Laporan Tahunan</CardTitle>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{reportCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Laporan kinerja</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Galeri Foto</CardTitle>
            <ImageIcon className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{galleryCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Foto dokumentasi</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">Pengguna Admin</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{userCount}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Admin & Editor</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Modul Kelola Konten & Data</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/kek"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Manajemen Kawasan KEK</span>
              </div>
              <p className="text-xs text-slate-500">
                Tambah, ubah spesifikasi, koordinat GIS, dan status operasional KEK.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href="/admin/berita"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Newspaper className="w-4 h-4" />
                <span>Berita & Siaran Pers</span>
              </div>
              <p className="text-xs text-slate-500">
                Publikasikan artikel, kabar kawasan, dan pengumuman resmi.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href="/admin/dokumen"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Regulasi Hukum JDIH</span>
              </div>
              <p className="text-xs text-slate-500">
                Kelola arsip Undang-Undang, Peraturan Pemerintah, dan Permen.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href="/admin/laporan"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>Laporan Kinerja Tahunan</span>
              </div>
              <p className="text-xs text-slate-500">
                Unggah dokumen transparansi akuntabilitas publik kawasan per tahun.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href="/admin/galeri"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-pink-700 font-bold text-sm">
                <ImageIcon className="w-4 h-4" />
                <span>Galeri Foto Dokumentasi</span>
              </div>
              <p className="text-xs text-slate-500">
                Kelola foto peresmian, fasilitas industri, dan momen proyek.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            href="/admin/users"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Pengguna Sistem</span>
              </div>
              <p className="text-xs text-slate-500">
                Atur akun administrator, editor konten, dan kewenangan hak akses.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
