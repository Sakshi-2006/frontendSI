import { api, unwrap } from "./api";

export const predictionService = {
  async zones() {
    const { data } = await api.get("/predictions/zones");
    return unwrap<any[]>(data);
  },
  async forecast() {
    const { data } = await api.get("/predictions/forecast");
    return unwrap<any[]>(data);
  },
  async explainability(id: string) {
    const { data } = await api.get(`/predictions/${id}/explainability`);
    return unwrap(data);
  },
};
