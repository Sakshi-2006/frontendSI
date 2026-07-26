import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetwork } from "@/hooks/use-app-data";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/network")({
  component: NetworkPage,
});

const KIND_COLORS: Record<string, string> = {
  criminal: "#c0392b",
  vehicle: "#e08c3b",
  location: "#2aa7b8",
  case: "#1f2a55",
  associate: "#3aa872",
};

function NetworkPage() {
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  // Circular layout
  const positions = useMemo(() => {
    const R = 220;
    const cx = 400, cy = 300;
    const map = new Map<string, { x: number; y: number }>();
    networkNodes.forEach((n, i) => {
      const a = (i / networkNodes.length) * Math.PI * 2 - Math.PI / 2;
      map.set(n.id, { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
    });
    return map;
  }, []);

  const highlighted = useMemo(() => {
    if (!selected) return new Set<string>();
    const set = new Set<string>([selected]);
    networkEdges.forEach(([a, b]) => {
      if (a === selected) set.add(b);
      if (b === selected) set.add(a);
    });
    return set;
  }, [selected]);

  const filteredNodes = networkNodes.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="Criminal Network Intelligence"
        subtitle="Interactive graph of criminals, vehicles, locations, and cases."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Relationship Graph</CardTitle>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.min(2, z + 0.15))}><ZoomIn className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}><ZoomOut className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => { setZoom(1); setSelected(null); }}><Maximize2 className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[560px] w-full overflow-hidden rounded-b-xl bg-gradient-to-br from-muted/40 to-background">
              <svg viewBox="0 0 800 600" className="h-full w-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
                {/* Edges */}
                {networkEdges.map(([a, b], i) => {
                  const pa = positions.get(a)!;
                  const pb = positions.get(b)!;
                  const dim = selected && !(highlighted.has(a) && highlighted.has(b));
                  return (
                    <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                      stroke={dim ? "#c0c9d6" : "#1f2a55"} strokeWidth={dim ? 1 : 1.5} strokeOpacity={dim ? 0.3 : 0.6} />
                  );
                })}
                {/* Nodes */}
                {networkNodes.map((n) => {
                  const p = positions.get(n.id)!;
                  const dim = selected && !highlighted.has(n.id);
                  return (
                    <g key={n.id} onClick={() => setSelected(selected === n.id ? null : n.id)}
                      className="cursor-pointer" opacity={dim ? 0.35 : 1}>
                      <circle cx={p.x} cy={p.y} r={22} fill={KIND_COLORS[n.kind]} stroke="white" strokeWidth={3} />
                      <text x={p.x} y={p.y + 42} textAnchor="middle" className="fill-foreground" fontSize="11" fontWeight={600}>
                        {n.label}
                      </text>
                      <text x={p.x} y={p.y + 55} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                        {n.kind}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Search entities</CardTitle></CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
              <ul className="mt-3 max-h-64 space-y-1 overflow-auto">
                {filteredNodes.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => setSelected(n.id)}
                      className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-muted ${selected === n.id ? "bg-muted" : ""}`}>
                      <span className="inline-block h-2.5 w-2.5 rounded-full mr-2" style={{ background: KIND_COLORS[n.kind] }} />
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Legend</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(KIND_COLORS).map(([k, c]) => (
                <Badge key={k} variant="outline" className="capitalize">
                  <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  {k}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {selected && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Selected node</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="font-semibold">{networkNodes.find((n) => n.id === selected)?.label}</div>
                <div className="text-xs text-muted-foreground">
                  {highlighted.size - 1} direct connections
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
