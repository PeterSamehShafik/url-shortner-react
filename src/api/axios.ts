import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let sessionDead = false;
let queue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

const redirectToAuth = () => {
  sessionDead = true;
  isRefreshing = false;
  processQueue(new Error("Session expired"));
  useAuthStore.getState().clear();
  // window.location.href = "/auth";
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Session is dead — don't even try
    if (sessionDead) return Promise.reject(error);

    // Too many requests
    if (error.response?.status === 429) {
      // Example using Sonner
      toast.error("Too many requests. Please wait a moment and try again.");

      return Promise.reject(error);
    }

    // Not a 401 — pass through as normal error
    if (error.response?.status !== 401) return Promise.reject(error);

    // This was the refresh call itself failing — session is dead
    if (original.url === "/auth/refresh") {
      redirectToAuth();
      return Promise.reject(error);
    }

    // Already retried this request — session is dead
    if (original._retry) {
      redirectToAuth();
      return Promise.reject(error);
    }

    // Another refresh is in progress — queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then(() => api(original))
        .catch(() => Promise.reject(error));
    }

    // Start refreshing
    original._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      isRefreshing = false;
      processQueue(null);
      return api(original);
    } catch (err) {
      redirectToAuth();
      return Promise.reject(err);
    }
  },
);

export default api;
