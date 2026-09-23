import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const metadata = {
  title: "Edit Foto Galeri | Admin KEK",
};

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params;

  let item = null;
  try {
    item = await prisma.gallery.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Failed fetching gallery item:", err);
  }

  if (!item) {
    notFound();
  }

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
            Edit Foto: {item.title}
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui takarir foto, kategori dokumentasi, atau tautan gambar.
          </p>
        </div>
      </div>

      <GalleryForm
        isEdit
        initialData={{
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          kekId: item.kekId,
        }}
      />
    </div>
  );
}
