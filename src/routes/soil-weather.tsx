import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Brain, Droplets, Thermometer, Wind, Sun } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/agri/AppShell";
import { ForecastStrip, SectionTitle, StatCard } from "@/components/agri/Widgets";
import { useFarm } from "@/lib/farm-store";
import { CURRENT_WEATHER, DEFAULT_SOIL, FORECAST, SOIL_TYPES, type SoilInput, type SoilType } from "@/lib/demo-data";


export const Route = createFileRoute("/soil-weather")({
  head: () => ({
    meta: [
      { title: "Soil & Weather — AgriSense AI" },
      { name: "description", content: "Enter soil moisture, pH and NPK values and view current weather with a 7-day demo forecast." },
      { property: "og:title", content: "Soil & Weather Inputs — AgriSense AI" },
      { property: "og:description", content: "Soil parameters and weather data that drive crop and irrigation recommendations." },
    ],
  }),
  component: SoilWeather,
});

type NumKey = Exclude<keyof SoilInput, "soilType">;
const FIELDS: { key: NumKey; label: string; unit: string; min: number; max: number; step: number }[] = [
  { key: "moisture", label: "Soil moisture", unit: "%", min: 0, max: 100, step: 1 },
  { key: "ph", label: "Soil pH", unit: "", min: 3, max: 10, step: 0.1 },
  { key: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", min: 0, max: 200, step: 1 },
  { key: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", min: 0, max: 150, step: 1 },
  { key: "potassium", label: "Potassium (K)", unit: "kg/ha", min: 0, max: 150, step: 1 },
  { key: "temperature", label: "Soil temperature", unit: "°C", min: 5, max: 45, step: 0.5 },
];

function SoilWeather() {
  const { soil, setSoil, markAnalyzed } = useFarm();
  const [draft, setDraft] = useState<SoilInput>(soil);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setNum = (k: NumKey, v: number) => {
    const f = FIELDS.find((x) => x.key === k)!;
    if (Number.isNaN(v)) return;
    setDraft((d) => ({ ...d, [k]: Math.min(f.max, Math.max(f.min, v)) }));
  };

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setSoil(draft);
      markAnalyzed();
      setLoading(false);
      toast.success("Recommendation generated from your soil data");
      navigate({ to: "/crops" });
    }, 700);
  };

  return (
    <div>
      <PageHeader title="Soil & Weather" subtitle="Enter field readings (manual input stands in for IoT soil sensors). Weather values are simulated demo data.">
        <Badge variant="outline">Manual input · Demo weather</Badge>
      </PageHeader>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Soil parameters</CardTitle>
          <CardDescription>Adjust sliders or type exact values, then generate a recommendation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <div className="flex items-center gap-1">
                    <Input id={f.key} type="number" value={draft[f.key]} min={f.min} max={f.max} step={f.step} onChange={(e) => setNum(f.key, parseFloat(e.target.value))} className="h-8 w-20 text-right" />
                    <span className="w-10 text-xs text-muted-foreground">{f.unit}</span>
                  </div>
                </div>
                <Slider value={[draft[f.key]]} min={f.min} max={f.max} step={f.step} onValueChange={([v]) => setNum(f.key, v)} />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Soil type</Label>
              <Select value={draft.soilType} onValueChange={(v) => setDraft((d) => ({ ...d, soilType: v as SoilType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Brain />} {loading ? "Generating…" : "Generate Recommendation"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setDraft(DEFAULT_SOIL)}><RotateCcw /> Reset to sample</Button>
          </div>
        </CardContent>
      </Card>

      <SectionTitle aside={<Badge variant="outline">Simulated · no live API</Badge>}>Current weather</SectionTitle>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Thermometer} label="Air temperature" value={`${CURRENT_WEATHER.temperature}°C`} hint={CURRENT_WEATHER.condition} tone="accent" />
        <StatCard icon={Droplets} label="Humidity" value={`${CURRENT_WEATHER.humidity}%`} tone="sky" />
        <StatCard icon={Wind} label="Wind" value={`${CURRENT_WEATHER.windKmh} km/h`} tone="sky" />
        <StatCard icon={Sun} label="UV index" value={CURRENT_WEATHER.uvIndex} hint="High — avoid midday spraying" tone="earth" />
      </div>

      <SectionTitle>7-day forecast</SectionTitle>
      <ForecastStrip days={FORECAST} />
    </div>
  );
}
