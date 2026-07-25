import { api, unwrap } from "./api";

export const assistantService = {
  async query(text: string) {
    const { data } = await api.post("/assistant/query", { text });
    return unwrap<{ answer: string; charts?: any[]; sources?: any[] }>(data);
  },
};
