import type { ClefType } from "../domain/clef";
import type { NoteData } from "../domain/note";
import type { ChordDefinition } from "../domain/chord";
import { CHORD_DEFINITIONS } from "../domain/chord";
import { getNotesForClef } from "../domain/noteCollection";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandomNote(clef: ClefType): NoteData {
  const notes = getNotesForClef(clef);
  return notes[Math.floor(Math.random() * notes.length)];
}

// 和音用: 音符を3つランダムに選ぶ（jaName重複OK）
export function pickRandomChord(clef: ClefType): NoteData[] {
  const picked = shuffle(getNotesForClef(clef)).slice(0, 3);
  return picked.sort((a, b) => a.position - b.position);
}

// コード名モード用: ランダムにコードを選ぶ
export function pickRandomChordName(): ChordDefinition {
  return CHORD_DEFINITIONS[Math.floor(Math.random() * CHORD_DEFINITIONS.length)];
}
