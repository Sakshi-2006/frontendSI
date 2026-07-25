import { api, unwrap } from "./api";

export const alertService = {
  async list() {
    const { data } = await api.get("/alerts");
    return unwrap<any[]>(data);
  },
  async get(id: string) {
    const { data } = await api.get(`/alerts/${id}`);
    return unwrap(data);
  },
  async create(payload: { title: string; district: string; severity: "low" | "medium" | "high" | "critical" }) {
    const { data } = await api.post("/alerts", payload);
    return unwrap(data);
  },
  async updateStatus(id: string, status: "active" | "investigating" | "monitoring" | "resolved") {
    const { data } = await api.patch(`/alerts/${id}/status`, { status });
    return unwrap(data);
  },
  async dispatch(id: string) {
    const { data } = await api.post(`/alerts/${id}/dispatch`);
    return unwrap(data);
  },
};
