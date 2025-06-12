import partnerApi from "../../api/axios";

export type SellerInputDto = {
  name: string;
  email: string;
  phone?: string;
  photo?: any;
};

export type SellerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: any;
};

export const sellerService = {
  create: async (data: SellerInputDto) => {
    const response = await partnerApi.post(`/sellers/`, data);
    return response.data;
  },

  createOrAttachToEvent: async (eventId: string, data: SellerInputDto) => {
    let seller;

    try {
      const response = await partnerApi.get(`/sellers/email/${data.email}`);
      seller = response.data;
    } catch (error) {
      const created = await partnerApi.post(`/sellers`, data);
      seller = created.data;
    }

    try {
      if (eventId) {
        await partnerApi.post(`/events/${eventId}/sellers/${seller.id}`);
      }
    } catch (err) {
      console.warn("Vínculo já existe ou não pôde ser criado", err);
    }

    return seller;
  },

  deleteToEvent: async (sellerId: string, eventId: string) => {
    const response = await partnerApi.delete(
      `/events/${eventId}/sellers/${sellerId}`,
    );

    return response.data;
  },

  list: async (search?: string) => {
    const response = await partnerApi.get("/sellers", {
      params: { search },
    });

    return response.data.sellers;
  },

  findOne: async (sellerId: string) => {
    const response = await partnerApi.get(`/sellers/${sellerId}`);
    return response.data;
  },

  update: async (sellerId: string, data: SellerInputDto) => {
    const response = await partnerApi.put(`/sellers/${sellerId}`, data);
    return response.data.sellers;
  },

  delete: async (sellerId: string) => {
    const response = await partnerApi.delete(`/sellers/${sellerId}`);
    return response.data.sellers;
  },
};
