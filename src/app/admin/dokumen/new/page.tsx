import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { DocumentForm } from "@/components/admin/forms/document-form";

export const metadata = {
  title: "Tambah Dokumen JDIH Baru | Admin KEK",
};

export default function NewDocumentPage() {
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
            Tambah Regulasi & Dokumen JDIH Baru
          </h1>
          <p className="text-xs text-slate-500">
            Daftarkan produk hukum, Peraturan Pemerintah, atau regulasi ke portal JDIH.
          </p>
        </div>
      </div>

      <DocumentForm />
    </div>
  );
}
