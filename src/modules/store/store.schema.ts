import { z } from "zod";

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres"),

  email: z
    .string()
    .email("Email inválido"),

  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),

  whatsappNumber: z
    .string()
    .min(10, "WhatsApp inválido"),
});

export type CreateStoreDTO = z.infer<typeof createStoreSchema>;