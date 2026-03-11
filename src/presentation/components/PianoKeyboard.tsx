import type { NoteData } from "../../domain/note";
import type { ClefType } from "../../domain/clef";
import { getKeyboardNotesForClef } from "../../domain/noteCollection";

interface PianoKeyboardProps {
  clef: ClefType;
  correctNotes: NoteData[];
  onAnswer: (note: NoteData) => void;
  answeredNames: Set<string>;
  wrongName: string | null;
  finished: boolean;
}

// B→CとE→Fの間には黒鍵なし。音名の末尾で判定
function hasBlackKeyAfter(name: string, isLast: boolean): boolean {
  if (isLast) return false;
  const letter = name.slice(0, -1); // "B", "E", "C" etc.
  return letter !== "B" && letter !== "E";
}

export default function PianoKeyboard({
  clef,
  correctNotes,
  onAnswer,
  answeredNames,
  wrongName,
  finished,
}: PianoKeyboardProps) {
  const keyboardNotes = getKeyboardNotesForClef(clef);
  const correctJaNames = new Set(correctNotes.map((n) => n.jaName));

  return (
    <div className="piano-keyboard">
      <div className="piano-keys">
        {keyboardNotes.map((note, i) => {
          let keyClass = "white-key";
          if (answeredNames.has(note.jaName)) {
            keyClass += " correct";
          }
          if (note.name === wrongName) {
            keyClass += " wrong";
          }
          if (finished && wrongName && correctJaNames.has(note.jaName) && !answeredNames.has(note.jaName)) {
            keyClass += " correct";
          }

          return (
            <div key={note.name} className="white-key-wrapper">
              <button
                className={keyClass}
                onClick={() => onAnswer(note)}
                disabled={finished}
              >
                {/* タップ領域のみ */}
              </button>
              {hasBlackKeyAfter(note.name, i === keyboardNotes.length - 1) && (
                <div className="black-key" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
