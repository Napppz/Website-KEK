import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReportForm } from "@/components/admin/forms/report-form";

export const metadata = {
  title: "Edit Laporan Kinerja | Admin KEK",
};

interface EditReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  const { id } = await params;

  let report = null;
  try {
    report = await prisma.report.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Failed fetching report:", err);
  }

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/laporan"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Edit Laporan: {report.title}
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui data judul laporan, tahun periode kinerja, atau berkas file.
          </p>
        </div>
      </div>

      <ReportForm
        isEdit
        initialData={{
          id: report.id,
          title: report.title,
          year: report.year,
          description: report.description,
          fileUrl: report.fileUrl,
        }}
      />
    </div>
  );
}
