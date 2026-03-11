import { useState, useCallback } from "react";
import { type ClefType, getBaseClef, isKeyboardMode, isChordMode } from "../domain/clef";
import type { NoteData } from "../domain/note";
import { pickRandomNote, pickRandomChord, generateChoices } from "../application/quizService";
import Staff from "./components/Staff";
import HamburgerMenu from "./components/HamburgerMenu";
import PianoKeyboard from "./components/PianoKeyboard";
import "./App.css";

type AnswerState = "waiting" | "correct" | "wrong";

export default function App() {
  const [clef, setClef] = useState<ClefType>("treble");
  const [currentNotes, setCurrentNotes] = useState<NoteData[]>(() => [pickRandomNote("treble")]);
  const [choices, setChoices] = useState<NoteData[]>(() =>
    generateChoices(currentNotes[0], "treble")
  );
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  // 鍵盤モード用: 正解済みのjaName、間違えたname
  const [answeredNames, setAnsweredNames] = useState<Set<string>>(new Set());
  const [wrongName, setWrongName] = useState<string | null>(null);

  const nextQuestion = useCallback(
    (c: ClefType = clef) => {
      if (isChordMode(c)) {
        setCurrentNotes(pickRandomChord(c));
      } else {
        setCurrentNotes([pickRandomNote(c)]);
      }
      setAnswerState("waiting");
      setSelectedName(null);
      setAnsweredNames(new Set());
      setWrongName(null);
    },
    [clef]
  );

  // choicesはnextQuestionの後に更新（currentNotesの変化に依存しないよう分離）
  const currentNote = currentNotes[0];

  const handleClefChange = (newClef: ClefType) => {
    setClef(newClef);
    nextQuestion(newClef);
  };

  // テキストボタン用
  const handleChoice = (choice: NoteData) => {
    if (answerState !== "waiting") return;
    setSelectedName(choice.name);
    if (choice.name === currentNote.name) {
      setAnswerState("correct");
    } else {
      setAnswerState("wrong");
    }
  };

  // 鍵盤モード用（jaNameで比較）
  const handleKeyboardAnswer = (note: NoteData) => {
    if (answerState !== "waiting") return;

    const correctJaNames = new Set(currentNotes.map((n) => n.jaName));

    if (correctJaNames.has(note.jaName) && !answeredNames.has(note.jaName)) {
      const next = new Set(answeredNames);
      next.add(note.jaName);
      setAnsweredNames(next);
      // 全部当てた？
      if (next.size === currentNotes.length) {
        setAnswerState("correct");
      }
    } else if (!answeredNames.has(note.jaName)) {
      setWrongName(note.name);
      setAnswerState("wrong");
    }
  };

  // choicesを生成（テキストボタンモード用）
  // nextQuestion後にcurrentNotesが変わるので、ここで同期
  const displayChoices = isKeyboardMode(clef)
    ? []
    : generateChoices(currentNote, clef);

  // 不正解時の正解テキスト
  const correctAnswerText = currentNotes
    .map((n) => `${n.jaName}（${n.name}）`)
    .join("、");

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">おんぷクイズ</h1>
        <HamburgerMenu currentClef={clef} onClefChange={handleClefChange} />
      </div>

      <div className="staff-container">
        <Staff notes={currentNotes} clef={getBaseClef(clef)} />
      </div>

      <p className="question">
        {isChordMode(clef) ? "この和音は何？" : "この音符は何？"}
      </p>

      {isKeyboardMode(clef) ? (
        <PianoKeyboard
          clef={clef}
          correctNotes={currentNotes}
          onAnswer={handleKeyboardAnswer}
          answeredNames={answeredNames}
          wrongName={wrongName}
          finished={answerState !== "waiting"}
        />
      ) : (
        <div className="choices">
          {displayChoices.map((choice) => {
            let btnClass = "choice-btn";
            if (answerState !== "waiting" && choice.name === selectedName) {
              btnClass +=
                choice.name === currentNote.name ? " correct" : " wrong";
            }
            if (
              answerState === "wrong" &&
              choice.name === currentNote.name
            ) {
              btnClass += " correct";
            }
            return (
              <button
                key={choice.name}
                className={btnClass}
                onClick={() => handleChoice(choice)}
                disabled={answerState !== "waiting"}
              >
                {choice.jaName}
                <span className="note-name">{choice.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {answerState !== "waiting" && (
        <div className="result-area">
          <p className={`result-text ${answerState}`}>
            {answerState === "correct" ? "正解！" : "残念..."}
          </p>
          {answerState === "wrong" && (
            <p className="correct-answer">
              答えは <strong>{correctAnswerText}</strong>
            </p>
          )}
          <button className="next-btn" onClick={() => nextQuestion()}>
            次の問題
          </button>
        </div>
      )}
    </div>
  );
}
