import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDistricts, useCrimeByType, useCrimeTrend } from "@/hooks/use-app-data";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { Users, MapPin, Brain, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/districts")({
  component: DistrictsPage,
});

const C = ["#1f2a55", "#2aa7b8", "#7c8ba8", "#e08c3b", "#3aa872"];
const tt = { backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 };

type District = { id: string; name: string; risk: number; crimes: number; population: number; officers: number };

function DistrictsPage() {
  const districts = (useDistricts().data ?? []) as District[];
  const crimeByType = (useCrimeByType().data ?? []) as Array<{ type: string; value: number }>;
  const crimeTrend = (useCrimeTrend().data ?? []) as Array<{ month: string; crimes: number; solved: number }>;
  const [selected, setSelected] = useState<string | null>(null);
  const currentId = selected ?? districts[0]?.id ?? null;
  const d = districts.find((x) => x.id === currentId);
  if (!d) return <div className="p-8 text-sm text-muted-foreground">Loading districts…</div>;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader title="District Analytics" subtitle="Select a district to drill into its performance." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Districts</CardTitle></CardHeader>
          <CardContent className="p-2">
            <ul className="space-y-1">
              {districts.map((x) => (
                <li key={x.id}>
                  <button
                    onClick={() => setSelected(x.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition",
                      selected === x.id ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{x.name}</span>
                      <RiskChip risk={x.risk} inverted={selected === x.id} />
                    </div>
                    <div className={cn("mt-0.5 text-xs", selected === x.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {x.crimes.toLocaleString()} crimes
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MiniStat icon={MapPin} label="Total crimes" value={d.crimes.toLocaleString()} />
            <MiniStat icon={Brain} label="AI Risk Score" value={`${d.risk}/100`} tone={d.risk > 75 ? "destructive" : d.risk > 55 ? "warning" : "success"} />
            <MiniStat icon={Users} label="Population" value={d.population.toLocaleString()} />
            <MiniStat icon={TrendingUp} label="Officers deployed" value={d.officers.toString()} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={crimeTrend}>
                    <defs>
                      <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C[1]} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={C[1]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tt} />
                    <Area type="monotone" dataKey="crimes" stroke={C[1]} fill="url(#dg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Crime Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={crimeByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tt} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {crimeByType.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Hotspots</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Sector 4 / Market St", "Node 7 / Riverside", "Block 12 / Docks"].map((h, i) => (
                  <div key={h} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <div>
                      <div className="text-sm font-medium">{h}</div>
                      <div className="text-xs text-muted-foreground">{d.name} · {(85 - i * 12)} incidents / 30d</div>
                    </div>
                    <Badge className={i === 0 ? "bg-destructive text-destructive-foreground" : i === 1 ? "bg-warning text-warning-foreground" : "bg-info text-info-foreground"}>
                      {i === 0 ? "Critical" : i === 1 ? "High" : "Medium"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Population vs Crime Load</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-2">
                <Row label="Population" value={d.population.toLocaleString()} />
                <Row label="Crimes / 1K residents" value={((d.crimes / d.population) * 1000).toFixed(2)} />
                <Row label="Officer coverage" value={`1 : ${Math.round(d.population / d.officers)}`} />
                <Row label="Clearance rate" value={`${(60 + (d.id.length * 3)) % 40 + 45}%`} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, tone = "info" }: any) {
  const map = {
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", map[tone as keyof typeof map])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-xl font-bold tracking-tight">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskChip({ risk, inverted }: { risk: number; inverted?: boolean }) {
  const tone = risk > 75 ? "destructive" : risk > 55 ? "warning" : "success";
  const classes = {
    destructive: inverted ? "bg-destructive/30 text-white" : "bg-destructive/10 text-destructive",
    warning: inverted ? "bg-warning/30 text-white" : "bg-warning/15 text-warning",
    success: inverted ? "bg-success/30 text-white" : "bg-success/10 text-success",
  }[tone];
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", classes)}>{risk}</span>;
}
