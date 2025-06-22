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

admApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const shouldBypassInterceptor = ["/admin/login", "/admin/register"].some(
      (path) => error.config?.url?.includes(path),
    );

    if (shouldBypassInterceptor) {
      return Promise.reject(error);
    }

    if (
      [401, 403, 404, 500].includes(error.response.status) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("admAccessToken");

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return admApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await admApi.post("/admin/refresh");
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("admAccessToken", newAccessToken);
        admApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return admApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await admApi.post("/admin/logout");
        localStorage.removeItem("admAccessToken");

        window.location.href = "/adm";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default admApi;
