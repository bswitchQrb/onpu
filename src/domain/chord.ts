export interface ChordDefinition {
  symbol: string;
  noteNames: string[];
}

export const CHORD_DEFINITIONS: ChordDefinition[] = [
  // メジャー (root + 4 + 7)
  { symbol: "C", noteNames: ["ド", "ミ", "ソ"] },
  { symbol: "C#", noteNames: ["ド#", "ファ", "ソ#"] },
  { symbol: "D", noteNames: ["レ", "ファ#", "ラ"] },
  { symbol: "E♭", noteNames: ["レ#", "ソ", "シ♭"] },
  { symbol: "E", noteNames: ["ミ", "ソ#", "シ"] },
  { symbol: "F", noteNames: ["ファ", "ラ", "ド"] },
  { symbol: "F#", noteNames: ["ファ#", "シ♭", "ド#"] },
  { symbol: "G", noteNames: ["ソ", "シ", "レ"] },
  { symbol: "A♭", noteNames: ["ソ#", "ド", "レ#"] },
  { symbol: "A", noteNames: ["ラ", "ド#", "ミ"] },
  { symbol: "B♭", noteNames: ["シ♭", "レ", "ファ"] },
  { symbol: "B", noteNames: ["シ", "レ#", "ファ#"] },
  // マイナー (root + 3 + 7)
  { symbol: "Cm", noteNames: ["ド", "レ#", "ソ"] },
  { symbol: "C#m", noteNames: ["ド#", "ミ", "ソ#"] },
  { symbol: "Dm", noteNames: ["レ", "ファ", "ラ"] },
  { symbol: "E♭m", noteNames: ["レ#", "ファ#", "シ♭"] },
  { symbol: "Em", noteNames: ["ミ", "ソ", "シ"] },
  { symbol: "Fm", noteNames: ["ファ", "ソ#", "ド"] },
  { symbol: "F#m", noteNames: ["ファ#", "ラ", "ド#"] },
  { symbol: "Gm", noteNames: ["ソ", "シ♭", "レ"] },
  { symbol: "A♭m", noteNames: ["ソ#", "シ", "レ#"] },
  { symbol: "Am", noteNames: ["ラ", "ド", "ミ"] },
  { symbol: "B♭m", noteNames: ["シ♭", "ド#", "ファ"] },
  { symbol: "Bm", noteNames: ["シ", "レ", "ファ#"] },
  // ディミニッシュ (root + 3 + 6)
  { symbol: "Cdim", noteNames: ["ド", "レ#", "ファ#"] },
  { symbol: "C#dim", noteNames: ["ド#", "ミ", "ソ"] },
  { symbol: "Ddim", noteNames: ["レ", "ファ", "ソ#"] },
  { symbol: "E♭dim", noteNames: ["レ#", "ファ#", "ラ"] },
  { symbol: "Edim", noteNames: ["ミ", "ソ", "シ♭"] },
  { symbol: "Fdim", noteNames: ["ファ", "ソ#", "シ"] },
  { symbol: "F#dim", noteNames: ["ファ#", "ラ", "ド"] },
  { symbol: "Gdim", noteNames: ["ソ", "シ♭", "ド#"] },
  { symbol: "A♭dim", noteNames: ["ソ#", "シ", "レ"] },
  { symbol: "Adim", noteNames: ["ラ", "ド", "レ#"] },
  { symbol: "B♭dim", noteNames: ["シ♭", "ド#", "ミ"] },
  { symbol: "Bdim", noteNames: ["シ", "レ", "ファ"] },
  // オーギュメント (root + 4 + 8)
  { symbol: "Caug", noteNames: ["ド", "ミ", "ソ#"] },
  { symbol: "C#aug", noteNames: ["ド#", "ファ", "ラ"] },
  { symbol: "Daug", noteNames: ["レ", "ファ#", "シ♭"] },
  { symbol: "E♭aug", noteNames: ["レ#", "ソ", "シ"] },
  { symbol: "Eaug", noteNames: ["ミ", "ソ#", "ド"] },
  { symbol: "Faug", noteNames: ["ファ", "ラ", "ド#"] },
  { symbol: "F#aug", noteNames: ["ファ#", "シ♭", "レ"] },
  { symbol: "Gaug", noteNames: ["ソ", "シ", "レ#"] },
  { symbol: "A♭aug", noteNames: ["ソ#", "ド", "ミ"] },
  { symbol: "Aaug", noteNames: ["ラ", "ド#", "ファ"] },
  { symbol: "B♭aug", noteNames: ["シ♭", "レ", "ファ#"] },
  { symbol: "Baug", noteNames: ["シ", "レ#", "ソ"] },
];
