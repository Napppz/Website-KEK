import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Nama kategori minimal 2 karakter" }).max(50),
  slug: z
    .string()
    .min(2, { message: "Slug minimal 2 karakter" })
    .max(60)
    .regex(/^[a-z0-9-]+$/, { message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)" }),
});

export type CategoryInput = z.infer<typeof categorySchema>;
