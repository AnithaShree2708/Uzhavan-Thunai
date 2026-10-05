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

const conds: DayForecast["condition"][] = ["Partly Cloudy", "Sunny", "Cloudy", "Light Rain", "Rain", "Thunderstorm", "Partly Cloudy"];
const rain = [0, 0, 2, 8, 18, 26, 4];
const chance = [10, 5, 30, 60, 80, 90, 35];
const highs = [31, 33, 31, 29, 27, 26, 29];

export const FORECAST: DayForecast[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 9, 5 + i);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    condition: conds[i],
    high: highs[i],
    low: highs[i] - 7,
    rainMm: rain[i],
    rainChance: chance[i],
    humidity: 62 + chance[i] / 4,
  };
});

export const HISTORY_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export const HISTORY = HISTORY_MONTHS.map((month, i) => ({
  month,
  moisture: [44, 41, 35, 30, 26, 24, 27, 33, 38, 42, 39, 32][i],
  rainfall: [180, 95, 22, 12, 15, 30, 55, 70, 95, 120, 140, 110][i],
  irrigation: [8, 14, 32, 40, 46, 48, 38, 26, 18, 12, 16, 22][i],
}));

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
