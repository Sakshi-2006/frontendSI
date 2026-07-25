import { api, unwrap } from "./api";

export const settingsService = {
  async profile() {
    const { data } = await api.get("/settings/profile");
    return unwrap(data);
  },
  async updateProfile(patch: Record<string, unknown>) {
    const { data } = await api.patch("/settings/profile", patch);
    return unwrap(data);
  },
  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch("/settings/security", { currentPassword, newPassword });
    return unwrap(data);
  },
  async updatePreferences(prefs: Record<string, unknown>) {
    const { data } = await api.patch("/settings/preferences", prefs);
    return unwrap(data);
  },
};
