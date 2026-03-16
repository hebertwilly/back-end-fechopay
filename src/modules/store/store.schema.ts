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

export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .optional(),

  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),

  whatsappNumber: z
    .string()
    .min(10, "WhatsApp inválido")
    .optional(),
})
.refine(
    (data) => Object.keys(data).length > 0,
    "Informe ao menos um campo para atualização"
);

export type CreateStoreDTO = z.infer<typeof createStoreSchema>;
export type UpdateStoreDTO = z.infer<typeof updateStoreSchema>;