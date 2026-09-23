import { z } from "zod";

export const gallerySchema = z.object({
  title: z.string().min(3, { message: "Judul foto minimal 3 karakter" }),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url({ message: "URL gambar harus valid" }),
  category: z.string().min(2, { message: "Kategori galeri wajib diisi" }),
  kekId: z.string().optional().nullable(),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
