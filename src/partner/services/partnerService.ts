import api from "../../api/axios";

type ApproveOrRejectType = {
  pendingActionId: string;
  approve: boolean;
};
export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PartnerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
};
export const partnerService = {
  findPartner: async () => {
    const response = await api.get("/auth/me");
    //   const { accessToken } = response.data;
    //   sessionStorage.setItem("accessToken", accessToken);
    return response.data;
  },

  getNotification: async () => {
    const response = await api.get(`/pending-action/`);
    return response.data.listPendingActions;
  },

  approve: async (approveOrReject: ApproveOrRejectType) => {
    const response = await api.post(
      `/pending-action/approve-reject`,
      approveOrReject,
    );
    return response.data;
  },

  update: async (partnerId: string, data: any) => {
    const response = await api.put(`/partner/${partnerId}`, data);
    return response.data;
  },
};
