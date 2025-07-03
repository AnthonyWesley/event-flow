import partnerApi from "../../api/axios";

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
    const response = await partnerApi.post(`/pending-action/`, {
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
    const response = await partnerApi.get(
      `/events/${eventId}/guest/${sellerId}`,
    );

    localStorage.setItem("accessToken", response.data.token.accessToken);

    return response.data;
  },

  update: async (
    actionType: "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE",
    data: Payload,
    targetId: string,
  ) => {
    const response = await partnerApi.post(`/pending-action/`, {
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
    const response = await partnerApi.post(
      `/events/${eventId}/guest/${sellerId}`,
    );
    return response.data.sellers;
  },

  delete: async (
    actionType: "CREATE_SALE" | "UPDATE_SALE" | "DELETE_SALE",
    data: Payload,
    targetId: string,
  ) => {
    const response = await partnerApi.post(`/pending-action/`, {
      targetId,
      eventId: data.eventId,
      sellerId: data.sellerId,
      actionType,
      payload: {},
    });
    return response.data.sellers;
  },
};
