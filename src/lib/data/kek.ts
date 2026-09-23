import { Prisma, KekStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fallbackKeks } from "./fallback";
import type { KEK, Investment, News, NewsCategory } from "@/types";
import { KekQueryParams } from "../validations/query";

export interface KekStats {
  totalKek: number;
  totalProvinces: number;
  totalInvestment: number;
  totalLabor: number;
  selectedYear?: number;
  availableYears: number[];
  isDevelopmentData?: boolean;
}

export type RelatedNews = News & {
  category?: NewsCategory;
  author?: { name: string };
};

export type KekWithDetails = KEK & {
  investments: Investment[];
  news?: RelatedNews[];
};

export interface PaginatedKeks {
  data: KekWithDetails[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

/**
 * Mengambil ringkasan statistik nasional KEK dengan opsi filter tahun
 */
export async function getKekStats(selectedYear?: number): Promise<KekStats> {
  try {
    const [keks, allInvestments] = await Promise.all([
      prisma.kEK.findMany({
        select: { id: true, province: true },
      }),
      prisma.investment.findMany({
        select: {
          year: true,
          investmentValue: true,
          employeeCount: true,
        },
      }),
    ]);

    if (keks && keks.length > 0) {
      const uniqueProvinces = new Set(keks.map((k) => k.province)).size;
      const availableYears = Array.from(new Set(allInvestments.map((i) => i.year))).sort((a, b) => b - a);

      const targetYear = selectedYear && availableYears.includes(selectedYear)
        ? selectedYear
        : (availableYears[0] || 2025);

      const filteredInvestments = allInvestments.filter((i) => i.year === targetYear);
      let totalInvestment = 0;
      let totalLabor = 0;

      for (const inv of filteredInvestments) {
        totalInvestment += Number(inv.investmentValue);
        totalLabor += inv.employeeCount;
      }

      return {
        totalKek: keks.length,
        totalProvinces: uniqueProvinces,
        totalInvestment: totalInvestment || 177500000000000,
        totalLabor: totalLabor || 64500,
        selectedYear: targetYear,
        availableYears: availableYears.length > 0 ? availableYears : [2024, 2025, 2026],
        isDevelopmentData: false,
      };
    }
  } catch {
    console.warn("Neon PostgreSQL query failed, using fallback stats.");
  }

  // Fallback calculation
  const uniqueProvinces = new Set(fallbackKeks.map((k) => k.province)).size;
  const allInvYears: number[] = [];
  fallbackKeks.forEach((k) => k.investments.forEach((i) => allInvYears.push(i.year)));
  const availableYears = Array.from(new Set(allInvYears)).sort((a, b) => b - a);
  const targetYear = selectedYear && availableYears.includes(selectedYear)
    ? selectedYear
    : (availableYears[0] || 2025);

  let totalInvestment = 0;
  let totalLabor = 0;
  for (const kek of fallbackKeks) {
    for (const inv of kek.investments) {
      if (inv.year === targetYear) {
        totalInvestment += Number(inv.investmentValue);
        totalLabor += inv.employeeCount;
      }
    }
  }

  return {
    totalKek: fallbackKeks.length,
    totalProvinces: uniqueProvinces,
    totalInvestment: totalInvestment || 177500000000000,
    totalLabor: totalLabor || 64500,
    selectedYear: targetYear,
    availableYears: availableYears.length > 0 ? availableYears : [2024, 2025, 2026],
    isDevelopmentData: true,
  };
}

/**
 * Mengambil KEK unggulan untuk showcase di homepage
 */
export async function getFeaturedKeks(limit: number = 4): Promise<KekWithDetails[]> {
  try {
    const keks = await prisma.kEK.findMany({
      take: limit,
      orderBy: { createdAt: "asc" },
      include: {
        investments: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
    });

    if (keks && keks.length > 0) {
      return keks as KekWithDetails[];
    }
  } catch {
    // ignore
  }

  return fallbackKeks.slice(0, limit) as KekWithDetails[];
}

/**
 * Mengambil data KEK berhalaman (Server-side Pagination, Whitelist Sorting, Multi-field Search, Filter)
 */
export async function getKeksPaginated(params: KekQueryParams): Promise<PaginatedKeks> {
  const { q, province, focus, status, sort, page = 1, limit = 9 } = params;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.KEKWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status as KekStatus;
    }

    if (province && province !== "ALL") {
      where.province = { equals: province, mode: "insensitive" };
    }

    if (focus && focus !== "ALL") {
      where.focus = { contains: focus, mode: "insensitive" };
    }

    if (q && q.trim() !== "") {
      const searchTerms = q.trim();
      where.OR = [
        { name: { contains: searchTerms, mode: "insensitive" } },
        { province: { contains: searchTerms, mode: "insensitive" } },
        { city: { contains: searchTerms, mode: "insensitive" } },
        { focus: { contains: searchTerms, mode: "insensitive" } },
        { description: { contains: searchTerms, mode: "insensitive" } },
      ];
    }

    // Whitelist sorting
    let orderBy: Prisma.KEKOrderByWithRelationInput = { name: "asc" };
    if (sort === "name-desc") orderBy = { name: "desc" };
    else if (sort === "latest") orderBy = { createdAt: "desc" };
    else if (sort === "oldest") orderBy = { createdAt: "asc" };

    const [total, keks] = await Promise.all([
      prisma.kEK.count({ where }),
      prisma.kEK.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          investments: {
            orderBy: { year: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    return {
      data: keks as KekWithDetails[],
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      limit,
    };
  } catch {
    console.warn("Neon PostgreSQL query failed, filtering fallback KEKs.");
  }

  // Fallback pagination & sorting
  let filtered = [...fallbackKeks];

  if (status && status !== "ALL") {
    filtered = filtered.filter((k) => k.status === status);
  }

  if (province && province !== "ALL") {
    filtered = filtered.filter((k) => k.province.toLowerCase() === province.toLowerCase());
  }

  if (focus && focus !== "ALL") {
    filtered = filtered.filter((k) => k.focus.toLowerCase().includes(focus.toLowerCase()));
  }

  if (q && q.trim() !== "") {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(
      (k) =>
        k.name.toLowerCase().includes(term) ||
        k.province.toLowerCase().includes(term) ||
        k.city.toLowerCase().includes(term) ||
        k.focus.toLowerCase().includes(term) ||
        k.description.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (sort === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "latest") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "oldest") {
    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = filtered.length;
  const paginatedData = filtered.slice(skip, skip + limit);

  return {
    data: paginatedData as KekWithDetails[],
    total,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
    limit,
  };
}

/**
 * Mengambil detail KEK berdasarkan slug langsung dari database Neon
 */
export async function getKekBySlug(slug: string): Promise<KekWithDetails | null> {
  try {
    const kek = await prisma.kEK.findUnique({
      where: { slug },
      include: {
        investments: {
          orderBy: { year: "desc" },
        },
        news: {
          where: { status: "PUBLISHED" },
          take: 4,
          orderBy: { publishedAt: "desc" },
          include: {
            category: true,
            author: { select: { name: true } },
          },
        },
      },
    });

    if (kek) {
      return kek as KekWithDetails;
    }
  } catch {
    console.warn(`Failed fetching KEK ${slug} from Neon, using fallback.`);
  }

  const found = fallbackKeks.find((k) => k.slug === slug);
  return (found as KekWithDetails) || null;
}

/**
 * Mengambil daftar seluruh KEK untuk map & selector
 */
export async function getAllKeks(): Promise<KekWithDetails[]> {
  try {
    const keks = await prisma.kEK.findMany({
      orderBy: { name: "asc" },
      include: {
        investments: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
    });
    if (keks && keks.length > 0) {
      return keks as KekWithDetails[];
    }
  } catch {
    // fallback
  }
  return fallbackKeks as KekWithDetails[];
}

/**
 * Mengambil daftar provinsi unik untuk filter
 */
export async function getKekProvinces(): Promise<string[]> {
  try {
    const keks = await prisma.kEK.findMany({
      select: { province: true },
      distinct: ["province"],
      orderBy: { province: "asc" },
    });
    if (keks && keks.length > 0) {
      return keks.map((k) => k.province);
    }
  } catch {
    // ignore
  }

  return Array.from(new Set(fallbackKeks.map((k) => k.province))).sort();
}

/**
 * Mengambil daftar sektor fokus unik untuk opsi filter
 */
export async function getKekFoci(): Promise<string[]> {
  try {
    const keks = await prisma.kEK.findMany({
      select: { focus: true },
      distinct: ["focus"],
      orderBy: { focus: "asc" },
    });
    if (keks && keks.length > 0) {
      // Extract unique individual sectors
      const rawFoci = keks.map((k) => k.focus);
      const sectors = new Set<string>();
      rawFoci.forEach((f) => {
        f.split(/[,&]/).forEach((part) => {
          const trimmed = part.trim();
          if (trimmed.length > 2) sectors.add(trimmed);
        });
      });
      return Array.from(sectors).sort();
    }
  } catch {
    // ignore
  }

  const sectors = new Set<string>();
  fallbackKeks.forEach((k) => {
    k.focus.split(/[,&]/).forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.length > 2) sectors.add(trimmed);
    });
  });
  return Array.from(sectors).sort();
}
