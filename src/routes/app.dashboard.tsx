import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Brain,
  Clock,
  FileWarning,
  Layers,
  MapPin,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  KPI as MOCK_KPI,
  districts,
} from "@/lib/mock-data";
import {
  useKpis,
  useCrimeTrend,
  useCrimeByType,
  useRecentActivity,
} from "@/hooks/use-dashboard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

const CHART_COLORS = ["#1f2a55", "#2aa7b8", "#7c8ba8", "#e08c3b", "#3aa872"];

function DashboardPage() {
  const { data: KPI = MOCK_KPI } = useKpis();
  const { data: crimeTrend = [] } = useCrimeTrend(12);
  const { data: crimeByType = [] } = useCrimeByType();
  const { data: recentActivities = [] } = useRecentActivity(6);
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="Command Dashboard"
        subtitle="Real-time crime intelligence · updated moments ago"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" /> Last 30 days
            </Button>
            <Button size="sm" asChild>
              <Link to="/app/reports">
                <FileWarning className="mr-2 h-4 w-4" /> Generate report
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Crimes" value={KPI.totalCrimes} delta={KPI.crimeGrowth} icon={ShieldAlert} tone="info" />
        <KpiCard label="Today's Crimes" value={KPI.todayCrimes} delta={2.4} icon={Activity} tone="warning" />
        <KpiCard label="Solved Cases" value={KPI.solvedCases} delta={5.8} icon={BadgeCheck} tone="success" />
        <KpiCard label="Pending Cases" value={KPI.pendingCases} delta={-1.2} icon={Layers} />
        <KpiCard label="High-Risk Districts" value={KPI.highRiskDistricts} icon={MapPin} tone="destructive" hint="of 8 total" />
        <KpiCard label="Active Alerts" value={KPI.activeAlerts} delta={12.5} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="AI Risk Score" value={`${KPI.aiRiskScore}/100`} icon={Brain} tone="info" hint="Composite index" />
        <KpiCard label="Crime Growth" value={`${KPI.crimeGrowth}%`} icon={TrendingUp} tone="success" hint="vs previous month" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Crime Trend</CardTitle>
              <p className="text-xs text-muted-foreground">Reported vs solved · 12 months</p>
            </div>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={crimeTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="crimes" stroke={CHART_COLORS[0]} fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="solved" stroke={CHART_COLORS[1]} fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crime by Type</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution across categories</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={crimeByType} dataKey="value" nameKey="type" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {crimeByType.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>District Crime Load</CardTitle>
            <p className="text-xs text-muted-foreground">Crimes reported per district · YTD</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={districts}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="crimes" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-info/30 blur-3xl"
            />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-info" />
                <CardTitle className="text-primary-foreground">AI Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="opacity-90">
                Overall crime is <b>down 4.6%</b> this month, but <b>Eastfield</b> shows a
                sharp spike in burglary between <b>8–11 PM</b>. Model confidence:{" "}
                <b>92%</b>.
              </p>
              <ul className="space-y-1.5 text-xs opacity-90">
                <li>· Recommend +12 officers to District 5</li>
                <li>· Monitor 3 repeat-offender clusters</li>
                <li>· Weekend risk elevated in Central</li>
              </ul>
              <Button asChild size="sm" variant="secondary" className="w-full">
                <Link to="/app/predictions">View predictions</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/alerts">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {recentActivities.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <SeverityDot sev={a.severity} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.district} · {a.time}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">{a.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SeverityDot({ sev }: { sev: "low" | "medium" | "high" }) {
  const map = { low: "bg-success", medium: "bg-warning", high: "bg-destructive" } as const;
  return <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${map[sev]}`} />;
}

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
};

// Chart LineChart kept exported implicitly by import to satisfy tree-shake variants
export { LineChart, Line };
