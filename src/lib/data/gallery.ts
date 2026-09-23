import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { fallbackGalleries } from "./fallback";
import { withCache } from "@/lib/cache";
import type { Gallery } from "@/types";
import { GalleryQueryParams } from "../validations/query";

export interface PaginatedGalleries {
  data: Gallery[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/**
 * Mengambil dokumentasi foto galeri dengan filter kategori dan server-side pagination
 */
export async function getGalleriesPaginated(params: GalleryQueryParams): Promise<PaginatedGalleries> {
  const { category, page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.GalleryWhereInput = {};

    if (category && category !== "ALL") {
      where.category = category;
    }

    const [total, galleries] = await Promise.all([
      prisma.gallery.count({ where }),
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: galleries,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      limit,
    };
  } catch {
    console.warn("Neon query for galleries failed, using fallback.");
  }

  // Fallback
  let filtered = [...fallbackGalleries];

  if (category && category !== "ALL") {
    filtered = filtered.filter((g) => g.category === category);
  }

  const total = filtered.length;
  const paginatedData = filtered.slice(skip, skip + limit);

  return {
    data: paginatedData,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
    limit,
  };
}

/**
 * Mengambil dokumentasi foto galeri dengan filter kategori (Legacy)
 */
export async function getGalleries(params?: {
  category?: string;
}): Promise<Gallery[]> {
  const cacheKey = `gallery:${params?.category || "all"}`;
  return withCache(cacheKey, 30, async () => {
    try {
      const where: Prisma.GalleryWhereInput = {};

      if (params?.category && params.category !== "ALL") {
        where.category = params.category;
      }

      const galleries = await prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      if (galleries && galleries.length > 0) {
        return galleries;
      }
    } catch {
      console.warn("Neon query for galleries failed, using fallback.");
    }

    let result = [...fallbackGalleries];

    if (params?.category && params.category !== "ALL") {
      result = result.filter((g) => g.category === params.category);
    }

    return result;
  });
}

export async function getGalleryCategories(): Promise<string[]> {
  return withCache("gallery:categories", 60, async () => {
    try {
      const galleries = await prisma.gallery.findMany({
        select: { category: true },
        distinct: ["category"],
        orderBy: { category: "asc" },
      });

      if (galleries && galleries.length > 0) {
        return galleries.map((g) => g.category);
      }
    } catch {
      // ignore
    }

    return Array.from(new Set(fallbackGalleries.map((g) => g.category)));
  });
}
