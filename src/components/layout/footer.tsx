import Link from "next/link";
import { Building2, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b1f3c] text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Kolom 1: Profil Kelembagaan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  KEK INDONESIA
                </h3>
                <p className="text-xs text-slate-400">
                  Portal Informasi & Pelayanan Investasi Kawasan Ekonomi Khusus
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 max-w-md">
              Kawasan Ekonomi Khusus (KEK) Indonesia disiapkan untuk memaksimalkan kegiatan industri, ekspor, impor, dan kegiatan ekonomi lain yang memiliki nilai ekonomi tinggi serta keunggulan geostrategis.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Gedung Pelayanan Investasi KEK Indonesia, Jakarta Pusat, DKI Jakarta 10110</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 (021) 345-6789 (Senin - Jumat, 08.00 - 16.30 WIB)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@kek.go.id / layanan.investasi@kek.go.id</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Kawasan Strategis */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Kawasan KEK
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/kek-indonesia/kek-sei-mangkei" className="hover:text-white transition-colors">
                  KEK Sei Mangkei
                </Link>
              </li>
              <li>
                <Link href="/kek-indonesia/kek-kendal" className="hover:text-white transition-colors">
                  KEK Kendal
                </Link>
              </li>
              <li>
                <Link href="/kek-indonesia/kek-mandalika" className="hover:text-white transition-colors">
                  KEK Mandalika
                </Link>
              </li>
              <li>
                <Link href="/kek-indonesia/kek-nongsa-digital-park" className="hover:text-white transition-colors">
                  KEK Nongsa Digital Park
                </Link>
              </li>
              <li>
                <Link href="/kek-indonesia/kek-sanur" className="hover:text-white transition-colors">
                  KEK Sanur
                </Link>
              </li>
              <li>
                <Link href="/kek-indonesia" className="text-amber-300 font-semibold hover:underline inline-flex items-center gap-1">
                  Lihat Semua Kawasan &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan & Informasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Layanan & Investasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/investasi#fasilitas-fiskal" className="hover:text-white transition-colors">
                  Fasilitas & Insentif Fiskal
                </Link>
              </li>
              <li>
                <Link href="/investasi#kemudahan-berusaha" className="hover:text-white transition-colors">
                  Kemudahan Berusaha & OSS
                </Link>
              </li>
              <li>
                <Link href="/investasi#prosedur" className="hover:text-white transition-colors">
                  Prosedur Investasi
                </Link>
              </li>
              <li>
                <Link href="/laporan" className="hover:text-white transition-colors">
                  Laporan Realisasi Investasi
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition-colors">
                  Konsultasi Helpdesk KEK
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: JDIH & Kebijakan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Regulasi & Publikasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/jdih" className="hover:text-white transition-colors">
                  JDIH & Basis Regulasi
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-white transition-colors">
                  Berita & Siaran Pers
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-white transition-colors">
                  Dokumentasi Foto & Video
                </Link>
              </li>
              <li>
                <Link href="/tentang-kek" className="hover:text-white transition-colors">
                  Profil Dewan Nasional KEK
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
                  <span>Portal Administrator</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Institutional Compliance */}
      <div className="border-t border-slate-800 bg-[#08172c] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Portal Informasi Resmi Kawasan Ekonomi Khusus Indonesia &copy; 2026. Hak Cipta Dilindungi.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <span>•</span>
            <Link href="/peta-situs" className="hover:text-white transition-colors">
              Peta Situs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
