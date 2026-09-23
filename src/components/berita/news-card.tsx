import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { NewsWithRelations } from "@/lib/data/news";

export interface NewsCardProps {
  news: NewsWithRelations;
}

export function NewsCard({ news }: NewsCardProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="group overflow-hidden flex flex-col h-full bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
      <Link href={`/berita/${news.slug}`} className="relative w-full h-48 overflow-hidden bg-slate-100 block">
        <Image
          src={news.thumbnailUrl || defaultImage}
          alt={news.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="blue" className="bg-[#0b1f3c] text-white text-[10px] font-bold shadow-xs">
            {news.category.name}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(news.publishedAt || news.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <User className="w-3 h-3 text-slate-400" />
              {news.author?.name || "Redaksi KEK"}
            </span>
          </div>

          <Link href={`/berita/${news.slug}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
              {news.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {news.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/berita/${news.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            Baca Selengkapnya
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
