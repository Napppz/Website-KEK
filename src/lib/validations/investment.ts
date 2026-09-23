import { z } from "zod";

export const investmentSchema = z.object({
  kekId: z.string().min(1, { message: "Kawasan KEK wajib dipilih" }),
  year: z.coerce.number().int().min(2000).max(2100),
  investmentValue: z.coerce.number().positive({ message: "Nilai investasi harus lebih dari 0" }),
  employeeCount: z.coerce.number().int().nonnegative({ message: "Jumlah tenaga kerja minimal 0" }),
  description: z.string().optional().nullable(),
});

export type InvestmentInput = z.infer<typeof investmentSchema>;
