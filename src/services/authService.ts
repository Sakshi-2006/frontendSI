import { api, tokenStore, unwrap } from "./api";

export type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  district?: string;
  status?: string;
  badgeNumber?: string;
  preferences?: Record<string, unknown>;
};

type AuthResult = { user: AuthUser; accessToken: string; refreshToken: string };

function persist(result: AuthResult) {
  tokenStore.setTokens(result.accessToken, result.refreshToken);
  if (typeof window !== "undefined") {
    localStorage.setItem(tokenStore.USER_KEY, JSON.stringify(result.user));
  }
  return result.user;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/login", { email, password });
    return persist(unwrap<AuthResult>(data));
  },
  async me(): Promise<AuthUser | null> {
    try {
      const { data } = await api.get("/auth/me");
      const user = unwrap<AuthUser>(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(tokenStore.USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  },
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    tokenStore.clear();
  },
  async requestOtp(email: string) {
    const { data } = await api.post("/auth/otp/request", { email });
    return unwrap(data);
  },
  async verifyOtp(email: string, code: string): Promise<AuthUser> {
    const { data } = await api.post("/auth/otp/verify", { email, code });
    return persist(unwrap<AuthResult>(data));
  },
  async forgotPassword(email: string) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return unwrap(data);
  },
  async resetPassword(token: string, newPassword: string) {
    const { data } = await api.post("/auth/reset-password", { token, newPassword });
    return unwrap(data);
  },
  getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(tokenStore.USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },
};
