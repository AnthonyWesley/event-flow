import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

let hasLoggedOut = false;

export async function logout() {
  if (hasLoggedOut) return;
  hasLoggedOut = true;

  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.warn("Erro ao tentar logout no backend", error);
  }

  sessionStorage.removeItem("accessToken");

  if (window.location.pathname !== "/auth") {
    window.alert("Sessão expirada. Faça login novamente.");
    window.location.href = "/auth";
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token ?? undefined);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      [401, 403].includes(error.response?.status) &&
      !originalRequest._retry
    ) {
      logout();
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh");
        const newAccessToken = response.data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if ([401, 403].includes(error.response?.status) && originalRequest._retry) {
      await logout();
    }

    return Promise.reject(error);
  },
);

export default api;
