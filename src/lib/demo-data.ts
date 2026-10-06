// DEMO DATA — all values here are simulated. Replace with real API adapters later
// (weather API, soil IoT sensors, ML crop model, LLM explanation layer).

export type SoilType = "Loamy" | "Clay" | "Sandy" | "Black" | "Red" | "Alluvial";

export interface SoilInput {
  moisture: number; // %
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  temperature: number; // °C
  soilType: SoilType;
}

export const SOIL_TYPES: SoilType[] = ["Loamy", "Clay", "Sandy", "Black", "Red", "Alluvial"];

export const DEFAULT_SOIL: SoilInput = {
  moisture: 32,
  ph: 6.6,
  nitrogen: 85,
  phosphorus: 42,
  potassium: 48,
  temperature: 29,
  soilType: "Alluvial",
};

export const FARM = {
  name: "Demo Field A · Kanchipuram",
  area: "2.4 ha",
  currentCrop: "Paddy (Rice)",
  sowingDate: "2026-08-12",
};

export interface DayForecast {
  day: string;
  date: string;
  condition: "Sunny" | "Partly Cloudy" | "Cloudy" | "Light Rain" | "Rain" | "Thunderstorm";
  high: number;
  low: number;
  rainMm: number;
  rainChance: number;
  humidity: number;
}

export const CURRENT_WEATHER = {
  temperature: 30,
  humidity: 72,
  windKmh: 11,
  condition: "Partly Cloudy" as DayForecast["condition"],
  uvIndex: 7,
};

const DAYS: { condition: DayForecast["condition"]; high: number; rainMm: number; rainChance: number }[] = [
  { condition: "Partly Cloudy", high: 31, rainMm: 0, rainChance: 10 },
  { condition: "Sunny", high: 33, rainMm: 0, rainChance: 5 },
  { condition: "Cloudy", high: 31, rainMm: 2, rainChance: 30 },
  { condition: "Light Rain", high: 29, rainMm: 8, rainChance: 60 },
  { condition: "Rain", high: 27, rainMm: 18, rainChance: 80 },
  { condition: "Thunderstorm", high: 26, rainMm: 26, rainChance: 90 },
  { condition: "Partly Cloudy", high: 29, rainMm: 4, rainChance: 35 },
];

export const FORECAST: DayForecast[] = DAYS.map((w, i) => {
  const d = new Date(2026, 9, 5 + i);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    condition: w.condition,
    high: w.high,
    low: w.high - 7,
    rainMm: w.rainMm,
    rainChance: w.rainChance,
    humidity: 62 + w.rainChance / 4,
  };
});

export const HISTORY_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export const HISTORY = [
  { month: "Nov", moisture: 44, rainfall: 180, irrigation: 8 },
  { month: "Dec", moisture: 41, rainfall: 95, irrigation: 14 },
  { month: "Jan", moisture: 35, rainfall: 22, irrigation: 32 },
  { month: "Feb", moisture: 30, rainfall: 12, irrigation: 40 },
  { month: "Mar", moisture: 26, rainfall: 15, irrigation: 46 },
  { month: "Apr", moisture: 24, rainfall: 30, irrigation: 48 },
  { month: "May", moisture: 27, rainfall: 55, irrigation: 38 },
  { month: "Jun", moisture: 33, rainfall: 70, irrigation: 26 },
  { month: "Jul", moisture: 38, rainfall: 95, irrigation: 18 },
  { month: "Aug", moisture: 42, rainfall: 120, irrigation: 12 },
  { month: "Sep", moisture: 39, rainfall: 140, irrigation: 16 },
  { month: "Oct", moisture: 32, rainfall: 110, irrigation: 22 },
];

export const YIELD_HISTORY = [
  { season: "Kharif '22", rice: 4.1, groundnut: 1.6, maize: 3.2 },
  { season: "Rabi '23", rice: 3.8, groundnut: 1.8, maize: 3.6 },
  { season: "Kharif '23", rice: 4.4, groundnut: 1.7, maize: 3.4 },
  { season: "Rabi '24", rice: 4.0, groundnut: 2.0, maize: 3.9 },
  { season: "Kharif '24", rice: 4.7, groundnut: 1.9, maize: 3.7 },
  { season: "Rabi '25", rice: 4.5, groundnut: 2.2, maize: 4.1 },
  { season: "Kharif '25", rice: 5.0, groundnut: 2.1, maize: 4.0 },
];

export const totalForecastRain = () => FORECAST.reduce((s, d) => s + d.rainMm, 0);
