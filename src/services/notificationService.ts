import { api, unwrap } from "./api";

export const notificationService = {
  async list() {
    const { data } = await api.get("/notifications");
    return unwrap<any[]>(data);
  },
  async markRead(id: string) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return unwrap(data);
  },
  async markAllRead() {
    const { data } = await api.patch(`/notifications/read-all`);
    return unwrap(data);
  },
};
