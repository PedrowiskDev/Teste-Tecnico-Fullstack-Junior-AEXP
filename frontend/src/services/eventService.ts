import api from "../utils/api";

export interface Event {
  id: string;
  title: string;
  description: string;
  capacity: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
}

export const eventService = {
  // Buscar todos os eventos
  async getAllEvents(): Promise<Event[]> {
    const response = await api.get("/events");
    return response.data;
  },

  // Buscar evento por ID
  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Criar novo evento
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  // Atualizar evento
  async updateEvent(
    id: string,
    eventData: Partial<CreateEventData>
  ): Promise<Event> {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Deletar evento
  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
