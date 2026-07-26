import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResourceSummary, useRecommendations, useDistricts } from "@/hooks/use-app-data";
import { resourceService } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { Car, Building2, Users, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/resources")({
  component: ResourcesPage,
});

type Rec = { id: number | string; location: string; reason: string; deploy: { officers: number; vehicles: number }; priority: "critical" | "high" | "medium" };

function ResourcesPage() {
  const qc = useQueryClient();
  const resources = (useResourceSummary().data ?? { officers: { available: 0, deployed: 0, total: 0 }, vehicles: { available: 0, deployed: 0, total: 0 }, stations: 0 }) as {
    officers: { available: number; deployed: number; total: number };
    vehicles: { available: number; deployed: number; total: number };
    stations: number;
  };
  const recommendations = (useRecommendations().data ?? []) as Rec[];
  const districts = (useDistricts().data ?? []) as Array<{ id: string; name: string; risk: number }>;

  async function decide(id: string | number, decision: "approved" | "dismissed") {
    try { await resourceService.decide(String(id), decision); } catch {}
    qc.invalidateQueries({ queryKey: ["resources", "recs"] });
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader title="Resource Allocation" subtitle="AI-recommended deployment of officers and vehicles across districts." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResourceBlock icon={Users} label="Officers" data={resources.officers} tone="info" />
        <ResourceBlock icon={Car} label="Patrol vehicles" data={resources.vehicles} tone="warning" />
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Stations</div>
              <div className="text-3xl font-bold">{resources.stations}</div>
              <div className="text-xs text-muted-foreground">across 8 districts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-info" />
            <h2 className="font-semibold">AI Recommendations</h2>
          </div>
          {recommendations.map((r) => (
            <Card key={r.id} className={cn(
              "border-l-4",
              r.priority === "critical" && "border-l-destructive",
              r.priority === "high" && "border-l-warning",
              r.priority === "medium" && "border-l-info",
            )}>
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "capitalize",
                      r.priority === "critical" && "bg-destructive text-destructive-foreground",
                      r.priority === "high" && "bg-warning text-warning-foreground",
                      r.priority === "medium" && "bg-info text-info-foreground",
                    )}>{r.priority}</Badge>
                    <span className="text-sm font-semibold">{r.location}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-info" /> Deploy <b>{r.deploy.officers}</b> officers</span>
                    <span className="inline-flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-warning" /> <b>{r.deploy.vehicles}</b> patrol vehicles</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => decide(r.id, "dismissed")}>Dismiss</Button>
                  <Button size="sm" onClick={() => decide(r.id, "approved")}>Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>High-priority areas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {districts.slice(0, 5).sort((a, b) => b.risk - a.risk).map((d) => (
              <div key={d.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{d.risk}</span>
                </div>
                <Progress value={d.risk} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResourceBlock({ icon: Icon, label, data, tone }: any) {
  const map = { info: "bg-info/10 text-info", warning: "bg-warning/15 text-warning" } as const;
  const pct = Math.round((data.deployed / data.total) * 100);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", map[tone as keyof typeof map])}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="text-3xl font-bold">{data.total.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available <b className="text-foreground">{data.available}</b></span>
            <span>Deployed <b className="text-foreground">{data.deployed}</b></span>
          </div>
          <Progress value={pct} className="mt-2 h-1.5" />
          <div className="mt-1 text-right text-xs text-muted-foreground">{pct}% deployed</div>
        </div>
      </CardContent>
    </Card>
  );
}
