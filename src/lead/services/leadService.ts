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

    return response.data;
  },

  listByEvent: async (eventId: string) => {
    const response = await partnerApi.get(`events/${eventId}/leads/`);
    return response.data;
  },

  export: async (eventId?: string) => {
    const url = eventId ? `/export/leads/${eventId}` : `/export/leads`;

    const response = await partnerApi.get(url, {
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const fileName =
      contentDisposition?.match(/filename="(.+)"/)?.[1] || "leads.csv";

    return {
      blob: response.data,
      fileName,
    };
  },

  findOne: async (eventId: string, leadId: string) => {
    const response = await partnerApi.get(`events/${eventId}/leads/${leadId}`);

    return response.data;
  },

  update: async (eventId: string, leadId: string, data: LeadInputDto) => {
    const response = await partnerApi.patch(
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
