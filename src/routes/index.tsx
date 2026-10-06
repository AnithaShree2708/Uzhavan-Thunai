import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Droplets, Thermometer, Wind, CloudRain, Sprout, Waves, Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import hero from "@/assets/hero-farm.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFarm } from "@/lib/farm-store";
import { CURRENT_WEATHER, FARM, FORECAST, totalForecastRain } from "@/lib/demo-data";
import { ActionCards, ForecastStrip, SectionTitle, StatCard } from "@/components/agri/Widgets";
import { Explain, PriorityBadge } from "@/components/agri/Explain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AgriSense AI" },
      { name: "description", content: "Farm status, weather, irrigation and explainable AI crop recommendations at a glance." },
      { property: "og:title", content: "AgriSense AI — Smarter Decisions. Healthier Crops." },
      { property: "og:description", content: "Decision support combining soil, weather and crop data with explainable recommendations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { soil, crops, irrigation, actions, markAnalyzed, analyzedAt } = useFarm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const top = crops[0]!;

  const analyze = () => {
    setLoading(true);
    setTimeout(() => {
      markAnalyzed();
      setLoading(false);
      toast.success("Farm analyzed", { description: `Top crop: ${top.crop} (${top.score}/100)` });
      navigate({ to: "/crops" });
    }, 900);
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-field text-primary-foreground shadow-card">
        <img src={hero} alt="Terraced green farmland at sunrise" width={1600} height={800} className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative max-w-2xl px-6 py-14 sm:px-10 sm:py-20">
          <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">Smart Farming Decision Support</Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Smarter Decisions.<br />Healthier Crops.</h1>
          <p className="mt-4 text-base opacity-90 sm:text-lg">
            AgriSense AI combines soil, weather and crop data to recommend what to grow, when to irrigate and which actions to take — with a clear explanation for every decision.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={analyze} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="animate-spin" /> : <Brain />} {loading ? "Analyzing farm…" : "Analyze Farm"}
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/soil-weather">Enter soil data <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span><strong className="text-foreground">{FARM.name}</strong> · {FARM.area} · Current crop: {FARM.currentCrop}</span>
        <span>{analyzedAt ? `Last analyzed ${analyzedAt.toLocaleTimeString()}` : "Not analyzed yet this session"}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Droplets} label="Soil moisture" value={`${soil.moisture}%`} hint="Target 40%" />
        <StatCard icon={Thermometer} label="Temperature" value={`${CURRENT_WEATHER.temperature}°C`} hint={CURRENT_WEATHER.condition} tone="accent" />
        <StatCard icon={Wind} label="Humidity" value={`${CURRENT_WEATHER.humidity}%`} hint={`Wind ${CURRENT_WEATHER.windKmh} km/h`} tone="sky" />
        <StatCard icon={CloudRain} label="Rain (7 days)" value={`${totalForecastRain()} mm`} hint={`Peak ${Math.max(...FORECAST.map((d) => d.rainChance))}% chance`} tone="sky" />
        <StatCard icon={Sprout} label="Current crop" value={<span className="text-lg">{FARM.currentCrop}</span>} hint={`Sown ${FARM.sowingDate}`} tone="earth" />
        <StatCard icon={Waves} label="Irrigation" value={<span className="text-lg">{irrigation.needed ? `${irrigation.durationMin} min` : "On hold"}</span>} hint={irrigation.when} />
        <StatCard icon={Brain} label="Top crop match" value={<span className="text-lg">{top.crop}</span>} hint={`${top.score}/100 suitability`} tone="accent" />
        <StatCard icon={Sprout} label="Soil" value={<span className="text-lg">{soil.soilType}</span>} hint={`pH ${soil.ph} · NPK ${soil.nitrogen}/${soil.phosphorus}/${soil.potassium}`} tone="earth" />
      </div>

      <Card className="mt-6 border-primary/30 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-xl"><Brain className="h-5 w-5 text-primary" /> AI recommendation summary</CardTitle>
          <PriorityBadge p={irrigation.priority} />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Best crop for current conditions</p>
            <p className="mt-1 text-lg font-semibold">{top.crop} — {top.score}/100</p>
            <p className="text-sm text-muted-foreground">{top.reason}</p>
            <Explain factors={top.factors} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Irrigation</p>
            <p className="mt-1 text-lg font-semibold">{irrigation.needed ? `${irrigation.when} · ${irrigation.durationMin} min` : "No irrigation needed"}</p>
            <p className="text-sm text-muted-foreground">{irrigation.reason}</p>
            <Explain factors={irrigation.factors} />
          </div>
        </CardContent>
      </Card>

      <SectionTitle aside={<Link to="/irrigation" className="text-sm font-medium text-primary">Details →</Link>}>Farming actions</SectionTitle>
      <ActionCards actions={actions} />

      <SectionTitle aside={<Badge variant="outline">Demo forecast</Badge>}>7-day forecast</SectionTitle>
      <ForecastStrip days={FORECAST} />
    </div>
  );
}
