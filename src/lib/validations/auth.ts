import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Kata sandi minimal 6 karakter" }),
});

export const userCreateSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
