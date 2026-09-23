import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { fallbackGalleries } from "./fallback";
import type { Gallery } from "@/types";

/**
 * Mengambil dokumentasi foto galeri dengan filter kategori
 */
export async function getGalleries(params?: {
  category?: string;
}): Promise<Gallery[]> {
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
}

export async function getGalleryCategories(): Promise<string[]> {
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
}
