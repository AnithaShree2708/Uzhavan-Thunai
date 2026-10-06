import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PageHeader } from "@/components/agri/AppShell";
import { StatCard } from "@/components/agri/Widgets";
import { HISTORY, YIELD_HISTORY } from "@/lib/demo-data";
import { Droplets, CloudRain, Waves, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Historical Analytics — AgriSense AI" },
      { name: "description", content: "Soil moisture, rainfall, irrigation and crop yield trends for the demo field." },
      { property: "og:title", content: "Field Analytics — AgriSense AI" },
      { property: "og:description", content: "12-month field history and multi-season yield trends." },
    ],
  }),
  component: Analytics,
});

const cfg = {
  moisture: { label: "Soil moisture (%)", color: "var(--chart-1)" },
  rainfall: { label: "Rainfall (mm)", color: "var(--chart-2)" },
  irrigation: { label: "Irrigation (hrs)", color: "var(--chart-3)" },
  rice: { label: "Rice (t/ha)", color: "var(--chart-1)" },
  maize: { label: "Maize (t/ha)", color: "var(--chart-3)" },
  groundnut: { label: "Groundnut (t/ha)", color: "var(--chart-4)" },
} satisfies ChartConfig;

function ChartCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-card">
      <CardHeader><CardTitle className="font-display text-lg">{title}</CardTitle><CardDescription>{desc}</CardDescription></CardHeader>
      <CardContent><ChartContainer config={cfg} className="h-64 w-full">{children as React.ReactElement}</ChartContainer></CardContent>
    </Card>
  );
}

function Analytics() {
  const totalRain = HISTORY.reduce((s, h) => s + h.rainfall, 0);
  const totalIrr = HISTORY.reduce((s, h) => s + h.irrigation, 0);
  const avgMoist = Math.round(HISTORY.reduce((s, h) => s + h.moisture, 0) / HISTORY.length);
  const first = YIELD_HISTORY[0]!.rice, last = YIELD_HISTORY.at(-1)!.rice;
  return (
    <div>
      <PageHeader title="Historical Analytics" subtitle="Seeded sample history for Demo Field A (last 12 months and 7 seasons).">
        <Badge variant="outline">Sample historical data</Badge>
      </PageHeader>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Droplets} label="Avg moisture" value={`${avgMoist}%`} />
        <StatCard icon={CloudRain} label="Annual rainfall" value={`${totalRain} mm`} tone="sky" />
        <StatCard icon={Waves} label="Irrigation hours" value={totalIrr} tone="accent" />
        <StatCard icon={TrendingUp} label="Rice yield growth" value={`+${Math.round(((last - first) / first) * 100)}%`} hint="Since Kharif '22" tone="earth" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Soil moisture trend" desc="Monthly average volumetric moisture">
          <AreaChart data={HISTORY}>
            <CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="moisture" type="monotone" stroke="var(--color-moisture)" fill="var(--color-moisture)" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ChartCard>
        <ChartCard title="Rainfall" desc="Monthly total rainfall">
          <BarChart data={HISTORY}>
            <CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={35} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rainfall" fill="var(--color-rainfall)" radius={4} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Irrigation vs rainfall" desc="Irrigation rises in dry months">
          <LineChart data={HISTORY}>
            <CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={35} />
            <ChartTooltip content={<ChartTooltipContent />} /><Legend />
            <Line dataKey="irrigation" stroke="var(--color-irrigation)" strokeWidth={2} dot={false} />
            <Line dataKey="rainfall" stroke="var(--color-rainfall)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ChartCard>
        <ChartCard title="Crop yield performance" desc="Tonnes per hectare by season">
          <LineChart data={YIELD_HISTORY}>
            <CartesianGrid vertical={false} /><XAxis dataKey="season" tickLine={false} axisLine={false} fontSize={11} /><YAxis tickLine={false} axisLine={false} width={30} />
            <ChartTooltip content={<ChartTooltipContent />} /><Legend />
            <Line dataKey="rice" stroke="var(--color-rice)" strokeWidth={2} />
            <Line dataKey="maize" stroke="var(--color-maize)" strokeWidth={2} />
            <Line dataKey="groundnut" stroke="var(--color-groundnut)" strokeWidth={2} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}
