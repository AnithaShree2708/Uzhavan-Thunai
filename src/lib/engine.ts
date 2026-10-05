// Transparent rule-based demo recommendation engine.
// Swap with an ML crop model / LLM explanation layer later; keep the same output shapes.
import { FORECAST, totalForecastRain, type SoilInput, type SoilType } from "./demo-data";

export interface Factor {
  name: string;
  value: string;
  impact: number; // 0..1 contribution
  note: string;
}

export interface CropRec {
  crop: string;
  score: number;
  reason: string;
  factors: Factor[];
}

interface CropProfile {
  crop: string;
  ph: [number, number];
  temp: [number, number];
  moisture: [number, number];
  rain: [number, number]; // weekly mm
  n: number;
  p: number;
  k: number;
  soils: SoilType[];
}

const CROPS: CropProfile[] = [
  { crop: "Rice (Paddy)", ph: [5.5, 7], temp: [22, 34], moisture: [35, 70], rain: [30, 120], n: 90, p: 40, k: 40, soils: ["Clay", "Alluvial", "Loamy"] },
  { crop: "Maize", ph: [5.8, 7.2], temp: [20, 32], moisture: [25, 45], rain: [15, 60], n: 100, p: 50, k: 45, soils: ["Loamy", "Alluvial", "Red"] },
  { crop: "Groundnut", ph: [6, 7.5], temp: [24, 33], moisture: [18, 35], rain: [5, 40], n: 25, p: 45, k: 40, soils: ["Sandy", "Red", "Loamy"] },
  { crop: "Cotton", ph: [5.8, 8], temp: [21, 35], moisture: [20, 40], rain: [10, 50], n: 80, p: 40, k: 50, soils: ["Black", "Alluvial", "Loamy"] },
  { crop: "Sugarcane", ph: [6, 7.8], temp: [24, 36], moisture: [35, 65], rain: [25, 100], n: 120, p: 55, k: 60, soils: ["Alluvial", "Loamy", "Clay", "Black"] },
  { crop: "Millets (Ragi)", ph: [5, 7.5], temp: [20, 35], moisture: [12, 30], rain: [0, 35], n: 40, p: 25, k: 25, soils: ["Red", "Sandy", "Loamy"] },
  { crop: "Tomato", ph: [6, 7], temp: [18, 30], moisture: [25, 45], rain: [5, 35], n: 70, p: 60, k: 60, soils: ["Loamy", "Red", "Alluvial"] },
];

const rangeFit = (v: number, [lo, hi]: [number, number]) => {
  if (v >= lo && v <= hi) return 1;
  const span = hi - lo || 1;
  const d = v < lo ? lo - v : v - hi;
  return Math.max(0, 1 - d / span);
};
const nutrientFit = (v: number, need: number) => Math.max(0, 1 - Math.abs(v - need) / Math.max(need, 30));

const W = { ph: 0.2, npk: 0.25, moisture: 0.2, temp: 0.15, rain: 0.1, soil: 0.1 };

