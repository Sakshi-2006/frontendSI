import { api, unwrap } from "./api";

export const publicService = {
  async localitySafety() {
    const { data } = await api.get("/public/locality-safety");
    return unwrap<any[]>(data);
  },
  async localityTrends() {
    const { data } = await api.get("/public/locality-trends");
    return unwrap<any[]>(data);
  },
  async safetyAlerts() {
    const { data } = await api.get("/public/safety-alerts");
    return unwrap<any[]>(data);
  },
  async emergencyContacts() {
    const { data } = await api.get("/public/emergency-contacts");
    return unwrap<any[]>(data);
  },
  async safetyTips() {
    const { data } = await api.get("/public/safety-tips");
    return unwrap<any[]>(data);
  },
  async submitReport(form: FormData | Record<string, unknown>) {
    const isForm = typeof FormData !== "undefined" && form instanceof FormData;
    const { data } = await api.post("/public/reports", form, {
      headers: isForm ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return unwrap<{ reference: string }>(data);
  },
};
