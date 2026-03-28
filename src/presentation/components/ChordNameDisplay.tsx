interface ChordNameDisplayProps {
  chordSymbol: string;
}

export default function ChordNameDisplay({ chordSymbol }: ChordNameDisplayProps) {
  return (
    <div className="chord-name-display">
      {chordSymbol}
    </div>
  );
}
