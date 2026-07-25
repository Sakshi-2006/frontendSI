import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:5000/api/v1";

const ACCESS_KEY = "sentineliq_access_token";
const REFRESH_KEY = "sentineliq_refresh_token";
const USER_KEY = "sentineliq_auth";

export const tokenStore = {
  getAccess: () =>
    typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY),
  getRefresh: () =>
    typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY),
  setTokens: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  USER_KEY,
};

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
    const payload = data?.data ?? data;
    if (payload?.accessToken && payload?.refreshToken) {
      tokenStore.setTokens(payload.accessToken, payload.refreshToken);
      return payload.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !String(original.url ?? "").includes("/auth/")
    ) {
      original._retry = true;
      refreshing = refreshing ?? tryRefresh();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${newToken}` };
        return api(original);
      }
      tokenStore.clear();
    }
    return Promise.reject(error);
  }
);

/** Unwrap `{ success, data, ... }` envelope used across the SentinelIQ backend. */
export function unwrap<T>(payload: any): T {
  if (payload && typeof payload === "object" && "data" in payload) return payload.data as T;
  return payload as T;
}

/** Fetches from the API; returns fallback if the call fails so the UI stays populated. */
export async function fetchOr<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("[SentinelIQ] API call failed, using fallback:", (e as Error)?.message);
    }
    return fallback;
  }
}
