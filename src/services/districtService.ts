import { api, unwrap } from "./api";

export const districtService = {
  async list() {
    const { data } = await api.get("/districts");
    return unwrap<any[]>(data);
  },
  async get(id: string) {
    const { data } = await api.get(`/districts/${id}`);
    return unwrap(data);
  },
};
