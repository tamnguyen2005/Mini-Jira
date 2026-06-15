import axios from "axios";
import { useAuthStore } from "../stores/auth.store";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest.retry &&
      error.message !== "canceled"
    ) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error?.response?.data || error.message);
  },
);
