import type { NoteData } from "./notes";

interface StaffProps {
  note: NoteData;
}

const WIDTH = 300;
const HEIGHT = 200;
const LINE_SPACING = 16;
const STAFF_TOP = 50;
const NOTE_X = 190;
// 五線の一番下の線のY座標
const BOTTOM_LINE_Y = STAFF_TOP + 4 * LINE_SPACING;

// position(0=E4の線)からY座標を計算
function noteY(position: number): number {
  return BOTTOM_LINE_Y - position * (LINE_SPACING / 2);
}

export default function Staff({ note }: StaffProps) {
  const ny = noteY(note.position);
  const stemUp = note.position < 4;
  const stemX = stemUp ? NOTE_X + 7 : NOTE_X - 7;
  const stemEndY = stemUp ? ny - 40 : ny + 40;

  // 加線を計算
  const ledgerLines: number[] = [];
  // 下の加線（position -2, -4, ... は線上）
  if (note.position <= -2) {
    for (let p = -2; p >= note.position; p -= 2) {
      ledgerLines.push(noteY(p));
    }
  }
  // 上の加線（position 10, 12, ... は線上）
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

      {/* ト音記号 */}
      <TrebleClef />

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

function TrebleClef() {
  // ト音記号: ソの線（下から2番目 = STAFF_TOP + 3*LINE_SPACING）を巻く
  // SVGテキストでUnicode音楽記号を使用
  // ソの線のY座標
  const soLineY = STAFF_TOP + 3 * LINE_SPACING;

  return (
    <text
      x={68}
      y={soLineY + 24}
      fontSize={100}
      fontFamily="'Noto Music', 'Noto Sans Symbols2', 'Segoe UI Symbol', 'Apple Symbols', serif"
      fill="#333"
      textAnchor="middle"
    >
      {"\u{1D11E}"}
    </text>
  );
}
