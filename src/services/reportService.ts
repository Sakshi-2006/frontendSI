import { api, unwrap } from "./api";

export const reportService = {
  async list() {
    const { data } = await api.get("/reports");
    return unwrap<any[]>(data);
  },
  async get(id: string) {
    const { data } = await api.get(`/reports/${id}`);
    return unwrap(data);
  },
  async generate(payload: { title: string; type: "Monthly" | "District" | "Trend" | "AI" }) {
    const { data } = await api.post("/reports", payload);
    return unwrap(data);
  },
  downloadUrl(id: string) {
    const base = (import.meta as any).env?.VITE_API_URL || "";
    return `${base}/reports/${id}/download`;
  },
};
