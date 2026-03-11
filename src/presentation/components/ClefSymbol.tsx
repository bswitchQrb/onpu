import type { ClefType } from "../../domain/clef";

interface ClefSymbolProps {
  clef: ClefType;
  staffTop: number;
  lineSpacing: number;
}

export default function ClefSymbol({ clef, staffTop, lineSpacing }: ClefSymbolProps) {
  if (clef === "treble") {
    return <TrebleClef staffTop={staffTop} lineSpacing={lineSpacing} />;
  }
  return <BassClef staffTop={staffTop} lineSpacing={lineSpacing} />;
}

function TrebleClef({ staffTop, lineSpacing }: { staffTop: number; lineSpacing: number }) {
  const soLineY = staffTop + 3 * lineSpacing;
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

function BassClef({ staffTop, lineSpacing }: { staffTop: number; lineSpacing: number }) {
  // ヘ音記号画像を五線に合わせて配置
  // 画像の丸い部分がファの線（上から2番目 = index 1）に来るように
  const staffHeight = 4 * lineSpacing;
  const imgHeight = staffHeight;
  const imgWidth = imgHeight;
  const imgX = 44;
  const imgY = staffTop - lineSpacing * 0.1;

  return (
    <image
      href={`${import.meta.env.BASE_URL}images/clef.png`}
      x={imgX}
      y={imgY}
      width={imgWidth}
      height={imgHeight}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
