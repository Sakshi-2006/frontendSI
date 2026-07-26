import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSafetyTips } from "@/hooks/use-app-data";
import { HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/public/safety")({
  component: SafetyPage,
});

function SafetyPage() {
  const safetyTips = (useSafetyTips().data ?? []) as Array<{ title: string; body: string }>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Personal Safety Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Practical guidance from Karnataka State Police to help you and your family stay safer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {safetyTips.map((t) => (
          <Card key={t.title}>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/15 text-info">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
