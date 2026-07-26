import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePredictionZones, useExplainability, usePredictionForecast } from "@/hooks/use-app-data";
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/predictions")({
  component: PredictionsPage,
});

const tt = { backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 };

function PredictionsPage() {
  const predictions = (usePredictionZones().data ?? []) as Array<{ zone: string; risk: number; window: string; trend: "up"|"down"|"flat"; confidence: number; category?: string }>;
  const forecast = (usePredictionForecast().data ?? []) as Array<{ day: string; predicted: number; actual: number | null }>;
  const explainability = (useExplainability().data ?? []) as Array<{ factor: string; weight: number }>;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="AI Prediction Center"
        subtitle="Forecasts, high-risk zones, and explainable model reasoning."
        actions={<Badge variant="outline"><Sparkles className="mr-1 h-3 w-3 text-info" /> Model v4.2 · 92% acc</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {predictions.map((p, i) => (
          <motion.div key={p.zone} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{p.window}</Badge>
                  <TrendIcon t={p.trend} />
                </div>
                <div className="mt-3 text-sm font-semibold">{p.zone}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.risk}</span>
                  <span className="text-sm text-muted-foreground">/100 risk</span>
                </div>
                <Progress value={p.risk} className="mt-3 h-1.5" />
                <div className="mt-3 text-xs text-muted-foreground">
                  Confidence · <span className="font-semibold text-foreground">{Math.round(p.confidence * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>7-Day Crime Forecast</CardTitle>
            <p className="text-xs text-muted-foreground">Predicted vs actual, incidents per day</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tt} />
                <Line type="monotone" dataKey="predicted" stroke="#2aa7b8" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="4 3" />
                <Line type="monotone" dataKey="actual" stroke="#1f2a55" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-info" />
              <CardTitle>Explainable AI</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Why the model raised the risk score</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {explainability.map((f) => (
              <div key={f.factor}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{f.factor}</span>
                  <span className="font-mono text-xs text-muted-foreground">{Math.round(f.weight * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-info to-primary" style={{ width: `${f.weight * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Sample Prediction — Eastfield Sector 4</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70">Risk Score</div>
            <div className="text-5xl font-bold">82%</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70">Top reasons</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>· Increase in theft (+38%)</li>
              <li>· Repeat offenders active</li>
              <li>· Festival season window</li>
              <li>· Poor street lighting</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70">Recommendation</div>
            <p className="mt-2 text-sm opacity-90">
              Deploy 12 officers and 3 patrol vehicles between 8 PM–11 PM in the north corridor.
              Coordinate with District 5 command.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendIcon({ t }: { t: "up" | "down" | "flat" }) {
  if (t === "up") return <TrendingUp className="h-4 w-4 text-destructive" />;
  if (t === "down") return <TrendingDown className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}
