import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export const eventRepository = {
  findAll: () => prisma.event.findMany({}),

  findById: (id: string) =>
    prisma.event.findUnique({
      where: { id },
    }),

  create: (data: {
    title: string;
    description?: string;
    status: Status;
    capacity: number;
  }) =>
    prisma.event.create({
      data,
    }),

  update: (
    id: string,
    data: Partial<{
      title: string;
      description?: string;
      status: Status;
      capacity: number;
    }>
  ) =>
    prisma.event.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.event.delete({
      where: { id },
    }),
};
