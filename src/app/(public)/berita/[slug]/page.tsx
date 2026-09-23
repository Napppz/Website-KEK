import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { SocialShare } from "@/components/common/social-share";
import { NewsCard } from "@/components/berita/news-card";
import { getNewsBySlug, getRelatedNews } from "@/lib/data/news";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan — KEK Indonesia",
    };
  }

  return {
    title: `${news.title} — KEK Indonesia`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.thumbnailUrl ? [{ url: news.thumbnailUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.excerpt,
      images: news.thumbnailUrl ? [news.thumbnailUrl] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news.slug, news.categoryId, 2);

  const defaultImage =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        badge={news.category.name}
        title={news.title}
        breadcrumbs={[
          { label: "Berita", href: "/berita" },
          { label: news.title },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 w-full">
        {/* Back Link & Meta bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0b1f3c] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Semua Berita
          </Link>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(news.publishedAt || news.createdAt, true)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {news.author?.name || "Redaksi KEK Indonesia"}
            </span>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="relative w-full h-[320px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
          <Image
            src={news.thumbnailUrl || defaultImage}
            alt={news.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Lead Excerpt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-blue-800 text-slate-700 font-medium text-sm sm:text-base leading-relaxed italic">
          {news.excerpt}
        </div>

        {/* Main Content Body */}
        <div
          className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-slate-800"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Social Sharing */}
        <SocialShare title={news.title} />

        {/* Tags & Disclaimer Box */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Kategori:</span>
            <Badge variant="secondary" className="text-xs">
              {news.category.name}
            </Badge>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Artikel ini diterbitkan secara resmi oleh Sekretariat Jenderal Dewan Nasional Kawasan Ekonomi Khusus Indonesia untuk kepentingan informasi publik dan transparansi investasi.
            </span>
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Berita Terkait Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedNews.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
