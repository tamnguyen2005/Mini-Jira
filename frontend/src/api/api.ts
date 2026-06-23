import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  retry?: boolean;
};

type ApiErrorPayload = {
  message?: unknown;
  [key: string]: unknown;
};

const getRejectReason = (error: unknown): unknown => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error;
};

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
  (error: unknown) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorPayload>(error)) {
      return Promise.reject(getRejectReason(error));
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status === 401 &&
      !originalRequest?.retry &&
      error.message !== "canceled"
    ) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(getRejectReason(error));
  },
);
