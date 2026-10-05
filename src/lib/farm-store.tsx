import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SOIL, type SoilInput } from "./demo-data";
import { farmActions, recommendCrops, recommendIrrigation } from "./engine";

function useFarmState() {
  const [soil, setSoil] = useState<SoilInput>(DEFAULT_SOIL);
  const [analyzedAt, setAnalyzedAt] = useState<Date | null>(null);
  const crops = useMemo(() => recommendCrops(soil), [soil]);
  const irrigation = useMemo(() => recommendIrrigation(soil), [soil]);
  const actions = useMemo(() => farmActions(soil), [soil]);
  return { soil, setSoil, crops, irrigation, actions, analyzedAt, markAnalyzed: () => setAnalyzedAt(new Date()) };
}

type Ctx = ReturnType<typeof useFarmState>;
const FarmCtx = createContext<Ctx | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const v = useFarmState();
  return <FarmCtx.Provider value={v}>{children}</FarmCtx.Provider>;
}

export function useFarm() {
  const c = useContext(FarmCtx);
  if (!c) throw new Error("useFarm must be used inside FarmProvider");
  return c;
}
