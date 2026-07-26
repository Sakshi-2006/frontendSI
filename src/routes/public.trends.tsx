import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicLocalityTrends, usePublicLocalitySafety } from "@/hooks/use-app-data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export const Route = createFileRoute("/public/trends")({
  component: TrendsPage,
});

function TrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent Crime Trends by Locality</h1>
        <p className="text-sm text-muted-foreground">
          Weekly reported categories across major Karnataka localities. Aggregated data only — no case details.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Statewide weekly trend</CardTitle></CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={publicLocalityTrends}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="theft"       stroke="var(--color-chart-1)" strokeWidth={2} />
              <Line type="monotone" dataKey="harassment"  stroke="var(--color-destructive)" strokeWidth={2} />
              <Line type="monotone" dataKey="traffic"     stroke="var(--color-info)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>By locality</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {publicLocalitySafety.map((l) => {
            const Trend = l.trend === "up" ? TrendingUp : l.trend === "down" ? TrendingDown : Minus;
            const color = l.trend === "up" ? "text-success" : l.trend === "down" ? "text-destructive" : "text-muted-foreground";
            return (
              <div key={l.locality} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="font-medium">{l.locality}</div>
                  <div className="text-xs text-muted-foreground">Safety score {l.score}/100</div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${color}`}>
                  <Trend className="h-4 w-4" />
                  <span className="capitalize">{l.trend}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
