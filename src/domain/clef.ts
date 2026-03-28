export type ClefType = "gClef-keyboard" | "gClef-chord" | "fClef-keyboard" | "fClef-chord" | "chord-name";

export type BaseClefType = "gClef" | "fClef";

// VexFlow が期待する音部記号名
export type VexFlowClef = "treble" | "bass";

export function getBaseClef(clef: ClefType): BaseClefType {
  return clef.startsWith("fClef") ? "fClef" : "gClef";
}

export function isChordMode(clef: ClefType): boolean {
  return clef.endsWith("-chord");
}

export function isChordNameMode(clef: ClefType): boolean {
  return clef === "chord-name";
}

/** ドメインの BaseClefType を VexFlow の音部記号名に変換 */
export function toVexFlowClef(clef: BaseClefType): VexFlowClef {
  return clef === "fClef" ? "bass" : "treble";
}

/** 利用可能な音部記号モード一覧 */
export const CLEF_OPTIONS: ClefType[] = [
  "gClef-keyboard",
  "gClef-chord",
  "fClef-keyboard",
  "fClef-chord",
  "chord-name",
];
