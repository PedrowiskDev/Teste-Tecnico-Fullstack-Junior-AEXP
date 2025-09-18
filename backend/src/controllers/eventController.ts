import { Request, Response } from "express";
import { eventRepository } from "../repositories/eventRepository";

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
    const { title, description, status, capacity } = req.body;
    try {
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Must have a title" });
      }
      if (typeof capacity !== "number" || capacity < 0) {
        return res
          .status(400)
          .json({ error: "Capacity can't be lower than zero" });
      }

      const event = await eventRepository.create({
        title,
        description,
        status,
        capacity,
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Event already exists" });
    }
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const { title, description, status, capacity } = req.body;
    try {
      const event = await eventRepository.update(id, {
        title,
        description,
        status,
        capacity,
      });
      res.json(event);
    } catch (error) {
      res.status(404).json({ error: "Event not found" });
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
