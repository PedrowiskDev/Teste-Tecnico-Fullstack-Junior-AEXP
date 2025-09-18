import { Request, Response } from "express";
import { inscriptionRepository } from "../repositories/inscriptionRepository";
import { eventRepository } from "../repositories/eventRepository";
import { inscriptionSchema } from "../schemas/inscriptions";
import { ZodError } from "zod";

export const inscriptionController = {
  async create(req: Request, res: Response) {
    const eventId = String(req.params.id);

    try {
      const validatedData = inscriptionSchema.parse({
        ...req.body,
        eventId,
      });

      const event = await eventRepository.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      const currentCount = await inscriptionRepository.countInscriptions(
        eventId
      );
      if (currentCount >= event.capacity) {
        return res.status(400).json({ error: "Evento lotado" });
      }

      const inscription = await inscriptionRepository.create(validatedData);
      res.status(201).json(inscription);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: error.issues.map((issue) => issue.message),
        });
      }

      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Telefone já inscrito neste evento",
        });
      }

      if (error.code === "P2003") {
        return res.status(404).json({
          error: "Evento não encontrado",
        });
      }

      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  },

  async getByEvent(req: Request, res: Response) {
    const eventId = String(req.params.id);

    try {
      const inscriptions = await inscriptionRepository.findByEventId(eventId);
      res.json(inscriptions);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar inscrições",
      });
    }
  },

  async removeByEventAndPhone(req: Request, res: Response) {
    const eventId = String(req.params.eventId);

    try {
      // Validate phone format
      const { phone } = inscriptionSchema.pick({ phone: true }).parse(req.body);

      await inscriptionRepository.deleteByEventAndPhone(eventId, phone);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: error.issues.map((issue) => issue.message),
        });
      }

      if (
        error.message === "Inscrição não encontrada para este telefone e evento"
      ) {
        return res.status(404).json({
          error: "Inscrição não encontrada para este telefone e evento",
        });
      }

      res.status(500).json({
        error: "Erro ao cancelar inscrição",
      });
    }
  },
};
