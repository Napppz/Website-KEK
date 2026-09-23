import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(5, { message: "Judul dokumen minimal 5 karakter" }),
  documentNumber: z.string().min(2, { message: "Nomor dokumen wajib diisi" }),
  year: z.coerce.number().int().min(1945).max(2100),
  category: z.string().min(2, { message: "Kategori dokumen wajib diisi" }),
  description: z.string().optional().nullable(),
  fileUrl: z.string().min(1, { message: "URL berkas dokumen wajib ada" }),
  kekId: z.string().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
});

export type DocumentInput = z.infer<typeof documentSchema>;
