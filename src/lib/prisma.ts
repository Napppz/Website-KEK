import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Memeriksa apakah DATABASE_URL masih berupa URL placeholder/sampel.
 * Mencegah TCP Connection Timeout (15 detik) pada setiap request saat dev server berjalan tanpa Neon DB asli.
 */
export function isPlaceholderDb(): boolean {
  const url = process.env.DATABASE_URL || "";
  return !url || url.includes("placeholder") || url.includes("ep-sample");
}

export default prisma;
