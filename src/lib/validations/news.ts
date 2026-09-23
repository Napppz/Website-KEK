import { z } from "zod";

export const newsCategorySchema = z.object({
  name: z.string().min(2, { message: "Nama kategori minimal 2 karakter" }),
  slug: z.string().min(2, { message: "Slug minimal 2 karakter" }),
});

export const newsSchema = z.object({
  title: z.string().min(5, { message: "Judul berita minimal 5 karakter" }),
  slug: z.string().min(5, { message: "Slug berita minimal 5 karakter" }),
  excerpt: z.string().min(10, { message: "Ringkasan berita minimal 10 karakter" }),
  content: z.string().min(20, { message: "Konten berita minimal 20 karakter" }),
  thumbnailUrl: z.string().url({ message: "URL thumbnail tidak valid" }).optional().or(z.literal("")),
  categoryId: z.string().min(1, { message: "Kategori berita wajib dipilih" }),
  kekId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});

export type NewsCategoryInput = z.infer<typeof newsCategorySchema>;
export type NewsInput = z.infer<typeof newsSchema>;
