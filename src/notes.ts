// ト音記号の音階データ
// position: 五線譜上の位置（0 = 一番下の線(ミ)から半線ずつ上）
export interface NoteData {
  name: string;
  jaName: string;
  position: number; // 五線譜上のY位置（下から数えた線/間の番号）
  ledgerLines?: number; // 加線の数（負:下、正:上）
}

// ト音記号: A3(ラ)〜F5(ファ)まで。加線つきの音も含む
export const NOTES: NoteData[] = [
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

// 選択肢を生成（正解1つ + 不正解2つ、同じ音階名は出さない）
export function generateChoices(correct: NoteData): NoteData[] {
  // jaNameが同じもの（ド-ド、ミ-ミなど）を除外
  const others = NOTES.filter(
    (n) => n.name !== correct.name && n.jaName !== correct.jaName
  );
  const shuffled = others.sort(() => Math.random() - 0.5);
  // 2つ目の不正解もjaNameが被らないようにする
  const wrong1 = shuffled[0];
  const wrong2 = shuffled.find((n) => n.jaName !== wrong1.jaName)!;
  const choices = [correct, wrong1, wrong2];
  return choices.sort(() => Math.random() - 0.5);
}

// ランダムに出題する音符を選ぶ
export function pickRandomNote(): NoteData {
  return NOTES[Math.floor(Math.random() * NOTES.length)];
}
