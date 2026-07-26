import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-app-data";
import { reportService } from "@/services";
import { Download, FileText, FilePlus2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { data, isLoading } = useReports();
  const reportsList = (data ?? []) as Array<{ id: string; title: string; type: string; size: string; date: string }>;
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and download PDF summaries, district reports, and trend analyses."
        actions={<Button size="sm"><FilePlus2 className="mr-2 h-4 w-4" /> New report</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {["Crime Summary", "District Report", "Trend Report", "AI Model Report"].map((t) => (
          <Card key={t} className="cursor-pointer transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="mt-3 font-semibold">{t}</div>
              <p className="mt-1 text-xs text-muted-foreground">Pre-configured template, one-click export.</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input placeholder="Search reports…" className="max-w-xs" />
            <Badge variant="outline">All types</Badge>
            <Badge variant="outline">Last 30 days</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading && !reportsList.length ? (
            <div className="flex items-center justify-center p-10 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading reports…
            </div>
          ) : reportsList.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No reports available yet.</div>
          ) : (
          <div className="divide-y divide-border">
            {reportsList.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-mono">{r.id}</span> · {r.type} · {r.size} · {r.date}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Preview</Button>
                  <Button size="sm" asChild>
                    <a href={reportService.downloadUrl(r.id)} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
