import ja from "./ja.json";

type TranslationKey = keyof typeof ja;

export function t(key: TranslationKey): string {
  return ja[key];
}

/** ClefType をラベルに変換するショートカット */
export function tClef(clefType: string): string {
  return t(`clef.${clefType}` as TranslationKey);
}
