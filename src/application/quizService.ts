import type { ClefType } from "../domain/clef";
import type { NoteData } from "../domain/note";
import { getNotesForClef } from "../domain/noteCollection";

export function pickRandomNote(clef: ClefType): NoteData {
  const notes = getNotesForClef(clef);
  return notes[Math.floor(Math.random() * notes.length)];
}

// 和音用: 異なるjaNameの音符を3つランダムに選ぶ
export function pickRandomChord(clef: ClefType): NoteData[] {
  const notes = getNotesForClef(clef);
  const shuffled = [...notes].sort(() => Math.random() - 0.5);
  const picked: NoteData[] = [];
  const usedJaNames = new Set<string>();
  for (const n of shuffled) {
    if (!usedJaNames.has(n.jaName)) {
      picked.push(n);
      usedJaNames.add(n.jaName);
      if (picked.length === 3) break;
    }
  }
  return picked.sort((a, b) => a.position - b.position);
}
