import { Request, Response } from "express";
import { eventRepository } from "../repositories/eventRepository";
import { createEventSchema, updateEventSchema } from "../schemas/event";
import { ZodError } from "zod";

export const eventController = {
  async getAll(req: Request, res: Response) {
    const events = await eventRepository.findAll();
    res.json(events);
  },

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const event = await eventRepository.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  },

  async create(req: Request, res: Response) {
    try {
      const data = createEventSchema.parse(req.body);
      const event = await eventRepository.create(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        return res.status(400).json({ error: messages });
      }
      res.status(400).json({ error: "Invalid data" });
    }
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);

    try {
      const existingEvent = await eventRepository.findById(id);
      if (!existingEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      const data = updateEventSchema.parse(req.body);
      const updatedEvent = await eventRepository.update(id, data);

      return res.json(updatedEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        return res.status(400).json({ error: messages });
      }
      return res.status(500).json({ error: "Failed to update event" });
    }
  },

  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    try {
      await eventRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: "Event not found" });
    }
  },
};
