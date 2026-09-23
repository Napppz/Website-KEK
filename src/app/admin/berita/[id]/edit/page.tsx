import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/forms/news-form";

export const metadata = {
  title: "Edit Berita | Admin KEK",
};

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;

  let news = null;
  try {
    news = await prisma.news.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Failed fetching news article:", err);
  }

  if (!news) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          href="/admin/berita"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-emerald-600" />
            Edit Berita: {news.title}
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui naskah konten, kategori, foto cover, atau status terbit siaran pers.
          </p>
        </div>
      </div>

      <NewsForm
        isEdit
        initialData={{
          id: news.id,
          title: news.title,
          slug: news.slug,
          excerpt: news.excerpt,
          content: news.content,
          thumbnailUrl: news.thumbnailUrl || "",
          categoryId: news.categoryId,
          kekId: news.kekId,
          status: news.status,
          publishedAt: news.publishedAt,
        }}
      />
    </div>
  );
}
