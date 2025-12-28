import { z } from "zod";

export const simulationSchema = z.object({
  productId: z.string().min(1),
  price: z.number().positive(),
  dpAmount: z.number().min(0),
  tenor: z.number().min(6).max(60)
});

export const applicationSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  productId: z.string().min(1),
  dpAmount: z.number().min(0),
  tenor: z.number().min(6).max(60),
  price: z.number().positive(),
  uploadUrl: z.string().url().optional()
});
