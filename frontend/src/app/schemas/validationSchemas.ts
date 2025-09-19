import * as z from "zod";

export const inscriptionSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (DD) XXXXX-XXXX"
    ),
});

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),

  capacity: z
    .string()
    .min(1, "Capacidade é obrigatória")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "Capacidade deve ser um número maior que 0")
    .refine((val) => {
      const num = parseInt(val);
      return num <= 10000;
    }, "Capacidade não pode ser maior que 10.000"),
});

export type EventFormData = z.infer<typeof eventSchema>;
export type InscriptionFormData = z.infer<typeof inscriptionSchema>;
