import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/forms/document-form";

export const metadata = {
  title: "Edit Dokumen JDIH | Admin KEK",
};

interface EditDocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = await params;

  let doc = null;
  try {
    doc = await prisma.document.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Failed fetching document:", err);
  }

  if (!doc) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/dokumen"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Edit Dokumen: {doc.documentNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui nomor regulasi, kategori perundangan, atau tautan berkas PDF.
          </p>
        </div>
      </div>

      <DocumentForm
        isEdit
        initialData={{
          id: doc.id,
          title: doc.title,
          documentNumber: doc.documentNumber,
          year: doc.year,
          category: doc.category,
          description: doc.description,
          fileUrl: doc.fileUrl,
          kekId: doc.kekId,
          publishedAt: doc.publishedAt,
        }}
      />
    </div>
  );
}
