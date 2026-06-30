import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => api(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      processQueue(null);
      return api(original);
    } catch (err) {
      processQueue(err);
      useAuthStore.getState().clear();
      window.location.href = "/auth";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
