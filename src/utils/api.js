import axios from "axios";
import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // needed for BetterAuth session cookies (used by /api/auth/token)
});

api.interceptors.request.use(async (config) => {
  try {
    const { data, error } = await authClient.token();
    if (data?.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
  } catch {
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/register")) {
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
