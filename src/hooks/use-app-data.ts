import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  alertService,
  analyticsService,
  crimeService,
  districtService,
  networkService,
  notificationService,
  predictionService,
  publicService,
  reportService,
  resourceService,
  userService,
} from "@/services";
import {
  alerts as MOCK_ALERTS,
  users as MOCK_USERS,
  notifications as MOCK_NOTIFICATIONS,
  reportsList as MOCK_REPORTS,
  predictions as MOCK_PREDICTIONS,
  explainability as MOCK_EXPLAIN,
  forecast as MOCK_FORECAST,
  districts as MOCK_DISTRICTS,
  resources as MOCK_RESOURCES,
  recommendations as MOCK_RECS,
  networkNodes as MOCK_NODES,
  networkEdges as MOCK_EDGES,
  heatmapPoints as MOCK_HEATMAP,
  publicLocalitySafety as MOCK_PSAFETY,
  publicLocalityTrends as MOCK_PTRENDS,
  publicSafetyAlerts as MOCK_PALERTS,
  emergencyContacts as MOCK_EMERGENCY,
  safetyTips as MOCK_SAFETY_TIPS,
} from "@/lib/mock-data";

// Generic helper: fetch → fall back to local dataset-derived stand-ins so UI stays populated.
function withFallback<T>(fn: () => Promise<T>, fallback: T) {
  return async () => {
    try {
      const r = await fn();
      if (Array.isArray(r)) return (r.length ? r : fallback) as T;
      return (r ?? fallback) as T;
    } catch {
      return fallback;
    }
  };
}

const STALE = 60_000;

/* ---------- Alerts ---------- */
export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: withFallback(() => alertService.list(), MOCK_ALERTS as any[]),
    staleTime: 30_000,
  });
}

export function useDispatchAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertService.dispatch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

/* ---------- Notifications ---------- */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: withFallback(() => notificationService.list(), MOCK_NOTIFICATIONS as any[]),
    staleTime: 30_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/* ---------- Reports ---------- */
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: withFallback(() => reportService.list(), MOCK_REPORTS as any[]),
    staleTime: STALE,
  });
}

/* ---------- Users ---------- */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: withFallback(() => userService.list(), MOCK_USERS as any[]),
    staleTime: STALE,
  });
}

/* ---------- Districts ---------- */
export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: withFallback(async () => {
      const r = await districtService.list();
      return (Array.isArray(r) && r.length ? r : MOCK_DISTRICTS) as typeof MOCK_DISTRICTS;
    }, MOCK_DISTRICTS),
    staleTime: STALE,
  });
}

/* ---------- Predictions ---------- */
export function usePredictionZones() {
  return useQuery({
    queryKey: ["predictions", "zones"],
    queryFn: withFallback(() => predictionService.zones(), MOCK_PREDICTIONS as any[]),
    staleTime: STALE,
  });
}
export function usePredictionForecast() {
  return useQuery({
    queryKey: ["predictions", "forecast"],
    queryFn: withFallback(() => predictionService.forecast(), MOCK_FORECAST as any[]),
    staleTime: STALE,
  });
}
export function useExplainability() {
  return useQuery({
    queryKey: ["predictions", "explain"],
    queryFn: withFallback(
      async () => (await analyticsService.predictions())?.factors ?? MOCK_EXPLAIN,
      MOCK_EXPLAIN as any[],
    ),
    staleTime: STALE,
  });
}

/* ---------- Resources ---------- */
export function useResourceSummary() {
  return useQuery({
    queryKey: ["resources", "summary"],
    queryFn: withFallback(() => resourceService.summary() as any, MOCK_RESOURCES as any),
    staleTime: STALE,
  });
}
export function useRecommendations() {
  return useQuery({
    queryKey: ["resources", "recs"],
    queryFn: withFallback(() => resourceService.recommendations(), MOCK_RECS as any[]),
    staleTime: STALE,
  });
}

/* ---------- Network intel ---------- */
export function useNetwork() {
  return useQuery({
    queryKey: ["network"],
    queryFn: withFallback(async () => {
      const [nodes, edges] = await Promise.all([networkService.nodes(), networkService.edges()]);
      return {
        nodes: Array.isArray(nodes) && nodes.length ? nodes : (MOCK_NODES as any[]),
        edges: Array.isArray(edges) && edges.length ? edges : (MOCK_EDGES as any[]),
      };
    }, { nodes: MOCK_NODES as any[], edges: MOCK_EDGES as any[] }),
    staleTime: STALE,
  });
}

/* ---------- Heatmap (officer + public) ---------- */
export function useHeatmap() {
  return useQuery({
    queryKey: ["heatmap"],
    queryFn: withFallback(async () => {
      const r = await crimeService.heatmap();
      // Normalise into [[lat,lng,intensity], ...]
      const arr = Array.isArray(r) ? r.map((p: any) =>
        Array.isArray(p) ? p : [p.lat, p.lng, p.weight ?? 0.5],
      ) : [];
      return (arr.length ? arr : MOCK_HEATMAP) as [number, number, number][];
    }, MOCK_HEATMAP as [number, number, number][]),
    staleTime: STALE,
  });
}

/* ---------- Public portal ---------- */
export function usePublicLocalitySafety() {
  return useQuery({
    queryKey: ["public", "safety"],
    queryFn: withFallback(() => publicService.localitySafety(), MOCK_PSAFETY as any[]),
    staleTime: STALE,
  });
}
export function usePublicLocalityTrends() {
  return useQuery({
    queryKey: ["public", "trends"],
    queryFn: withFallback(() => publicService.localityTrends(), MOCK_PTRENDS as any[]),
    staleTime: STALE,
  });
}
export function usePublicAlerts() {
  return useQuery({
    queryKey: ["public", "alerts"],
    queryFn: withFallback(() => publicService.safetyAlerts(), MOCK_PALERTS as any[]),
    staleTime: STALE,
  });
}
export function useEmergencyContacts() {
  return useQuery({
    queryKey: ["public", "emergency"],
    queryFn: withFallback(() => publicService.emergencyContacts(), MOCK_EMERGENCY as any[]),
    staleTime: STALE,
  });
}
export function useSafetyTips() {
  return useQuery({
    queryKey: ["public", "tips"],
    queryFn: withFallback(() => publicService.safetyTips(), MOCK_SAFETY_TIPS as any[]),
    staleTime: STALE,
  });
}
