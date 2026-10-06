// Demo assistant: keyword-matched, rule-based replies using current farm state.
// Replace with an LLM explanation layer later (keep the same function signature).
import type { SoilInput } from "./demo-data";
import { totalForecastRain } from "./demo-data";
import type { CropRec, IrrigationRec } from "./engine";

export const SUGGESTIONS = [
  "Which crop should I grow?",
  "Should I irrigate today?",
  "How healthy is my soil?",
  "Any weather risks this week?",
];

export function demoReply(q: string, ctx: { soil: SoilInput; crops: CropRec[]; irrigation: IrrigationRec }): string {
  const t = q.toLowerCase();
  const { soil, crops, irrigation } = ctx;
  if (/crop|grow|plant|sow/.test(t)) {
    return `Based on your inputs, **${crops[0]!.crop}** scores highest (${crops[0]!.score}/100), followed by ${crops[1]!.crop} (${crops[1]!.score}) and ${crops[2]!.crop} (${crops[2]!.score}).\n\n${crops[0]!.reason}`;
  }
  if (/irrigat|water/.test(t)) {
    return irrigation.needed
      ? `Yes — schedule **${irrigation.durationMin} minutes** on ${irrigation.when}. ${irrigation.reason}`
      : `Not right now. ${irrigation.reason}`;
  }
  if (/soil|ph|npk|nitrogen|fertil|health/.test(t)) {
    const notes = [
      soil.ph < 5.8 ? `pH ${soil.ph} is acidic — consider lime.` : soil.ph > 7.8 ? `pH ${soil.ph} is alkaline — add organic matter or gypsum.` : `pH ${soil.ph} is in a healthy range.`,
      soil.nitrogen < 60 ? `Nitrogen (${soil.nitrogen} kg/ha) is low — split-apply urea.` : `Nitrogen (${soil.nitrogen} kg/ha) is adequate.`,
      soil.phosphorus < 30 ? `Phosphorus is low — apply DAP/SSP at sowing.` : `Phosphorus is adequate.`,
      soil.potassium < 35 ? `Potassium is low — apply MOP.` : `Potassium is adequate.`,
    ];
    return `Soil health summary for your ${soil.soilType} soil:\n\n- ${notes.join("\n- ")}`;
  }
  if (/weather|rain|forecast|storm/.test(t)) {
    return `About **${totalForecastRain()} mm** of rain is forecast over 7 days, with heavy rain/thunderstorms later in the week. Clear drainage channels and avoid spraying before rain.`;
  }
  return "I'm a demo assistant with predefined answers. Try asking about **crop choice**, **irrigation**, **soil health** or **weather risks**.";
}
