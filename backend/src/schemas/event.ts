import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().nonempty({ error: "Must have a title" }),
  description: z.string().default(""),
  status: z.enum(["ABERTO", "ENCERRADO"]).default("ABERTO"),
  capacity: z.number().min(0, { error: "Capacity can't be lower than zero" }),
});

export const updateEventSchema = z
  .object({
    title: z.string().nonempty({ message: "Must have a title" }).optional(),
    description: z.string().optional(),
    status: z.enum(["ABERTO", "ENCERRADO"]).optional(),
    capacity: z
      .number()
      .min(0, { message: "Capacity can't be lower than zero" })
      .optional(),
  })
  .partial();
