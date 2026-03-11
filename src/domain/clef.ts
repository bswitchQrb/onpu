export type ClefType = "treble-keyboard" | "treble-chord" | "bass-keyboard" | "bass-chord";

export type BaseClefType = "treble" | "bass";

export function getBaseClef(clef: ClefType): BaseClefType {
  return clef.startsWith("bass") ? "bass" : "treble";
}

export function isChordMode(clef: ClefType): boolean {
  return clef.endsWith("-chord");
}

export interface ClefConfig {
  type: ClefType;
  label: string;
}

export const CLEF_CONFIGS: Record<ClefType, ClefConfig> = {
  "treble-keyboard": {
    type: "treble-keyboard",
    label: "ト音記号（鍵盤）",
  },
  "treble-chord": {
    type: "treble-chord",
    label: "ト音記号（3音）",
  },
  "bass-keyboard": {
    type: "bass-keyboard",
    label: "ヘ音記号（鍵盤）",
  },
  "bass-chord": {
    type: "bass-chord",
    label: "ヘ音記号（3音）",
  },
};
