import { prisma } from "@/lib/prisma";
import type { Prisma, Role } from "@prisma/client";
import { fallbackNews, fallbackCategories } from "./fallback";
import { withCache } from "@/lib/cache";
import type { News, NewsCategory } from "@/types";
import { NewsQueryParams } from "../validations/query";

export type NewsWithRelations = News & {
  category: NewsCategory;
  author: {
    name: string;
    role: Role;
  };
};

export interface PaginatedNews {
  data: NewsWithRelations[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/**
 * Mengambil berita terbaru yang telah dipublikasikan
 */
export async function getLatestNews(limit: number = 3): Promise<NewsWithRelations[]> {
  return withCache(`news:latest:${limit}`, 30, async () => {
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
  });
}

/**
 * Mengambil data berita berhalaman dengan search, filter kategori, filter tahun, dan sorting
 */
export async function getNewsPaginated(params: NewsQueryParams): Promise<PaginatedNews> {
  const { q, category, year, sort = "latest", page = 1, limit = 6 } = params;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.NewsWhereInput = {
      status: "PUBLISHED",
    };

    if (category && category !== "ALL") {
      where.category = { slug: category };
    }

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      where.publishedAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (q && q.trim() !== "") {
      const term = q.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { excerpt: { contains: term, mode: "insensitive" } },
        { content: { contains: term, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.NewsOrderByWithRelationInput = {
      publishedAt: sort === "oldest" ? "asc" : "desc",
    };

    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: { name: true, role: true },
          },
        },
      }),
    ]);

    return {
      data: news as unknown as NewsWithRelations[],
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      limit,
    };
  } catch {
    console.warn("Neon query for news list failed, using fallback.");
  }

  // Fallback filtering & sorting
  let filtered = [...fallbackNews];

  if (category && category !== "ALL") {
    filtered = filtered.filter((n) => n.category.slug === category);
  }

  if (year) {
    filtered = filtered.filter((n) => {
      if (!n.publishedAt) return false;
      const pubYear = new Date(n.publishedAt).getFullYear();
      return pubYear === year;
    });
  }

  if (q && q.trim() !== "") {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        n.excerpt.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term)
    );
  }

  if (sort === "oldest") {
    filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateA - dateB;
    });
  } else {
    filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  const total = filtered.length;
  const paginatedData = filtered.slice(skip, skip + limit);

  return {
    data: paginatedData as unknown as NewsWithRelations[],
    total,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
    limit,
  };
}

/**
 * Mengambil detail berita berdasarkan slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsWithRelations | null> {
  return withCache(`news:slug:${slug}`, 30, async () => {
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
  });
}

/**
 * Mengambil berita terkait (berdasarkan kategori yang sama)
 */
export async function getRelatedNews(
  currentSlug: string,
  categoryId?: string,
  limit: number = 3
): Promise<NewsWithRelations[]> {
  return withCache(`news:related:${currentSlug}:${categoryId || "none"}:${limit}`, 30, async () => {
    try {
      const news = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          slug: { not: currentSlug },
          ...(categoryId ? { categoryId } : {}),
        },
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
      // fallback
    }

    return fallbackNews
      .filter((n) => n.slug !== currentSlug)
      .slice(0, limit) as unknown as NewsWithRelations[];
  });
}

/**
 * Mengambil seluruh kategori berita untuk filter navigasi
 */
export async function getNewsCategories(): Promise<NewsCategory[]> {
  return withCache("news:categories", 60, async () => {
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
  });
}

/**
 * Mengambil daftar tahun rilis berita unik untuk dropdown filter
 */
export async function getNewsYears(): Promise<number[]> {
  return withCache("news:years", 60, async () => {
    try {
      const news = await prisma.news.findMany({
        where: { status: "PUBLISHED", publishedAt: { not: null } },
        select: { publishedAt: true },
        distinct: ["publishedAt"],
      });

      if (news && news.length > 0) {
        const years = new Set<number>();
        news.forEach((n) => {
          if (n.publishedAt) {
            years.add(new Date(n.publishedAt).getFullYear());
          }
        });
        return Array.from(years).sort((a, b) => b - a);
      }
    } catch {
      // ignore
    }

    const years = new Set<number>();
    fallbackNews.forEach((n) => {
      if (n.publishedAt) {
        years.add(new Date(n.publishedAt).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  });
}
