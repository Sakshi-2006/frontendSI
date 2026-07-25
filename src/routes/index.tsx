import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, Users, MapPin, Bell, Phone, MessageSquareWarning, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("commander@ksp.gov.in");
  const [password, setPassword] = useState("demo-access");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/@ksp\.gov\.in$/i.test(email)) {
      toast.error("Access restricted: use your @ksp.gov.in Karnataka Police email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      toast.success("Authenticated. Welcome, Officer.");
      navigate({ to: "/app/dashboard" });
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Subtle ambient */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 dark:opacity-30"
        style={{
          background:
            "radial-gradient(1200px 500px at 20% -10%, oklch(0.95 0.02 250 / 0.6), transparent 60%), radial-gradient(900px 400px at 90% 110%, oklch(0.96 0.01 250 / 0.7), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] text-foreground"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-foreground">SentinelIQ</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Karnataka State Police · Crime Intelligence Platform
              </div>
            </div>
          </div>
          <Link
            to="/public"
            className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted md:inline-flex"
          >
            <Users className="h-3.5 w-3.5" /> Public Portal
            <ArrowRight className="h-3 w-3" />
          </Link>
        </header>

        <div className="grid flex-1 grid-cols-1 items-center gap-8 py-8 lg:grid-cols-2">
          {/* Left: Officer sign-in */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl shadow-slate-200/60 md:p-10"
          >
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Lock className="h-3 w-3" /> Karnataka Police only
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Officer sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Authorised personnel of the Karnataka State Police. Public access is restricted.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">KSP email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="officer@ksp.gov.in"
                    className="h-11 pl-9 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-9 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                  Keep me signed in on this device
                </Label>
              </div>

              <Button type="submit" className="h-11 w-full" disabled={loading}>
                {loading ? "Authenticating…" : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or verify via
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button asChild variant="outline" className="h-11 w-full">
                <Link to="/verify-otp">Use one-time passcode</Link>
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Restricted use · Unauthorised access is a punishable offence under the IT Act.
            </p>
          </motion.div>

          {/* Right: Public Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-border bg-muted/40 p-8 shadow-sm md:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Users className="h-3 w-3" /> For citizens · No login required
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight leading-tight text-foreground">
              Public Safety Portal
              <br />
              <span className="text-primary">for the people of Karnataka.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Aggregated, anonymised safety intelligence — helping you stay informed
              without revealing any investigation-sensitive information.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: MapPin,               label: "Safe / unsafe area heatmap" },
                { icon: ArrowRight,           label: "Crime trends by locality" },
                { icon: Bell,                 label: "Live safety alerts" },
                { icon: Phone,                label: "Emergency contacts" },
                { icon: MessageSquareWarning, label: "Anonymous crime reporting" },
                { icon: HeartHandshake,       label: "Personal safety tips" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.label} className="flex items-start gap-2 rounded-lg border border-border bg-white p-3 text-xs text-foreground shadow-sm">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f.label}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/public">
                  Open Public Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/public/report">Report anonymously</Link>
              </Button>
            </div>

            <p className="mt-5 text-[11px] text-muted-foreground">
              No suspect names, investigation details, or sensitive case data are shown on the public portal.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
