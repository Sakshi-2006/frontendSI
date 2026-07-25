import { api, unwrap } from "./api";

export const networkService = {
  async nodes() {
    const { data } = await api.get("/network/nodes");
    return unwrap<any[]>(data);
  },
  async edges() {
    const { data } = await api.get("/network/edges");
    return unwrap<any[]>(data);
  },
  async entity(id: string) {
    const { data } = await api.get(`/network/entities/${id}`);
    return unwrap(data);
  },
};
