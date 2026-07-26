import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePublicAlerts } from "@/hooks/use-app-data";
import { Bell, AlertTriangle, Info } from "lucide-react";

export const Route = createFileRoute("/public/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  const publicSafetyAlerts = (usePublicAlerts().data ?? []) as Array<{ id: string; title: string; area: string; time: string; level: "warning" | "info" }>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Safety Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Public advisories from Karnataka Police. Follow instructions from your local station.
        </p>
      </div>

      <div className="space-y-3">
        {publicSafetyAlerts.map((a) => {
          const isWarn = a.level === "warning";
          const Icon = isWarn ? AlertTriangle : Info;
          return (
            <Card key={a.id} className={isWarn ? "border-warning/50" : ""}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isWarn ? "bg-warning/15 text-warning-foreground" : "bg-info/15 text-info"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{a.title}</div>
                    <Badge variant={isWarn ? "destructive" : "secondary"} className="uppercase text-[10px]">
                      {a.level}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {a.area} · {a.time}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <Bell className="mt-0.5 h-4 w-4 shrink-0" />
        Alerts are informational summaries. Never share OTPs or personal financial details in response to any message claiming to be from the police.
      </div>
    </div>
  );
}
