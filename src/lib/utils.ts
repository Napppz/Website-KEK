import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names with Tailwind CSS deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format number into Indonesian Rupiah (IDR) currency format or Triliun/Miliar representation
 */
export function formatCurrencyIDR(
  amount: number | bigint,
  options?: { compact?: boolean }
): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;

  if (options?.compact) {
    if (numericAmount >= 1_000_000_000_000) {
      return `Rp ${(numericAmount / 1_000_000_000_000).toFixed(1)} Triliun`;
    }
    if (numericAmount >= 1_000_000_000) {
      return `Rp ${(numericAmount / 1_000_000_000).toFixed(1)} Miliar`;
    }
    if (numericAmount >= 1_000_000) {
      return `Rp ${(numericAmount / 1_000_000).toFixed(1)} Juta`;
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Standard integer / decimal localized number formatter
 */
export function formatNumber(value: number | bigint): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Format date to standard Indonesian date format (e.g., 23 September 2026)
 */
export function formatDate(
  dateInput: Date | string | number | null | undefined,
  includeTime: boolean = false
): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime
      ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }
      : {}),
  };

  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

/**
 * Generate URL-friendly slug from string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
