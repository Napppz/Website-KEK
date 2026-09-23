import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { fallbackDocuments } from "./fallback";
import type { Document } from "@/types";

/**
 * Mengambil daftar dokumen regulasi JDIH dengan filter
 */
export async function getDocuments(params?: {
  search?: string;
  category?: string;
  year?: number;
}): Promise<Document[]> {
  try {
    const where: Prisma.DocumentWhereInput = {};

    if (params?.category && params.category !== "ALL") {
      where.category = params.category;
    }

    if (params?.year && !isNaN(params.year) && params.year > 0) {
      where.year = params.year;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { documentNumber: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const docs = await prisma.document.findMany({
      where,
      orderBy: { year: "desc" },
    });

    if (docs && docs.length > 0) {
      return docs;
    }
  } catch {
    console.warn("Neon query for documents failed, using fallback.");
  }

  let result = [...fallbackDocuments];

  if (params?.category && params.category !== "ALL") {
    result = result.filter((d) => d.category === params.category);
  }

  if (params?.year && !isNaN(params.year) && params.year > 0) {
    result = result.filter((d) => d.year === params.year);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    );
  }

  return result;
}

/**
 * Mengambil daftar kategori dokumen regulasi yang tersedia
 */
export async function getDocumentCategories(): Promise<string[]> {
  try {
    const docs = await prisma.document.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    if (docs && docs.length > 0) {
      return docs.map((d) => d.category);
    }
  } catch {
    // ignore
  }

  return Array.from(new Set(fallbackDocuments.map((d) => d.category)));
}

/**
 * Mengambil daftar tahun dokumen regulasi yang tersedia
 */
export async function getDocumentYears(): Promise<number[]> {
  try {
    const docs = await prisma.document.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    if (docs && docs.length > 0) {
      return docs.map((d) => d.year);
    }
  } catch {
    // ignore
  }

  return Array.from(new Set(fallbackDocuments.map((d) => d.year))).sort((a, b) => b - a);
}
