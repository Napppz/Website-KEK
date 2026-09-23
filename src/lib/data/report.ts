import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { fallbackReports } from "./fallback";
import { withCache } from "@/lib/cache";
import type { Report } from "@/types";
import { ReportQueryParams } from "../validations/query";

export interface PaginatedReports {
  data: Report[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/**
 * Mengambil data laporan tahunan kinerja dengan server-side pagination dan filter
 */
export async function getReportsPaginated(params: ReportQueryParams): Promise<PaginatedReports> {
  const { q, year, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.ReportWhereInput = {};

    if (year && !isNaN(year) && year > 0) {
      where.year = year;
    }

    if (q && q.trim() !== "") {
      const term = q.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ];
    }

    const [total, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        orderBy: { year: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: reports,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      limit,
    };
  } catch {
    console.warn("Neon query for reports failed, using fallback.");
  }

  // Fallback
  let filtered = [...fallbackReports];

  if (year && !isNaN(year) && year > 0) {
    filtered = filtered.filter((r) => r.year === year);
  }

  if (q && q.trim() !== "") {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
    );
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
 * Mengambil data laporan tahunan kinerja dengan filter (Legacy)
 */
export async function getReports(params?: {
  search?: string;
  year?: number;
}): Promise<Report[]> {
  const cacheKey = `reports:${params?.year || "all"}:${params?.search || "none"}`;
  return withCache(cacheKey, 30, async () => {
    try {
      const where: Prisma.ReportWhereInput = {};

      if (params?.year && !isNaN(params.year) && params.year > 0) {
        where.year = params.year;
      }

      if (params?.search) {
        where.OR = [
          { title: { contains: params.search, mode: "insensitive" } },
          { description: { contains: params.search, mode: "insensitive" } },
        ];
      }

      const reports = await prisma.report.findMany({
        where,
        orderBy: { year: "desc" },
      });

      if (reports && reports.length > 0) {
        return reports;
      }
    } catch {
      console.warn("Neon query for reports failed, using fallback.");
    }

    let result = [...fallbackReports];

    if (params?.year && !isNaN(params.year) && params.year > 0) {
      result = result.filter((r) => r.year === params.year);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    return result;
  });
}

export async function getReportYears(): Promise<number[]> {
  return withCache("reports:years", 60, async () => {
    try {
      const reports = await prisma.report.findMany({
        select: { year: true },
        distinct: ["year"],
        orderBy: { year: "desc" },
      });

      if (reports && reports.length > 0) {
        return reports.map((r) => r.year);
      }
    } catch {
      // ignore
    }

    return Array.from(new Set(fallbackReports.map((r) => r.year))).sort((a, b) => b - a);
  });
}
