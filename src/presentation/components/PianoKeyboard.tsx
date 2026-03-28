import type { NoteData } from "../../domain/note";
import type { ClefType } from "../../domain/clef";
import { getKeyboardNotesForClef } from "../../domain/noteCollection";

interface PianoKeyboardProps {
  clef: ClefType;
  correctJaNames: Set<string>;
  onAnswer: (note: NoteData) => void;
  answeredNames: Set<string>;
  wrongName: string | null;
  finished: boolean;
  matchByName?: boolean; // trueならnote.name（個別鍵盤）でマッチ、falseならjaName（同名一括）
  revealKeys?: Set<string>; // 不正解時にハイライトする具体的なnote.name（指定時はこちらを優先）
}

// B→CとE→Fの間には黒鍵なし。音名の末尾で判定
function hasBlackKeyAfter(name: string, isLast: boolean): boolean {
  if (isLast) return false;
  const letter = name.slice(0, -1); // "B", "E", "C" etc.
  return letter !== "B" && letter !== "E";
}

function getKeyClass(
  note: NoteData,
  base: string,
  answeredNames: Set<string>,
  wrongName: string | null,
  finished: boolean,
  correctJaNames: Set<string>,
  matchByName: boolean,
  revealKeys?: Set<string>,
): string {
  const matchKey = matchByName ? note.name : note.jaName;
  let keyClass = base;

  if (finished && revealKeys) {
    // revealKeysがある場合: ユーザーの回答状態をリセットし、模範解答だけハイライト
    if (revealKeys.has(note.name)) {
      keyClass += " correct";
    }
    if (note.name === wrongName) {
      keyClass += " wrong";
    }
  } else {
    if (answeredNames.has(matchKey)) {
      keyClass += " correct";
    }
    if (note.name === wrongName) {
      keyClass += " wrong";
    }
    // 不正解/答え表示時に正解キーをハイライト
    if (finished && wrongName && correctJaNames.has(note.jaName) && !answeredNames.has(matchKey)) {
      keyClass += " correct";
    }
  }
  return keyClass;
}

export default function PianoKeyboard({
  clef,
  correctJaNames,
  onAnswer,
  answeredNames,
  wrongName,
  finished,
  matchByName = false,
  revealKeys,
}: PianoKeyboardProps) {
  const keyboardNotes = getKeyboardNotesForClef(clef);
  const whiteNotes = keyboardNotes.filter((n) => !n.isBlack);
  const blackNotes = keyboardNotes.filter((n) => n.isBlack);
  const hasInteractiveBlackKeys = blackNotes.length > 0;

  // 黒鍵のNoteDataを白鍵のインデックスにマッピング（白鍵の右側に配置）
  const blackKeyByWhiteIndex = new Map<number, NoteData>();
  if (hasInteractiveBlackKeys) {
    let whiteIdx = 0;
    for (let i = 0; i < keyboardNotes.length; i++) {
      const note = keyboardNotes[i];
      if (note.isBlack) {
        // この黒鍵は直前の白鍵の右側
        blackKeyByWhiteIndex.set(whiteIdx - 1, note);
      } else {
        whiteIdx++;
      }
    }
  }

  return (
    <div className="piano-keyboard">
      <div className="piano-keys">
        {whiteNotes.map((note, i) => {
          const keyClass = getKeyClass(note, "white-key", answeredNames, wrongName, finished, correctJaNames, matchByName, revealKeys);
          const blackNote = hasInteractiveBlackKeys
            ? blackKeyByWhiteIndex.get(i)
            : undefined;

          return (
            <div key={note.name} className="white-key-wrapper">
              <button
                className={keyClass}
                onClick={() => onAnswer(note)}
                disabled={finished}
              >
                {/* タップ領域のみ */}
              </button>
              {hasInteractiveBlackKeys ? (
                blackNote && (
                  <button
                    className={getKeyClass(blackNote, "black-key interactive", answeredNames, wrongName, finished, correctJaNames, matchByName, revealKeys)}
                    onClick={() => onAnswer(blackNote)}
                    disabled={finished}
                  />
                )
              ) : (
                hasBlackKeyAfter(note.name, i === whiteNotes.length - 1) && (
                  <div className="black-key" />
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
