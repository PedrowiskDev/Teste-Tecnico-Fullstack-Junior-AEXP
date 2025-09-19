import * as z from "zod";

// Schema para inscrição em eventos
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

// Schema para criação de eventos
export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  capacity: z
    .number()
    .min(1, "Capacidade deve ser maior que 0")
    .max(10000, "Capacidade deve ser menor que 10.000"),
  date: z.date().refine((date) => date > new Date(), {
    message: "Data do evento deve ser futura",
  }),
  location: z
    .string()
    .min(3, "Local deve ter pelo menos 3 caracteres")
    .max(300, "Local deve ter no máximo 300 caracteres"),
});

// Schema para atualização de eventos (campos opcionais)
export const updateEventSchema = createEventSchema.partial();

// Schema para login (caso precise no futuro)
export const loginSchema = z.object({
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
});

// Schema para registro de usuário (caso precise no futuro)
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: z
      .string()
      .email("Email deve ter um formato válido")
      .min(1, "Email é obrigatório"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para busca/filtros
export const searchSchema = z
  .object({
    query: z
      .string()
      .max(200, "Termo de busca deve ter no máximo 200 caracteres")
      .optional(),
    category: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateFrom <= data.dateTo;
      }
      return true;
    },
    {
      message: "Data inicial deve ser anterior à data final",
      path: ["dateTo"],
    }
  );

// Tipos TypeScript derivados dos schemas
export type InscriptionFormData = z.infer<typeof inscriptionSchema>;
export type CreateEventData = z.infer<typeof createEventSchema>;
export type UpdateEventData = z.infer<typeof updateEventSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type SearchData = z.infer<typeof searchSchema>;
