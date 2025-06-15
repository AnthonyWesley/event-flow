import axios from "axios";

const admApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

admApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admAccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

admApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if ([401, 404, 403, 500].includes(error.response.status)) {
      localStorage.removeItem("admAccessToken");
      window.location.href = "/adm";
    }

    return Promise.reject(error);
  },
);

export default admApi;
