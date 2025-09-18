import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const inscriptionRepository = {
  async create(data: { name: string; phone: string; eventId: string }) {
    return await prisma.inscription.create({
      data,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            capacity: true,
          },
        },
      },
    });
  },

  async countInscriptions(eventId: string) {
    return await prisma.inscription.count({
      where: {
        eventId,
      },
    });
  },

  async findByEventId(eventId: string) {
    return await prisma.inscription.findMany({
      where: { eventId },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async delete(id: string) {
    return await prisma.inscription.delete({
      where: { id },
    });
  },

  async findById(id: string) {
    return await prisma.inscription.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });
  },

  async countByEventId(eventId: string) {
    return await prisma.inscription.count({
      where: { eventId },
    });
  },
};
