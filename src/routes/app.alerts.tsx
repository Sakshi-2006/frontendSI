import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlerts, useDispatchAlert } from "@/hooks/use-app-data";
import { AlertTriangle, ShieldAlert, Activity, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";

export const Route = createFileRoute("/app/alerts")({
  component: AlertsPage,
});

const sevMap = {
  critical: { class: "bg-destructive text-destructive-foreground", icon: ShieldAlert },
  high: { class: "bg-warning text-warning-foreground", icon: AlertTriangle },
  medium: { class: "bg-info text-info-foreground", icon: Activity },
  low: { class: "bg-muted text-muted-foreground", icon: Activity },
} as const;

function AlertsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="Alerts Center"
        subtitle="Real-time incidents, anomaly detection, and emergency broadcasts."
        actions={<Button size="sm" variant="outline">Mark all reviewed</Button>}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="anomaly">Anomaly</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {alerts.map((a) => <AlertRow key={a.id} a={a} />)}
        </TabsContent>
        <TabsContent value="active" className="mt-4 space-y-3">
          {alerts.filter((a) => a.status === "active").map((a) => <AlertRow key={a.id} a={a} />)}
        </TabsContent>
        <TabsContent value="anomaly" className="mt-4 space-y-3">
          {alerts.filter((a) => a.title.toLowerCase().includes("spike") || a.title.toLowerCase().includes("anomaly")).map((a) => <AlertRow key={a.id} a={a} />)}
        </TabsContent>
        <TabsContent value="resolved" className="mt-4 space-y-3">
          {alerts.filter((a) => a.status === "resolved").map((a) => <AlertRow key={a.id} a={a} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AlertRow({ a }: { a: typeof alerts[number] }) {
  const s = sevMap[a.severity];
  const Icon = s.icon;
  return (
    <Card className={cn(
      "border-l-4",
      a.severity === "critical" && "border-l-destructive",
      a.severity === "high" && "border-l-warning",
      a.severity === "medium" && "border-l-info",
      a.severity === "low" && "border-l-muted-foreground/30",
    )}>
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", s.class)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-[10px] uppercase", s.class)}>{a.severity}</Badge>
              <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
            </div>
            <div className="mt-1 font-semibold">{a.title}</div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.district}</span>
              <span>·</span>
              <span>{a.time}</span>
              <span>·</span>
              <span className="capitalize">{a.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Details</Button>
          <Button size="sm">Dispatch</Button>
        </div>
      </CardContent>
    </Card>
  );
}
