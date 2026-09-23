import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { InvestmentForm } from "@/components/admin/forms/investment-form";

export const metadata = {
  title: "Edit Data Investasi | Admin KEK",
};

interface EditInvestmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvestmentPage({ params }: EditInvestmentPageProps) {
  const { id } = await params;

  let investment = null;
  try {
    investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        kek: { select: { name: true } },
      },
    });
  } catch (err) {
    console.error("Failed fetching investment data:", err);
  }

  if (!investment) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/investasi"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Edit Investasi: {investment.kek.name} ({investment.year})
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui data nilai komitmen realisasi modal dan serapan tenaga kerja.
          </p>
        </div>
      </div>

      <InvestmentForm
        isEdit
        initialData={{
          id: investment.id,
          kekId: investment.kekId,
          year: investment.year,
          investmentValue: Number(investment.investmentValue),
          employeeCount: investment.employeeCount,
          description: investment.description,
        }}
      />
    </div>
  );
}
