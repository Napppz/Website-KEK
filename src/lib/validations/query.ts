import { z } from "zod";

export const kekQuerySchema = z.object({
  q: z.string().optional().default(""),
  province: z.string().optional().default("ALL"),
  focus: z.string().optional().default("ALL"),
  status: z.enum(["ALL", "BEROPERASI", "TAHAP_PEMBANGUNAN"]).catch("ALL").default("ALL"),
  sort: z.enum(["name-asc", "name-desc", "latest", "oldest"]).catch("name-asc").default("name-asc"),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(9).default(9),
});

export type KekQueryParams = z.infer<typeof kekQuerySchema>;

export const newsQuerySchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default("ALL"),
  year: z.coerce.number().int().optional(),
  sort: z.enum(["latest", "oldest"]).catch("latest").default("latest"),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(6).default(6),
});

export type NewsQueryParams = z.infer<typeof newsQuerySchema>;

export const documentQuerySchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default("ALL"),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(10).default(10),
});

export type DocumentQueryParams = z.infer<typeof documentQuerySchema>;

export const reportQuerySchema = z.object({
  q: z.string().optional().default(""),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(10).default(10),
});

export type ReportQueryParams = z.infer<typeof reportQuerySchema>;

export const galleryQuerySchema = z.object({
  category: z.string().optional().default("ALL"),
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(12).default(12),
});

export type GalleryQueryParams = z.infer<typeof galleryQuerySchema>;

export const globalSearchQuerySchema = z.object({
  q: z.string().optional().default(""),
  tab: z.enum(["ALL", "KEK", "NEWS", "DOCUMENT", "REPORT"]).catch("ALL").default("ALL"),
});

export type GlobalSearchQueryParams = z.infer<typeof globalSearchQuerySchema>;
