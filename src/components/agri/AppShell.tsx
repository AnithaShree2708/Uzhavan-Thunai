import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, FlaskConical } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/soil-weather", label: "Soil & Weather" },
  { to: "/crops", label: "Crop Recommendation" },
  { to: "/irrigation", label: "Irrigation" },
  { to: "/analytics", label: "Analytics" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/about", label: "Methodology" },
] as const;

export function DemoBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            <FlaskConical className="h-3.5 w-3.5" /> Demo mode · simulated data
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          Weather, soil sensor and history values are simulated. Recommendations use a transparent rule-based model. No live APIs are connected.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Uzhavan Thunai home">
            <BrandLogo className="h-12 w-12" />
            <span className="font-display text-base font-semibold leading-tight sm:text-lg">
              Uzhavan <span className="text-primary">Thunai</span>
            </span>
          </Link>
          <nav className="ml-2 hidden flex-1 items-center xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto hidden sm:block">
            <DemoBadge />
          </div>
          <Button variant="ghost" size="icon" className="ml-auto shrink-0 sm:ml-0 xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {open && (
          <nav className="border-t px-4 py-3 xl:hidden">
            <div className="mb-3 sm:hidden"><DemoBadge /></div>
            <div className="grid gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: true }}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Uzhavan Thunai · S.A. Engineering College GenAI Workshop prototype · All data simulated for demonstration
      </footer>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
