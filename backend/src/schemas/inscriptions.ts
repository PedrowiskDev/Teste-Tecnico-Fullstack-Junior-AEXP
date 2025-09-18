import { z } from "zod";

export const inscriptionSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  phone: z.string().regex(/^\+55\d{10,11}$/, {
    message: "Phone must be in format: +55DDDNUMBER",
  }),
  eventId: z.uuid({ message: "Invalid event ID" }),
});
