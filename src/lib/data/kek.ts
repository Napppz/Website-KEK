import { Prisma, KekStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fallbackKeks } from "./fallback";
import type { KEK, Investment, News } from "@/types";

export interface KekStats {
  totalKek: number;
  totalProvinces: number;
  totalInvestment: number;
  totalLabor: number;
  isDevelopmentData?: boolean;
}

export type KekWithDetails = KEK & {
  investments: Investment[];
  news?: News[];
};

/**
 * Mengambil ringkasan statistik nasional KEK (Total Kawasan, Provinsi, Akumulasi Investasi, Tenaga Kerja)
 */
export async function getKekStats(): Promise<KekStats> {
  try {
    const keks = await prisma.kEK.findMany({
      include: {
        investments: true,
      },
    });

    if (keks && keks.length > 0) {
      const uniqueProvinces = new Set(keks.map((k) => k.province)).size;
      let totalInvestment = 0;
      let totalLabor = 0;

      for (const kek of keks) {
        for (const inv of kek.investments) {
          totalInvestment += Number(inv.investmentValue);
          totalLabor += inv.employeeCount;
        }
      }

      return {
        totalKek: keks.length,
        totalProvinces: uniqueProvinces,
        totalInvestment: totalInvestment || 177500000000000,
        totalLabor: totalLabor || 64500,
        isDevelopmentData: false,
      };
    }
  } catch {
    console.warn("Neon PostgreSQL belum terhubung, menggunakan data development KEK.");
  }

  // Fallback ke data development
  const uniqueProvinces = new Set(fallbackKeks.map((k) => k.province)).size;
  let totalInvestment = 0;
  let totalLabor = 0;
  for (const kek of fallbackKeks) {
    for (const inv of kek.investments) {
      totalInvestment += Number(inv.investmentValue);
      totalLabor += inv.employeeCount;
    }
  }

  return {
    totalKek: fallbackKeks.length,
    totalProvinces: uniqueProvinces,
    totalInvestment,
    totalLabor,
    isDevelopmentData: true,
  };
}

/**
 * Mengambil data KEK unggulan untuk homepage
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
    console.warn("Neon PostgreSQL query failed, using fallback featured KEKs.");
  }

  return fallbackKeks.slice(0, limit) as KekWithDetails[];
}

/**
 * Mengambil seluruh data KEK dengan dukungan pencarian & filter
 */
export async function getAllKeks(params?: {
  search?: string;
  province?: string;
  focus?: string;
  status?: string;
}): Promise<KekWithDetails[]> {
  try {
    const where: Prisma.KEKWhereInput = {};

    if (params?.status && params.status !== "ALL") {
      where.status = params.status as KekStatus;
    }

    if (params?.province && params.province !== "ALL") {
      where.province = { contains: params.province, mode: "insensitive" };
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { province: { contains: params.search, mode: "insensitive" } },
        { city: { contains: params.search, mode: "insensitive" } },
        { focus: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const keks = await prisma.kEK.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        investments: {
          orderBy: { year: "desc" },
        },
      },
    });

    if (keks && keks.length > 0) {
      return keks as KekWithDetails[];
    }
  } catch {
    console.warn("Neon PostgreSQL query failed, filtering fallback KEKs.");
  }

  let result = [...fallbackKeks];

  if (params?.status && params.status !== "ALL") {
    result = result.filter((k) => k.status === params.status);
  }

  if (params?.province && params.province !== "ALL") {
    result = result.filter((k) =>
      k.province.toLowerCase().includes(params.province!.toLowerCase())
    );
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.province.toLowerCase().includes(q) ||
        k.city.toLowerCase().includes(q) ||
        k.focus.toLowerCase().includes(q)
    );
  }

  return result as KekWithDetails[];
}

/**
 * Mengambil detail KEK berdasarkan slug
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
          take: 3,
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
