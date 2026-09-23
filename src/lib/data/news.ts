import { prisma } from "@/lib/prisma";
import type { Prisma, Role } from "@prisma/client";
import { fallbackNews, fallbackCategories } from "./fallback";
import type { News, NewsCategory } from "@/types";

export type NewsWithRelations = News & {
  category: NewsCategory;
  author: {
    name: string;
    role: Role;
  };
};

/**
 * Mengambil berita terbaru yang telah dipublikasikan
 */
export async function getLatestNews(limit: number = 3): Promise<NewsWithRelations[]> {
  try {
    const news = await prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (news && news.length > 0) {
      return news as unknown as NewsWithRelations[];
    }
  } catch {
    console.warn("Neon query for latest news failed, using fallback.");
  }

  return fallbackNews.slice(0, limit) as unknown as NewsWithRelations[];
}

/**
 * Mengambil seluruh berita dengan filter pencarian & kategori
 */
export async function getAllNews(params?: {
  search?: string;
  category?: string;
}): Promise<NewsWithRelations[]> {
  try {
    const where: Prisma.NewsWhereInput = {
      status: "PUBLISHED",
    };

    if (params?.category && params.category !== "ALL") {
      where.category = { slug: params.category };
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
        { content: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (news && news.length > 0) {
      return news as unknown as NewsWithRelations[];
    }
  } catch {
    console.warn("Neon query for news list failed, using fallback.");
  }

  let result = [...fallbackNews];

  if (params?.category && params.category !== "ALL") {
    result = result.filter((n) => n.category.slug === params.category);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }

  return result as unknown as NewsWithRelations[];
}

/**
 * Mengambil detail berita berdasarkan slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsWithRelations | null> {
  try {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (news) {
      return news as unknown as NewsWithRelations;
    }
  } catch {
    console.warn(`Neon query for news slug ${slug} failed, using fallback.`);
  }

  const found = fallbackNews.find((n) => n.slug === slug);
  return (found as unknown as NewsWithRelations) || null;
}

/**
 * Mengambil seluruh kategori berita untuk filter navigasi
 */
export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    const categories = await prisma.newsCategory.findMany({
      orderBy: { name: "asc" },
    });

    if (categories && categories.length > 0) {
      return categories;
    }
  } catch {
    console.warn("Neon query for categories failed, using fallback.");
  }

  return fallbackCategories;
}
