import type { ClefType } from "./clef";
import type { NoteData } from "./note";

// ト音記号: position 0 = E4（一番下の線）
export const TREBLE_NOTES: NoteData[] = [
  { name: "A3", jaName: "ラ", position: -4, ledgerLines: -2 },
  { name: "B3", jaName: "シ", position: -3, ledgerLines: -1 },
  { name: "C4", jaName: "ド", position: -2, ledgerLines: -1 },
  { name: "D4", jaName: "レ", position: -1 },
  { name: "E4", jaName: "ミ", position: 0 },
  { name: "F4", jaName: "ファ", position: 1 },
  { name: "G4", jaName: "ソ", position: 2 },
  { name: "A4", jaName: "ラ", position: 3 },
  { name: "B4", jaName: "シ", position: 4 },
  { name: "C5", jaName: "ド", position: 5 },
  { name: "D5", jaName: "レ", position: 6 },
  { name: "E5", jaName: "ミ", position: 7 },
  { name: "F5", jaName: "ファ", position: 8 },
  { name: "G5", jaName: "ソ", position: 9, ledgerLines: 1 },
  { name: "A5", jaName: "ラ", position: 10, ledgerLines: 1 },
];

// ヘ音記号: position 0 = G2（一番下の線）
// 下の加線は出さない（G2から開始）
export const BASS_NOTES: NoteData[] = [
  { name: "G2", jaName: "ソ", position: 0 },
  { name: "A2", jaName: "ラ", position: 1 },
  { name: "B2", jaName: "シ", position: 2 },
  { name: "C3", jaName: "ド", position: 3 },
  { name: "D3", jaName: "レ", position: 4 },
  { name: "E3", jaName: "ミ", position: 5 },
  { name: "F3", jaName: "ファ", position: 6 },
  { name: "G3", jaName: "ソ", position: 7 },
  { name: "A3", jaName: "ラ", position: 8 },
  { name: "B3", jaName: "シ", position: 9, ledgerLines: 1 },
  { name: "C4", jaName: "ド", position: 10, ledgerLines: 1 },
];

// ト音記号 鍵盤UI用（F3〜B5）
export const TREBLE_KEYBOARD_NOTES: NoteData[] = [
  { name: "F3", jaName: "ファ", position: -6, ledgerLines: -3 },
  { name: "G3", jaName: "ソ", position: -5, ledgerLines: -2 },
  ...TREBLE_NOTES,
  { name: "B5", jaName: "シ", position: 11, ledgerLines: 2 },
];

// ヘ音記号 鍵盤UI用（E2〜B3）18白鍵でト音と揃える
export const BASS_KEYBOARD_NOTES: NoteData[] = [
  { name: "E2", jaName: "ミ", position: -3, ledgerLines: -1 },
  { name: "F2", jaName: "ファ", position: -2, ledgerLines: -1 },
  ...BASS_NOTES,
  { name: "D4", jaName: "レ", position: 11, ledgerLines: 2 },
  { name: "E4", jaName: "ミ", position: 12, ledgerLines: 2 },
  { name: "F4", jaName: "ファ", position: 13, ledgerLines: 3 },
  { name: "G4", jaName: "ソ", position: 14, ledgerLines: 3 },
  { name: "A4", jaName: "ラ", position: 15, ledgerLines: 4 },
];

import { getBaseClef } from "./clef";

export function getNotesForClef(clef: ClefType): NoteData[] {
  return getBaseClef(clef) === "bass" ? BASS_NOTES : TREBLE_NOTES;
}

export function getKeyboardNotesForClef(clef: ClefType): NoteData[] {
  return getBaseClef(clef) === "bass" ? BASS_KEYBOARD_NOTES : TREBLE_KEYBOARD_NOTES;
}