export function recommendCrops(s: SoilInput): CropRec[] {
  const rain = totalForecastRain();
  return CROPS.map((c) => {
    const ph = rangeFit(s.ph, c.ph);
    const npk = (nutrientFit(s.nitrogen, c.n) + nutrientFit(s.phosphorus, c.p) + nutrientFit(s.potassium, c.k)) / 3;
    const moist = rangeFit(s.moisture, c.moisture);
    const temp = rangeFit(s.temperature, c.temp);
    const rn = rangeFit(rain, c.rain);
    const soil = c.soils.includes(s.soilType) ? 1 : 0.35;
    const score = Math.round(100 * (ph * W.ph + npk * W.npk + moist * W.moisture + temp * W.temp + rn * W.rain + soil * W.soil));
    const factors: Factor[] = [
      { name: "Soil pH", value: s.ph.toFixed(1), impact: ph, note: `Ideal ${c.ph[0]}–${c.ph[1]}` },
      { name: "NPK balance", value: `${s.nitrogen}/${s.phosphorus}/${s.potassium}`, impact: npk, note: `Needs ~${c.n}/${c.p}/${c.k} kg/ha` },
      { name: "Soil moisture", value: `${s.moisture}%`, impact: moist, note: `Ideal ${c.moisture[0]}–${c.moisture[1]}%` },
      { name: "Temperature", value: `${s.temperature}°C`, impact: temp, note: `Ideal ${c.temp[0]}–${c.temp[1]}°C` },
      { name: "7-day rainfall", value: `${rain} mm`, impact: rn, note: `Ideal ${c.rain[0]}–${c.rain[1]} mm` },
      { name: "Soil type", value: s.soilType, impact: soil, note: `Prefers ${c.soils.join(", ")}` },
    ];
    const strong = [...factors].sort((a, b) => b.impact - a.impact).slice(0, 2).map((f) => f.name.toLowerCase());
    const weak = factors.filter((f) => f.impact < 0.6).map((f) => f.name.toLowerCase());
    const reason = `Strong match on ${strong.join(" and ")}${weak.length ? `; watch ${weak.slice(0, 2).join(", ")}` : ""}.`;
    return { crop: c.crop, score, reason, factors };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export type Priority = "High" | "Medium" | "Low";

export interface IrrigationRec {
  needed: boolean;
  when: string;
  durationMin: number;
  priority: Priority;
  reason: string;
  factors: Factor[];
}

export function recommendIrrigation(s: SoilInput): IrrigationRec {
  const next48 = FORECAST[0].rainMm + FORECAST[1].rainMm;
  const next72Chance = Math.max(FORECAST[0].rainChance, FORECAST[1].rainChance, FORECAST[2].rainChance);
  const deficit = Math.max(0, 40 - s.moisture); // target 40%
  const heat = s.temperature > 32 ? 1.25 : s.temperature < 22 ? 0.8 : 1;
  let duration = Math.round(deficit * 2.2 * heat - next48 * 1.5);
  duration = Math.max(0, Math.min(90, duration));
  const priority: Priority = s.moisture < 22 ? "High" : s.moisture < 32 ? "Medium" : "Low";
  const needed = duration > 5 && !(next72Chance > 75 && s.moisture > 28);
  const day = s.moisture < 22 ? FORECAST[0] : FORECAST[1];
  const when = needed ? `${day.day}, ${day.date} · 06:00 AM` : "Not required in next 48h";
  const reason = !needed
    ? `Soil moisture (${s.moisture}%) is adequate and rain is likely soon — skip irrigation to save water.`
    : `Moisture is ${deficit}% below the 40% target and only ${next48} mm rain expected in 48h. Early-morning watering reduces evaporation.`;
  return {
    needed,
    when,
    durationMin: needed ? duration : 0,
    priority: needed ? priority : "Low",
    reason,
    factors: [
      { name: "Soil moisture deficit", value: `${deficit}%`, impact: Math.min(1, deficit / 25), note: "Target 40% volumetric" },
      { name: "Rain next 48h", value: `${next48} mm`, impact: Math.min(1, next48 / 20), note: "Reduces watering need" },
      { name: "Temperature", value: `${s.temperature}°C`, impact: Math.min(1, Math.max(0, (s.temperature - 18) / 20)), note: "Higher heat → more evaporation" },
      { name: "Max rain chance (72h)", value: `${next72Chance}%`, impact: next72Chance / 100, note: ">75% may defer irrigation" },
    ],
  };
}

export interface FarmAction {
  title: string;
  category: "Irrigation" | "Fertilizer" | "Pest" | "Weather";
  priority: Priority;
  detail: string;
}

export function farmActions(s: SoilInput): FarmAction[] {
  const irr = recommendIrrigation(s);
  const heavyRain = FORECAST.find((d) => d.rainMm >= 20);
  const lowN = s.nitrogen < 60;
  const humid = FORECAST.some((d) => d.humidity > 80);
  return [
    { title: irr.needed ? `Irrigate ${irr.durationMin} min` : "Hold irrigation", category: "Irrigation", priority: irr.priority, detail: irr.reason },
    {
      title: lowN ? "Apply nitrogen top-dressing" : s.ph < 5.8 ? "Apply agricultural lime" : "Fertilizer check: balanced",
      category: "Fertilizer",
      priority: lowN || s.ph < 5.8 ? "Medium" : "Low",
      detail: lowN ? `Nitrogen at ${s.nitrogen} kg/ha is low. Apply urea in split doses before rain.` : s.ph < 5.8 ? `pH ${s.ph} is acidic; lime improves nutrient uptake.` : `NPK ${s.nitrogen}/${s.phosphorus}/${s.potassium} within workable range. Re-test in 3 weeks.`,
    },
    {
      title: "Pest & disease scouting",
      category: "Pest",
      priority: humid ? "Medium" : "Low",
      detail: humid ? "High humidity forecast raises fungal (blast/blight) risk. Inspect leaves twice this week." : "Routine weekly scouting along field edges.",
    },
    {
      title: heavyRain ? `Heavy rain on ${heavyRain.day}` : "No severe weather",
      category: "Weather",
      priority: heavyRain ? "High" : "Low",
      detail: heavyRain ? `${heavyRain.rainMm} mm expected. Clear drainage channels and postpone spraying.` : "Conditions stable for field operations.",
    },
  ];
}
