import api from "../utils/api";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  status: "ABERTO" | "ENCERRADO";
  capacity: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  capacity: number;
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    const response = await api.get("/events");
    return response.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  async updateEvent(
    id: string,
    eventData: Partial<CreateEventData>
  ): Promise<Event> {
    const response = await api.patch(`/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
