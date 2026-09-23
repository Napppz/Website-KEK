import { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { DocumentFilterClient } from "@/components/dokumen/document-filter-client";
import { getDocuments, getDocumentCategories, getDocumentYears } from "@/lib/data/document";

export const metadata: Metadata = {
  title: "JDIH — Jaringan Dokumentasi & Informasi Hukum KEK Indonesia",
  description:
    "Basis data regulasi hukum, Peraturan Pemerintah, Keputusan Presiden, dan Peraturan Menteri Keuangan yang mengatur penyelenggaraan Kawasan Ekonomi Khusus.",
};

export default async function JdihPage() {
  const [documents, categories, years] = await Promise.all([
    getDocuments(),
    getDocumentCategories(),
    getDocumentYears(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge="JDIH KEK Indonesia"
        title="Jaringan Dokumentasi & Informasi Hukum"
        description="Pusat penelusuran produk hukum dan regulasi resmi seputar penetapan kawasan, kepabeanan, insentif perpajakan, dan tata cara perizinan berusaha di Kawasan Ekonomi Khusus."
        breadcrumbs={[{ label: "JDIH & Regulasi" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        <DocumentFilterClient
          initialDocuments={documents}
          categories={categories}
          years={years}
        />
      </div>
    </div>
  );
}
