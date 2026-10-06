import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Database, Cpu, Brain, MessageSquareText, Tractor, BarChart3, CloudSun, Radio, Network, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/agri/AppShell";
import { SectionTitle } from "@/components/agri/Widgets";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Methodology — Uzhavan Thunai" },
      { name: "description", content: "How Uzhavan Thunai turns soil, weather and crop data into explainable farming recommendations." },
      { property: "og:title", content: "Methodology & Pipeline — Uzhavan Thunai" },
      { property: "og:description", content: "Data pipeline, scoring model and future integrations of the Uzhavan Thunai prototype." },
    ],
  }),
  component: About,
});

const STEPS = [
  { icon: Database, t: "Soil + Weather + Crop Data", d: "Manual soil readings, demo forecast, crop profiles" },
  { icon: Cpu, t: "Data Processing", d: "Normalise ranges, compute deficits" },
  { icon: Brain, t: "Recommendation Engine", d: "Weighted rule-based scoring" },
  { icon: MessageSquareText, t: "Explainable Recommendation", d: "Per-factor contribution bars" },
  { icon: Tractor, t: "Farmer Action", d: "Irrigation, fertilizer, pest, weather" },
  { icon: BarChart3, t: "Historical Analytics", d: "Trends feed back into decisions" },
];

const FUTURE = [
  { icon: CloudSun, t: "Weather API", d: "Live current and forecast data (e.g. OpenWeather / IMD) replacing the demo forecast." },
  { icon: Radio, t: "Soil sensor / IoT data", d: "Moisture, temperature and NPK probes streaming readings automatically." },
  { icon: Network, t: "ML crop model", d: "Model trained on regional yield data replacing the rule-based scorer." },
  { icon: Bot, t: "LLM explanation layer", d: "Natural-language explanations and a real conversational assistant." },
];

function About() {
  return (
    <div>
      <PageHeader title="About & Methodology" subtitle="Uzhavan Thunai is a workshop prototype for S.A. Engineering College showing how GenAI-era decision support can help farmers act on data." />
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {STEPS.map((s, i) => (
          <div key={s.t} className="flex flex-1 flex-col items-center gap-3 lg:flex-row">
            <Card className="w-full flex-1 shadow-card">
              <CardContent className="p-4 text-center">
                <s.icon className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 text-sm font-semibold">{s.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
              </CardContent>
            </Card>
            {i < STEPS.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-earth lg:rotate-0" />}
          </div>
        ))}
      </div>

      <SectionTitle>Scoring model</SectionTitle>
      <Card className="shadow-card">
        <CardContent className="grid gap-4 p-6 text-sm md:grid-cols-2">
          <div>
            <p className="font-semibold">Crop suitability (0–100)</p>
            <p className="mt-1 text-muted-foreground">Each crop has ideal ranges. Every factor scores 1 when inside its range and decays linearly outside. Weights: pH 20%, NPK 25%, moisture 20%, temperature 15%, 7-day rainfall 10%, soil type 10%.</p>
          </div>
          <div>
            <p className="font-semibold">Irrigation</p>
            <p className="mt-1 text-muted-foreground">Duration = moisture deficit vs 40% target × 2.2 × heat factor − 48h rain × 1.5 (capped at 90 min). Deferred when rain chance &gt; 75% and moisture is above 28%.</p>
          </div>
        </CardContent>
      </Card>

      <SectionTitle>Future integrations</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FUTURE.map((f) => (
          <Card key={f.t} className="shadow-card">
            <CardHeader className="pb-2"><f.icon className="h-6 w-6 text-earth" /><CardTitle className="text-base">{f.t}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.d}</CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">All demo data lives in one isolated module, and the engine and assistant expose stable interfaces, so real APIs can be connected without UI changes.</p>
    </div>
  );
}
