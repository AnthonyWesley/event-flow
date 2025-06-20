import partnerApi from "../../api/axios";
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
    const response = await partnerApi.get(`/events/${eventId}`);
    return response.data;
  },

  list: async (search?: string) => {
    const response = await partnerApi.get("/events", {
      params: { search },
    });
    return response.data.events;
  },

  listSellerEvent: async (eventId: string, sellerId: string) => {
    const response = await partnerApi.get(
      `/events/${eventId}/sellers/${sellerId}/sellerEvents`,
    );
    return response.data.events;
  },

  listSellerByEvent: async (eventId: string) => {
    if (eventId) {
      const response = await partnerApi.get(`/events/${eventId}/sellers`);
      return response.data.SellerWithStats;
    }
  },

  create: async (data: EventInputDto) => {
    const response = await partnerApi.post("/events", data);
    return response.data.events;
  },

  update: async (eventId: string, data: EventInputDto) => {
    const response = await partnerApi.patch(`/events/${eventId}`, data);
    return response.data.events;
  },

  delete: async (eventId: string) => {
    const response = await partnerApi.delete(`/events/${eventId}`);
    return response.data.events;
  },
  export: async (eventId: string) => {
    const response = await partnerApi.get(`/events/${eventId}/export`, {
      responseType: "blob", // importantíssimo
    });

    const blob = new Blob([response.data], { type: "application/pdf" });

    return {
      blob,
      fileName: `relatorio-evento-${eventId}.pdf`,
    };
  },

  switchStatus: async (eventId: string) => {
    const response = await partnerApi.patch(`/events/${eventId}/toggle-end`);

    return response.data.isActive;
  },
};
