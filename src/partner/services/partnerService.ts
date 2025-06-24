import partnerApi from "../../api/axios";

type ApproveOrRejectType = {
  pendingActionId: string;
  approve: boolean;
};
export type PlanType = "FREE" | "BASIC" | "PREMIUM";
export type PartnerStatus = "ACTIVE" | "SUSPENDED";
export type PartnerOutputDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  plan: PlanType;
  status: PartnerStatus;
  maxConcurrentEvents: number;
  createdAt: Date;
  accessExpiresAt: Date;
};
export const partnerService = {
  findPartner: async () => {
    const response = await partnerApi.get("/auth/me");
    //   const { accessToken } = response.data;
    //   sessionStorage.setItem("accessToken", accessToken);
    return response.data;
  },

  getNotification: async () => {
    const response = await partnerApi.get(`/pending-action/`);
    return response.data.listPendingActions;
  },

  approve: async (approveOrReject: ApproveOrRejectType) => {
    const response = await partnerApi.post(
      `/pending-action/approve-reject`,
      approveOrReject,
    );
    return response.data;
  },

  update: async (partnerId: string, data: any) => {
    const response = await partnerApi.patch(`/partner/${partnerId}`, data);
    return response.data;
  },
};
