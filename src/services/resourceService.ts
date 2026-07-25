import { api, unwrap } from "./api";

export const resourceService = {
  async summary() {
    const { data } = await api.get("/resources/summary");
    return unwrap(data);
  },
  async recommendations() {
    const { data } = await api.get("/resources/recommendations");
    return unwrap<any[]>(data);
  },
  async decide(id: string, decision: "approved" | "dismissed") {
    const { data } = await api.patch(`/resources/recommendations/${id}/decision`, { decision });
    return unwrap(data);
  },
};
