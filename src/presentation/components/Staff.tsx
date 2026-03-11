import type { NoteData } from "../../domain/note";
import type { ClefType } from "../../domain/clef";
import ClefSymbol from "./ClefSymbol";

interface StaffProps {
  note: NoteData;
  clef: ClefType;
}

const WIDTH = 300;
const HEIGHT = 200;
const LINE_SPACING = 16;
const STAFF_TOP = 50;
const NOTE_X = 190;
const BOTTOM_LINE_Y = STAFF_TOP + 4 * LINE_SPACING;

// position(0=一番下の線)からY座標を計算
function noteY(position: number): number {
  return BOTTOM_LINE_Y - position * (LINE_SPACING / 2);
}

export default function Staff({ note, clef }: StaffProps) {
  const ny = noteY(note.position);
  const stemUp = note.position < 4;
  const stemX = stemUp ? NOTE_X + 7 : NOTE_X - 7;
  const stemEndY = stemUp ? ny - 40 : ny + 40;

  // 加線を計算
  const ledgerLines: number[] = [];
  if (note.position <= -2) {
    for (let p = -2; p >= note.position; p -= 2) {
      ledgerLines.push(noteY(p));
    }
  }
  if (note.position >= 10) {
    for (let p = 10; p <= note.position; p += 2) {
      ledgerLines.push(noteY(p));
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {/* 五線 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={40}
          y1={STAFF_TOP + i * LINE_SPACING}
          x2={260}
          y2={STAFF_TOP + i * LINE_SPACING}
          stroke="#444"
          strokeWidth={1.2}
        />
      ))}

      {/* 音記号 */}
      <ClefSymbol clef={clef} staffTop={STAFF_TOP} lineSpacing={LINE_SPACING} />

      {/* 加線 */}
      {ledgerLines.map((ly, i) => (
        <line
          key={`ledger-${i}`}
          x1={NOTE_X - 14}
          y1={ly}
          x2={NOTE_X + 14}
          y2={ly}
          stroke="#444"
          strokeWidth={1.2}
        />
      ))}

      {/* 音符の頭 */}
      <ellipse
        cx={NOTE_X}
        cy={ny}
        rx={7.5}
        ry={5.5}
        fill="#222"
        transform={`rotate(-15 ${NOTE_X} ${ny})`}
      />

      {/* ステム（棒） */}
      <line
        x1={stemX}
        y1={ny}
        x2={stemX}
        y2={stemEndY}
        stroke="#222"
        strokeWidth={1.6}
      />
    </svg>
  );
}
