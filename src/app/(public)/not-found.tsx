import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0f284e] flex items-center justify-center shadow-xs">
        <Compass className="w-8 h-8 text-amber-500 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full">
          Halaman 404 Tidak Ditemukan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Halaman Tidak Tersedia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Halaman, informasi kawasan, atau artikel yang Anda cari mungkin telah dipindahkan, dinonaktifkan, atau alamat URL yang dimasukkan kurang tepat.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="default" size="sm" className="gap-2 bg-[#0f284e] hover:bg-[#1a3b6b]">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/kek-indonesia">
          <Button variant="outline" size="sm" className="gap-2">
            Jelajahi Kawasan KEK
          </Button>
        </Link>
      </div>
    </div>
  );
}
