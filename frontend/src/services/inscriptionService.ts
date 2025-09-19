import axios from "axios";
import api from "../utils/api";

export interface CreateInscription {
  name: string;
  phone: string;
  eventId: string;
}

export interface Inscription extends CreateInscription {
  id: string;
  createdAt: string;
}

export const inscriptionService = {
  async createInscription(
    eventId: string,
    inscriptionData: Omit<CreateInscription, "eventId">
  ): Promise<Inscription> {
    try {
      const response = await api.post(
        `events/${eventId}/inscriptions`,
        inscriptionData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.error) {
          throw new Error(errorData.error);
        }
        if (errorData?.message?.includes("telefone já está inscrito")) {
          throw new Error("DUPLICATE_PHONE");
        }

        switch (error.response?.status) {
          case 409:
            throw new Error("DUPLICATE_PHONE");
          case 404:
            throw new Error("EVENT_NOT_FOUND");
          case 400:
            if (
              errorData?.message?.includes("lotado") ||
              errorData?.message?.includes("vagas")
            ) {
              throw new Error("EVENT_FULL");
            }
            throw new Error("VALIDATION_ERROR");
          case 422:
            throw new Error("VALIDATION_ERROR");
          case 500:
            throw new Error("INTERNAL_ERROR");
          default:
            throw new Error("NETWORK_ERROR");
        }
      }

      throw new Error("NETWORK_ERROR");
    }
  },

  async getInscriptionCount(eventId: string): Promise<{ count: number }> {
    try {
      const response = await api.get(`events/${eventId}/inscriptions/count`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            throw new Error("EVENT_NOT_FOUND");
          default:
            throw new Error("FETCH_ERROR");
        }
      }
      throw new Error("NETWORK_ERROR");
    }
  },

  async getInscriptionsByEvent(eventId: string): Promise<Inscription[]> {
    try {
      const response = await api.get(`events/${eventId}/inscriptions`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            throw new Error("EVENT_NOT_FOUND");
          default:
            throw new Error("FETCH_ERROR");
        }
      }
      throw new Error("NETWORK_ERROR");
    }
  },

  async removeInscription(eventId: string, phone: string): Promise<void> {
    try {
      await api.delete(`events/${eventId}/inscriptions`, {
        data: { phone },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.error) {
          throw new Error(errorData.error);
        }

        switch (error.response?.status) {
          case 404:
            throw new Error("INSCRIPTION_NOT_FOUND");
          case 400:
            throw new Error("VALIDATION_ERROR");
          case 500:
            throw new Error("INTERNAL_ERROR");
          default:
            throw new Error("NETWORK_ERROR");
        }
      }
      throw new Error("NETWORK_ERROR");
    }
  },
};

export const getErrorMessage = (errorCode: string): string => {
  const errorMessages = {
    DUPLICATE_PHONE: "Este telefone já está inscrito neste evento",
    EVENT_NOT_FOUND: "Evento não encontrado",
    EVENT_FULL: "Evento lotado. Não há mais vagas disponíveis",
    VALIDATION_ERROR: "Dados inválidos. Verifique os campos e tente novamente",
    INSCRIPTION_NOT_FOUND: "Inscrição não encontrada",
    FETCH_ERROR: "Erro ao carregar dados. Tente novamente",
    INTERNAL_ERROR: "Erro interno. Tente novamente em alguns minutos",
    NETWORK_ERROR: "Erro de conexão. Verifique sua internet e tente novamente",
  };

  return (
    errorMessages[errorCode as keyof typeof errorMessages] ||
    "Erro desconhecido. Tente novamente"
  );
};
