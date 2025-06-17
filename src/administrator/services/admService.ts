import admApi from "./admAxios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const admService = {
  login: async (data: LoginPayload) => {
    const response = await admApi.post("/admin/login", data);
    const { accessToken } = response.data.output.token;

    // sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("admAccessToken", accessToken);
    return response.data;
  },

  list: async () => {
    const response = await admApi.get(`/partners`);
    return response.data.partners;
  },

  impersonate: async (partnerId: string) => {
    const response = await admApi.get(`/impersonate/${partnerId}`);
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data.accessToken;
  },

  active: async (partnerId: string) => {
    console.log(partnerId);

    const response = await admApi.put(`/partners/${partnerId}/activate`);

    return response.data;
  },

  suspend: async (partnerId: string) => {
    const response = await admApi.put(`/partners/${partnerId}/suspend`);

    return response.data;
  },

  // register: async (data: RegisterPayload) => {
  //   try {
  //     const response = await partnerApi.post("/admin/register", {
  //       email: data.email,
  //       password: data.password,
  //     });

  //     const token = response.data?.output?.token?.accessToken;

  //     if (token) {
  //       // sessionStorage.setItem("accessToken", token);
  //       localStorage.setItem("accessToken", token);
  //     }

  //     return response.data;
  //   } catch (error) {
  //     console.error("Erro no register:", error);
  //     throw error;
  //   }
  // },
};
