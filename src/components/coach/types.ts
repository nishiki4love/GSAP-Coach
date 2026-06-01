import type { DemoTab, SkillGroupId } from "@/data/gsapApiCatalog";
import type { DemoParameterControl, DemoParameterValue, DemoParameterValues } from "./workbench/demoParameterControls";

export type CoachPageId = "demo" | "tutorials" | "coverage" | "scroll-labs" | "plugins" | "performance";

export type ScrollExampleId = "vertical" | "horizontal" | "cleanup";

export type AnimationAction = "play" | "pause" | "reverse" | "restart";

export interface CoverageTotals {
  live: number;
  docs: number;
  dev: number;
}

export interface UtilitySnapshot {
  raw: number;
  clamped: number;
  normalized: number;
  mapped: number;
  snapped: number;
  color: string;
  colorHsl: number[];
  unit: string;
  unitized: string;
  wrapped: number;
  yoyo: number;
  piped: number;
  shuffled: string[];
  randomPick: string;
}

export interface DemoControls {
  activeDemo: DemoTab["id"];
  progress: number;
  observerHint: string;
  stageStatus: string;
  parameterControls: DemoParameterControl[];
  parameterValues: DemoParameterValues;
  setActiveDemo: (demo: DemoTab["id"]) => void;
  runDemo: (demo?: DemoTab["id"], apiId?: string) => void;
  resetStage: () => void;
  controlAnimation: (action: AnimationAction) => void;
  seekAnimation: (value: number) => void;
  updateParameterValue: (apiId: string, parameterId: string, value: DemoParameterValue) => void;
}

export interface ApiSelectionControls {
  selectedGroup: SkillGroupId;
  selectedApiId: string;
  setSelectedGroup: (group: SkillGroupId) => void;
  setSelectedApiId: (apiId: string) => void;
}
