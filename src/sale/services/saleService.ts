import partnerApi from "../../api/axios";

export type SaleInputDto = {
  id?: string;
  productId: string;
  sellerId: string;
  eventId: string;
  quantity: number;
};
export type SaleOutputDto = {
  sellerId: string;
  id: string;
  quantity: number;
  eventId: string;
};

export const saleService = {
  create: async (eventId: string, data: SaleInputDto) => {
    const response = await partnerApi.post(`/events/${eventId}/sales`, data);
    return response.data;
  },

  list: async (eventId: string) => {
    const response = await partnerApi.get(`/events/${eventId}/sellers`);
    console.log(response);
    return response.data;
  },

  findOne: async (eventId: string, saleId: string) => {
    const response = await partnerApi.get(`/events/${eventId}/sales/${saleId}`);
    return response.data;
  },

  delete: async (eventId: string, saleId: string) => {
    const response = await partnerApi.delete(
      `/events/${eventId}/sales/${saleId}`,
    );
    console.log(eventId, saleId);

    return response.data;
  },
  update: async (eventId: string, data: SaleInputDto, saleId: string) => {
    const response = await partnerApi.put(
      `/events/${eventId}/sales/${saleId}`,
      data,
    );
    console.log(eventId, saleId);

    return response.data;
  },
};
