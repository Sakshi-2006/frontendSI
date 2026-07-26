import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useEmergencyContacts } from "@/hooks/use-app-data";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/public/emergency")({
  component: EmergencyPage,
});

function EmergencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency Contacts</h1>
        <p className="text-sm text-muted-foreground">
          Karnataka State — 24×7 helplines. Save these numbers on your phone.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {emergencyContacts.map((c) => (
          <Card key={c.name} className="transition hover:border-primary hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
              <a
                href={`tel:${c.number.replace(/[^0-9+]/g, "")}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {c.number}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
