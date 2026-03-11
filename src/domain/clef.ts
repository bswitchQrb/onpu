export type ClefType = "treble" | "bass";

export interface ClefConfig {
  type: ClefType;
  label: string;
}

export const CLEF_CONFIGS: Record<ClefType, ClefConfig> = {
  treble: {
    type: "treble",
    label: "ト音記号",
  },
  bass: {
    type: "bass",
    label: "ヘ音記号",
  },
};
