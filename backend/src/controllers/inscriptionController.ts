import { Request, Response } from "express";
import { inscriptionRepository } from "../repositories/inscriptionRepository";
import { eventRepository } from "../repositories/eventRepository";

export const inscriptionController = {
  async create(req: Request, res: Response) {
    const eventId = String(req.params.id);
    const { name, phone } = req.body;

    const currentCount = await inscriptionRepository.countInscriptions(eventId);
    const event = await eventRepository.findById(eventId);

    console.log(currentCount);

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }
    if (currentCount >= event.capacity) {
      return res.status(400).json({ error: "Evento lotado" });
    }

    try {
      const inscription = await inscriptionRepository.create({
        name,
        phone,
        eventId,
      });

      res.status(201).json(inscription);
    } catch (error: any) {
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
    const { phone } = req.body;
    console.log(eventId, phone);
    if (!phone) {
      return res.status(400).json({
        error: "Telefone é obrigatório",
      });
    }

    try {
      await inscriptionRepository.deleteByEventAndPhone(eventId, phone);
      res.status(204).send();
    } catch (error: any) {
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
