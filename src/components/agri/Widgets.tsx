import type { ComponentType, ReactNode } from "react";
import { Bug, CloudRain, Cloud, CloudLightning, CloudSun, Droplets, FlaskRound, Sun, Wheat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Explain, PriorityBadge } from "./Explain";
import type { CropRec, FarmAction } from "@/lib/engine";
import type { DayForecast } from "@/lib/demo-data";

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: { icon: ComponentType<{ className?: string }>; label: string; value: ReactNode; hint?: string; tone?: "primary" | "sky" | "earth" | "accent" }) {
  const toneCls = { primary: "bg-primary/10 text-primary", sky: "bg-sky/15 text-sky", earth: "bg-earth/15 text-earth", accent: "bg-accent/20 text-accent-foreground" }[tone];
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-start gap-3 p-5">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${toneCls}`}><Icon className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function CropCards({ crops }: { crops: CropRec[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {crops.map((c, i) => (
        <Card key={c.crop} className={`shadow-card ${i === 0 ? "border-primary/50 ring-1 ring-primary/30" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">#{i + 1} {i === 0 && "· Best match"}</span>
              <Wheat className="h-4 w-4 text-earth" />
            </div>
            <CardTitle className="font-display text-xl">{c.crop}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary">{c.score}</span>
              <span className="pb-1 text-sm text-muted-foreground">/ 100 suitability</span>
            </div>
            <Progress value={c.score} className="mt-2 h-2" />
            <p className="mt-3 text-sm text-muted-foreground">{c.reason}</p>
            <Explain factors={c.factors} summary="Weighted score: pH 20%, NPK 25%, moisture 20%, temperature 15%, rainfall 10%, soil type 10%." />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const actionIcon = { Irrigation: Droplets, Fertilizer: FlaskRound, Pest: Bug, Weather: CloudRain };

export function ActionCards({ actions }: { actions: FarmAction[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((a) => {
        const Icon = actionIcon[a.category];
        return (
          <Card key={a.category} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4.5 w-4.5" /></span>
                <PriorityBadge p={a.priority} />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{a.category}</p>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{a.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export const weatherIcon: Record<DayForecast["condition"], ComponentType<{ className?: string }>> = {
  Sunny: Sun,
  "Partly Cloudy": CloudSun,
  Cloudy: Cloud,
  "Light Rain": CloudRain,
  Rain: CloudRain,
  Thunderstorm: CloudLightning,
};

export function ForecastStrip({ days }: { days: DayForecast[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d) => {
        const Icon = weatherIcon[d.condition];
        return (
          <div key={d.date} className="rounded-xl border bg-card p-3 text-center shadow-card">
            <p className="text-sm font-semibold">{d.day}</p>
            <p className="text-xs text-muted-foreground">{d.date}</p>
            <Icon className="mx-auto my-2 h-7 w-7 text-sky" />
            <p className="text-sm font-semibold">{d.high}° <span className="font-normal text-muted-foreground">{d.low}°</span></p>
            <p className="mt-1 text-xs text-sky">{d.rainMm} mm · {d.rainChance}%</p>
            <p className="text-[11px] text-muted-foreground">{d.condition}</p>
          </div>
        );
      })}
    </div>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 mt-10 flex items-center justify-between gap-2">
      <h2 className="font-display text-2xl font-semibold">{children}</h2>
      {aside}
    </div>
  );
}
