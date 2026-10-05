import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Droplets, Timer, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/agri/AppShell";
import { ActionCards, SectionTitle, StatCard } from "@/components/agri/Widgets";
import { Explain, PriorityBadge } from "@/components/agri/Explain";
import { useFarm } from "@/lib/farm-store";
import { FORECAST } from "@/lib/demo-data";

export const Route = createFileRoute("/irrigation")({
  head: () => ({
    meta: [
      { title: "Irrigation Schedule — AgriSense AI" },
      { name: "description", content: "Recommended watering time, duration and priority based on soil moisture and rain forecast." },
      { property: "og:title", content: "Irrigation Schedule — AgriSense AI" },
      { property: "og:description", content: "Water-saving irrigation schedule driven by soil moisture and weather." },
    ],
  }),
  component: Irrigation,
});

function Irrigation() {
  const { soil, irrigation, actions } = useFarm();
  let moisture = soil.moisture;
  const plan = FORECAST.map((d, i) => {
    moisture = Math.min(60, moisture + d.rainMm * 0.6 - (d.high > 30 ? 3 : 2));
    const water = i === 0 ? irrigation.needed && soil.moisture < 22 : moisture < 28 && d.rainChance < 60;
    if (water) moisture += 10;
    return { ...d, est: Math.max(0, Math.round(moisture)), water: (i === 1 && irrigation.needed && soil.moisture >= 22) || water };
  });

  return (
    <div>
      <PageHeader title="Irrigation Schedule" subtitle="Watering plan that responds to current soil moisture and the forecast. Edit inputs on the Soil & Weather page to see it adapt." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarClock} label="Next watering" value={<span className="text-base">{irrigation.when}</span>} />
        <StatCard icon={Timer} label="Duration" value={`${irrigation.durationMin} min`} hint="Drip / furrow equivalent" tone="sky" />
        <StatCard icon={Droplets} label="Current moisture" value={`${soil.moisture}%`} hint="Target 40%" />
        <StatCard icon={CheckCircle2} label="Status" value={<span className="text-base">{irrigation.needed ? "Watering scheduled" : "On hold"}</span>} tone="accent" />
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="font-display text-xl">Recommendation</CardTitle>
          <PriorityBadge p={irrigation.priority} />
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{irrigation.reason}</p>
          <Explain factors={irrigation.factors} summary="Duration ≈ moisture deficit × 2.2 × heat factor − expected 48h rain × 1.5, capped at 90 min. Deferred if rain chance exceeds 75% and moisture is above 28%." />
        </CardContent>
      </Card>

      <SectionTitle aside={<Badge variant="outline">Projected · demo</Badge>}>7-day plan</SectionTitle>
      <Card className="shadow-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Day</TableHead><TableHead>Forecast</TableHead><TableHead>Rain</TableHead><TableHead>Est. moisture</TableHead><TableHead>Action</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {plan.map((d) => (
              <TableRow key={d.date}>
                <TableCell className="font-medium">{d.day}, {d.date}</TableCell>
                <TableCell>{d.condition}</TableCell>
                <TableCell>{d.rainMm} mm ({d.rainChance}%)</TableCell>
                <TableCell>{d.est}%</TableCell>
                <TableCell>{d.water ? <Badge>Irrigate 06:00</Badge> : <span className="text-sm text-muted-foreground">Skip</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <SectionTitle aside={<Link to="/crops" className="text-sm font-medium text-primary">Crop advice →</Link>}>Related actions</SectionTitle>
      <ActionCards actions={actions} />
    </div>
  );
}
