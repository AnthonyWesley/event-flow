import partnerApi from "../../api/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  phone: string;
  confirmPassword: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await partnerApi.post("/auth/login", data);
    const { accessToken } = response.data.output.token;

    // sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessToken", accessToken);
    return response.data;
  },
  register: async (data: RegisterPayload) => {
    try {
      const response = await partnerApi.post("/auth/register", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        plan: "FREE",
      });

      const token = response.data?.output?.token?.accessToken;

      if (token) {
        // sessionStorage.setItem("accessToken", token);
        localStorage.setItem("accessToken", token);
      }

      return response.data;
    } catch (error) {
      console.error("Erro no register:", error);
      throw error;
    }
  },
};
