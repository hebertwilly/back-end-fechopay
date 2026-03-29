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

  whatsappNumber: z
    .string()
    .min(10, "WhatsApp inválido")
    .optional(),
})
.refine(
    (data) => Object.keys(data).length > 0,
    "Informe ao menos um campo para atualização"
);

export const updatePasswordSchema = z.object({

  currentPassword: z.string().min(6, "Senha atual deve ter no minimo 6 caracteres"),
  newPassword: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),

}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha não pode ser igual à senha atual",
    path: ["newPassword"],
});

export type CreateStoreDTO = z.infer<typeof createStoreSchema>;
export type UpdateStoreDTO = z.infer<typeof updateStoreSchema>;
export type UpdatePasswordDTO = z.infer<typeof updatePasswordSchema>;