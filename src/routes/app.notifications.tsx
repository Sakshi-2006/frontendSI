import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications, useMarkAllRead } from "@/hooks/use-app-data";
import { AlertCircle, Info, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

const kindMap = {
  critical: { class: "bg-destructive/10 text-destructive", icon: AlertCircle },
  info: { class: "bg-info/10 text-info", icon: Info },
  success: { class: "bg-success/10 text-success", icon: CheckCircle2 },
} as const;

function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const notifications = (data ?? []) as Array<{
    id: string | number; title: string; body: string; time: string; read: boolean; kind: keyof typeof kindMap;
  }>;
  const markAll = useMarkAllRead();

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="System, prediction, and alert notifications in one place."
        actions={
          <Button size="sm" variant="outline" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            Mark all as read
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading && !notifications.length ? (
            <div className="flex items-center justify-center p-10 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">You're all caught up.</div>
          ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const k = kindMap[n.kind] ?? kindMap.info;
              const Icon = k.icon;
              return (
                <div key={n.id} className={cn("flex items-start gap-3 p-4", !n.read && "bg-muted/30")}>
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", k.class)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.time} ago</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.read && <Badge className="bg-info text-info-foreground">New</Badge>}
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
