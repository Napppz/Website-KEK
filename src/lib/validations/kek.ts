import { z } from "zod";

export const kekSchema = z.object({
  name: z.string().min(3, { message: "Nama KEK minimal 3 karakter" }),
  slug: z.string().min(3, { message: "Slug minimal 3 karakter" }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  province: z.string().min(2, { message: "Provinsi wajib diisi" }),
  city: z.string().min(2, { message: "Kota/Kabupaten wajib diisi" }),
  address: z.string().min(5, { message: "Alamat lengkap wajib diisi" }),
  area: z.coerce.number().positive({ message: "Luas kawasan harus bernilai positif" }),
  focus: z.string().min(3, { message: "Sektor fokus wajib diisi" }),
  status: z.enum(["BEROPERASI", "TAHAP_PEMBANGUNAN"]).default("BEROPERASI"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  imageUrl: z.string().url({ message: "URL gambar tidak valid" }).optional().or(z.literal("")),
});

export type KekInput = z.infer<typeof kekSchema>;
