import { api, unwrap } from "./api";

export const dashboardService = {
  async getKpis() {
    const { data } = await api.get("/dashboard/kpis");
    return unwrap<Record<string, number>>(data);
  },
  async getCrimeTrend(months = 12) {
    const { data } = await api.get("/dashboard/crime-trend", { params: { months } });
    return unwrap<Array<{ month: string; crimes: number; solved: number }>>(data);
  },
  async getCrimeByType() {
    const { data } = await api.get("/dashboard/crime-by-type");
    return unwrap<Array<{ type: string; value: number }>>(data);
  },
  async getRecentActivity(limit = 6) {
    const { data } = await api.get("/dashboard/recent-activity", { params: { limit } });
    return unwrap<
      Array<{ id: string | number; time: string; type: string; title: string; district: string; severity: "low" | "medium" | "high" }>
    >(data);
  },
};
