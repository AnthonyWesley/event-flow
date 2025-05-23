import api from "../../api/axios";

export type GuestInputDto = {
  targetId?: string;
  eventId: string;
  sellerId: string;
  actionType: ActionType;
  payload?: Payload;
};

type ActionType = "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE";

type Payload = {
  eventId: string;
  productId: string;
  sellerId: string;
  quantity: number;
};

export type GuestOutputDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: any;
};

export const guestService = {
  create: async (
    actionType: "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE",
    data: Payload,
  ) => {
    const response = await api.post(`/pending-action/`, {
      eventId: data.eventId,
      sellerId: data.sellerId,
      actionType,
      payload: {
        eventId: data.eventId,
        productId: data.productId,
        sellerId: data.sellerId,
        quantity: data.quantity,
      },
    });

    return response.data;
  },

  getGuest: async (eventId: string, sellerId: string) => {
    const response = await api.get(`/events/${eventId}/guest/${sellerId}`);

    return response.data;
  },
  // createOrAttachToEvent: async (eventId: string, data: GuestInputDto) => {
  //   let seller;

  //   try {
  //     const response = await api.get(`/sellers/email/${data.email}`);
  //     seller = response.data;
  //   } catch (error) {
  //     const created = await api.post(`/sellers`, data);

  //     seller = created.data;
  //   } finally {
  //     if (eventId) await api.post(`/events/${eventId}/sellers/${seller.id}`);
  //   }

  //   return seller;
  // },

  update: async (
    actionType: "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE",
    data: Payload,
    targetId: string,
  ) => {
    const response = await api.post(`/pending-action/`, {
      targetId,
      eventId: data.eventId,
      sellerId: data.sellerId,
      actionType,
      payload: {
        eventId: data.eventId,
        productId: data.productId,
        sellerId: data.sellerId,
        quantity: data.quantity,
      },
    });
    return response.data.sellers;
  },

  sendInvitation: async (eventId: string, sellerId: string) => {
    const response = await api.post(`/events/${eventId}/guest/${sellerId}`);
    return response.data.sellers;
  },

  delete: async (
    actionType: "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE",
    data: Payload,
    targetId: string,
  ) => {
    const response = await api.post(`/pending-action/`, {
      targetId,
      eventId: data.eventId,
      sellerId: data.sellerId,
      actionType,
      payload: {},
    });
    return response.data.sellers;
  },
};
