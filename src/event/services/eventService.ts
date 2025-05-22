import api from "../../api/axios";
import { SellersType } from "../../ranking/components/RankingDisplay";

export type GoalType = "QUANTITY" | "VALUE";

export type EventOutputDto = {
  id: string;
  name: string;
  partnerId: string;
  goal: number;
  isActive: boolean;
  goalType: GoalType;
  createdAt: string;
  startDate: string;
  endDate?: string;
  sales: any[];
  allSellers: SellersType[];
};

export type EventInputDto = {
  id: string;
  name?: string;
  goal?: number;
  goalType?: "QUANTITY" | "VALUE";
};

export const eventService = {
  findOne: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  list: async () => {
    const response = await api.get("/events");
    return response.data.events;
  },

  listSellerEvent: async (eventId: string, sellerId: string) => {
    const response = await api.get(
      `/events/${eventId}/sellers/${sellerId}/sellerEvents`,
    );

    return response.data.events;
  },

  create: async (data: EventInputDto) => {
    const response = await api.post("/events", data);
    return response.data.events;
  },

  update: async (eventId: string, data: EventInputDto) => {
    const response = await api.put(`/events/${eventId}`, data);
    return response.data.events;
  },

  delete: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data.events;
  },

  switchStatus: async (eventId: string) => {
    const response = await api.patch(`/events/${eventId}/toggle-end`);
    return response.data.events;
  },
};
