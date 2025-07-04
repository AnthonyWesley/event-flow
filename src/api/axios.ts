import axios from "axios";

const partnerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

partnerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
partnerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isGuest = window.location.pathname.includes("/guest/");

    const shouldBypassInterceptor = ["/auth/login", "/auth/register"].some(
      (path) => error.config?.url?.includes(path),
    );

    if (shouldBypassInterceptor) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && isGuest) {
      localStorage.removeItem("accessToken");
      window.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    if ([401, 500].includes(error.response.status) && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("accessToken");

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return partnerApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await partnerApi.post("/auth/refresh");
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        partnerApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return partnerApi(originalRequest);
      } catch (err) {
        await partnerApi.post("/auth/logout").catch(() => {});
        localStorage.removeItem("accessToken");

        processQueue(err, null);

        window.location.replace("/auth");

        return new Promise(() => {});
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default partnerApi;
