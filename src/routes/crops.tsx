import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/agri/AppShell";
import { ActionCards, CropCards, SectionTitle } from "@/components/agri/Widgets";
import { useFarm } from "@/lib/farm-store";
import { totalForecastRain } from "@/lib/demo-data";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Recommendation — AgriSense AI" },
      { name: "description", content: "Top 3 suitable crops with suitability scores and explainable factor breakdowns." },
      { property: "og:title", content: "Crop Recommendation — AgriSense AI" },
      { property: "og:description", content: "Explainable crop suitability scores from soil pH, NPK, moisture, temperature and rainfall." },
    ],
  }),
  component: Crops,
});

function Crops() {
  const { soil, crops, actions } = useFarm();
  return (
    <div>
      <PageHeader title="Crop Recommendation" subtitle="Top 3 crops ranked by a transparent rule-based suitability model using your soil inputs and the 7-day forecast.">
        <Button variant="outline" asChild><Link to="/soil-weather"><SlidersHorizontal /> Edit soil inputs</Link></Button>
      </PageHeader>
      <Card className="mb-6 bg-secondary/60 shadow-none">
        <CardContent className="flex flex-wrap gap-x-6 gap-y-1 p-4 text-sm">
          <span className="font-semibold">Inputs used:</span>
          <span>Moisture {soil.moisture}%</span><span>pH {soil.ph}</span>
          <span>NPK {soil.nitrogen}/{soil.phosphorus}/{soil.potassium}</span>
          <span>Temp {soil.temperature}°C</span><span>{soil.soilType} soil</span>
          <span>Rain 7d {totalForecastRain()} mm</span>
        </CardContent>
      </Card>
      <CropCards crops={crops} />
      <SectionTitle>Recommended farming actions</SectionTitle>
      <ActionCards actions={actions} />
    </div>
  );
}
