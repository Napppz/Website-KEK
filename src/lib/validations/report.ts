import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(5, { message: "Judul laporan minimal 5 karakter" }),
  year: z.coerce.number().int().min(1945).max(2100),
  description: z.string().optional().nullable(),
  fileUrl: z.string().min(1, { message: "URL berkas laporan wajib ada" }),
});

export type ReportInput = z.infer<typeof reportSchema>;
