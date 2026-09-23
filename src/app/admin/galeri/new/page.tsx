import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const metadata = {
  title: "Tambah Foto Galeri Baru | Admin KEK",
};

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/galeri"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-600" />
            Tambah Foto Dokumentasi Baru
          </h1>
          <p className="text-xs text-slate-500">
            Unggah dokumentasi foto fasilitas industri, peresmian, atau kegiatan kawasan.
          </p>
        </div>
      </div>

      <GalleryForm />
    </div>
  );
}
