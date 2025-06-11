import partnerApi from "../../api/axios";
import { ProductOutputDto } from "../../product/services/productService";

export type LeadInputDto = {
  name: string;
  email?: string;
  phone?: string;
  products?: { id: string }[];
  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
};

export type LeadOutputDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  products: ProductOutputDto[];
  customInterest?: string;
  notes?: string;
  source: string;
  eventId: string;
  createdAt: Date;
};

export const leadService = {
  create: async (eventId: string, data: LeadInputDto) => {
    const response = await partnerApi.post(`events/${eventId}/leads/`, data);
    return response.data;
  },

  listAll: async () => {
    const response = await partnerApi.get(`/leads/`);
    console.log(response.data);

    return response.data;
  },

  listByEvent: async (eventId: string) => {
    const response = await partnerApi.get(`events/${eventId}/leads/${eventId}`);
    return response.data;
  },

  findOne: async (eventId: string) => {
    const response = await partnerApi.get(`events/${eventId}/leads/${eventId}`);
    return response.data;
  },

  update: async (eventId: string, leadId: string, data: LeadInputDto) => {
    const response = await partnerApi.put(
      `events/${eventId}/leads/${leadId}`,
      data,
    );
    return response.data.sellers;
  },

  delete: async (eventId: string, leadId: string) => {
    const response = await partnerApi.delete(
      `events/${eventId}/leads/${leadId}`,
    );
    return response.data.sellers;
  },
};
