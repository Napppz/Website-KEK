import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { fallbackReports } from "./fallback";
import type { Report } from "@/types";

/**
 * Mengambil data laporan tahunan kinerja dengan filter
 */
export async function getReports(params?: {
  search?: string;
  year?: number;
}): Promise<Report[]> {
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
}

export async function getReportYears(): Promise<number[]> {
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
}
