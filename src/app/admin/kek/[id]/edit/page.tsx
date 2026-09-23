import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { KEKForm } from "@/components/admin/forms/kek-form";

export const metadata = {
  title: "Edit Kawasan KEK | Admin KEK",
};

interface EditKekPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditKekPage({ params }: EditKekPageProps) {
  const { id } = await params;

  let kek = null;
  try {
    kek = await prisma.kEK.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Failed fetching KEK for editing:", err);
  }

  if (!kek) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/kek"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Edit Kawasan: {kek.name}
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui spesifikasi, letak koordinat, dan status operasional kawasan.
          </p>
        </div>
      </div>

      <KEKForm
        isEdit
        initialData={{
          id: kek.id,
          name: kek.name,
          slug: kek.slug,
          description: kek.description,
          province: kek.province,
          city: kek.city,
          address: kek.address,
          area: kek.area,
          focus: kek.focus,
          status: kek.status,
          latitude: kek.latitude,
          longitude: kek.longitude,
          imageUrl: kek.imageUrl || "",
        }}
      />
    </div>
  );
}
