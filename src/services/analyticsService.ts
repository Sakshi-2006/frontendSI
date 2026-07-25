import { api, unwrap } from "./api";

// Analytics routes serve the raw KSP datathon datasets ({ success, message, count, data }).
export const analyticsService = {
  async dashboard() {
    const { data } = await api.get("/analytics/dashboard");
    return unwrap(data);
  },
  async districts(params?: { district?: string; sort?: string }) {
    const { data } = await api.get("/analytics/districts", { params });
    return unwrap<any[]>(data);
  },
  async districtDetail(district: string) {
    const { data } = await api.get(`/analytics/districts/${encodeURIComponent(district)}`);
    return unwrap(data);
  },
  async stations(params?: { station?: string; sort?: string; page?: number; limit?: number }) {
    const { data } = await api.get("/analytics/stations", { params });
    return unwrap<any[]>(data);
  },
  async monthly(params?: { month?: number }) {
    const { data } = await api.get("/analytics/monthly", { params });
    return unwrap<any[]>(data);
  },
  async crimeGroups(params?: { type?: string; sort?: string }) {
    const { data } = await api.get("/analytics/crime-groups", { params });
    return unwrap<any[]>(data);
  },
  async hotspots(params?: { level?: string }) {
    const { data } = await api.get("/analytics/hotspots", { params });
    return unwrap<any[]>(data);
  },
  async heatmap() {
    const { data } = await api.get("/analytics/heatmap");
    return unwrap<any[]>(data);
  },
  async risk(params?: { level?: string; sort?: string }) {
    const { data } = await api.get("/analytics/risk", { params });
    return unwrap<any[]>(data);
  },
  async predictions() {
    const { data } = await api.get("/analytics/predictions");
    return unwrap(data);
  },
  async predictionSample(params?: { page?: number; limit?: number }) {
    const { data } = await api.get("/analytics/predictions/sample", { params });
    return unwrap<any[]>(data);
  },
  async search(q: string) {
    const { data } = await api.get("/analytics/search", { params: { q } });
    return unwrap(data);
  },
};
