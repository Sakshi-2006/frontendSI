import { api, unwrap } from "./api";

export const userService = {
  async list() {
    const { data } = await api.get("/users");
    return unwrap<any[]>(data);
  },
  async get(id: string) {
    const { data } = await api.get(`/users/${id}`);
    return unwrap(data);
  },
  async invite(payload: { name: string; email: string; role: string; district?: string }) {
    const { data } = await api.post("/users", payload);
    return unwrap(data);
  },
  async update(id: string, patch: Record<string, unknown>) {
    const { data } = await api.patch(`/users/${id}`, patch);
    return unwrap(data);
  },
  async remove(id: string) {
    const { data } = await api.delete(`/users/${id}`);
    return unwrap(data);
  },
};
