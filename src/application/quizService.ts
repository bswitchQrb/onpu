import type { ClefType } from "../domain/clef";
import type { NoteData } from "../domain/note";
import { getNotesForClef } from "../domain/noteCollection";

export function pickRandomNote(clef: ClefType): NoteData {
  const notes = getNotesForClef(clef);
  return notes[Math.floor(Math.random() * notes.length)];
}

// 選択肢を生成（正解1つ + 不正解2つ、同じ音階名は出さない）
export function generateChoices(correct: NoteData, clef: ClefType): NoteData[] {
  const notes = getNotesForClef(clef);
  const others = notes.filter(
    (n) => n.name !== correct.name && n.jaName !== correct.jaName
  );
  const shuffled = others.sort(() => Math.random() - 0.5);
  const wrong1 = shuffled[0];
  const wrong2 = shuffled.find((n) => n.jaName !== wrong1.jaName)!;
  return [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
}
