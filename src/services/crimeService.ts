import { api, unwrap } from "./api";

// The backend does not expose a first-class /crimes CRUD list yet; crimes are aggregated
// via /analytics/* and /dashboard/*. This service wraps map/heatmap and future crime endpoints.
export const crimeService = {
  async heatmap() {
    const { data } = await api.get("/map/points");
    return unwrap<Array<[number, number, number] | { lat: number; lng: number; weight?: number }>>(data);
  },
};
