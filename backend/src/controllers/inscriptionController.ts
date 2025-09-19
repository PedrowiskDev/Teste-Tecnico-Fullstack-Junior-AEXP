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
        return res.status(404).json({
          error: "EVENT_NOT_FOUND",
          message: "Evento não encontrado",
          code: "EVENT_NOT_FOUND",
        });
      }

      const currentCount = await inscriptionRepository.countInscriptions(
        eventId
      );
      if (currentCount >= event.capacity) {
        return res.status(400).json({
          error: "EVENT_FULL",
          message: "Evento lotado. Não há mais vagas disponíveis",
          code: "EVENT_FULL",
        });
      }

      const inscription = await inscriptionRepository.create(validatedData);
      res.status(201).json(inscription);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos fornecidos",
          code: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          error: "DUPLICATE_PHONE",
          message: "Este telefone já está inscrito neste evento",
          code: "DUPLICATE_PHONE",
        });
      }

      if (error.code === "P2003") {
        return res.status(404).json({
          error: "EVENT_NOT_FOUND",
          message: "Evento não encontrado",
          code: "EVENT_NOT_FOUND",
        });
      }

      console.error("Erro interno na criação de inscrição:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
      });
    }
  },

  async getInscriptionCount(req: Request, res: Response) {
    const eventId = String(req.params.id);

    try {
      const currentCount = await inscriptionRepository.countInscriptions(
        eventId
      );
      res.status(200).json({ count: currentCount });
    } catch (error) {
      console.error("Erro ao buscar contagem de inscrições:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Erro ao buscar contagem de inscrições",
        code: "INTERNAL_ERROR",
      });
    }
  },

  async getByEvent(req: Request, res: Response) {
    const eventId = String(req.params.id);

    try {
      const inscriptions = await inscriptionRepository.findByEventId(eventId);
      res.status(200).json(inscriptions);
    } catch (error) {
      console.error("Erro ao buscar inscrições:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Erro ao buscar inscrições",
        code: "INTERNAL_ERROR",
      });
    }
  },

  async removeByEventAndPhone(req: Request, res: Response) {
    const eventId = String(req.params.eventId);

    try {
      const { phone } = inscriptionSchema.pick({ phone: true }).parse(req.body);

      await inscriptionRepository.deleteByEventAndPhone(eventId, phone);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Dados inválidos fornecidos",
          code: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      if (
        error.message === "Inscrição não encontrada para este telefone e evento"
      ) {
        return res.status(404).json({
          error: "INSCRIPTION_NOT_FOUND",
          message: "Inscrição não encontrada para este telefone e evento",
          code: "INSCRIPTION_NOT_FOUND",
        });
      }

      console.error("Erro ao cancelar inscrição:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Erro ao cancelar inscrição",
        code: "INTERNAL_ERROR",
      });
    }
  },
};
