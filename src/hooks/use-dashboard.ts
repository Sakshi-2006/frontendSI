import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import {
  KPI as MOCK_KPI,
  crimeByType as MOCK_BY_TYPE,
  crimeTrend as MOCK_TREND,
  recentActivities as MOCK_ACTIVITY,
} from "@/lib/mock-data";

// React Query hooks that pull live backend data and fall back to the local
// KSP-derived shapes if the API is unreachable (keeps the UI populated so
// nothing renders blank during backend downtime or first-time setup).

export function useKpis() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      try {
        return (await dashboardService.getKpis()) ?? MOCK_KPI;
      } catch {
        return MOCK_KPI;
      }
    },
    staleTime: 60_000,
  });
}

export function useCrimeTrend(months = 12) {
  return useQuery({
    queryKey: ["dashboard", "crime-trend", months],
    queryFn: async () => {
      try {
        const r = await dashboardService.getCrimeTrend(months);
        return Array.isArray(r) && r.length ? r : MOCK_TREND;
      } catch {
        return MOCK_TREND;
      }
    },
    staleTime: 60_000,
  });
}

export function useCrimeByType() {
  return useQuery({
    queryKey: ["dashboard", "crime-by-type"],
    queryFn: async () => {
      try {
        const r = await dashboardService.getCrimeByType();
        return Array.isArray(r) && r.length ? r : MOCK_BY_TYPE;
      } catch {
        return MOCK_BY_TYPE;
      }
    },
    staleTime: 60_000,
  });
}

export function useRecentActivity(limit = 6) {
  return useQuery({
    queryKey: ["dashboard", "recent-activity", limit],
    queryFn: async () => {
      try {
        const r = await dashboardService.getRecentActivity(limit);
        return Array.isArray(r) && r.length ? r : MOCK_ACTIVITY;
      } catch {
        return MOCK_ACTIVITY;
      }
    },
    staleTime: 30_000,
  });
}
