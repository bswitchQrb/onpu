import { useState, useCallback } from "react";
import type { ClefType } from "../domain/clef";
import type { NoteData } from "../domain/note";
import { pickRandomNote, generateChoices } from "../application/quizService";
import Staff from "./components/Staff";
import HamburgerMenu from "./components/HamburgerMenu";
import "./App.css";

type AnswerState = "waiting" | "correct" | "wrong";

export default function App() {
  const [clef, setClef] = useState<ClefType>("treble");
  const [currentNote, setCurrentNote] = useState<NoteData>(() => pickRandomNote("treble"));
  const [choices, setChoices] = useState<NoteData[]>(() =>
    generateChoices(currentNote, "treble")
  );
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const nextQuestion = useCallback(
    (c: ClefType = clef) => {
      const next = pickRandomNote(c);
      setCurrentNote(next);
      setChoices(generateChoices(next, c));
      setAnswerState("waiting");
      setSelectedName(null);
    },
    [clef]
  );

  const handleClefChange = (newClef: ClefType) => {
    setClef(newClef);
    nextQuestion(newClef);
  };

  const handleChoice = (choice: NoteData) => {
    if (answerState !== "waiting") return;
    setSelectedName(choice.name);
    if (choice.name === currentNote.name) {
      setAnswerState("correct");
    } else {
      setAnswerState("wrong");
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">おんぷクイズ</h1>
        <HamburgerMenu currentClef={clef} onClefChange={handleClefChange} />
      </div>

      <div className="staff-container">
        <Staff note={currentNote} clef={clef} />
      </div>

      <p className="question">この音符は何？</p>

      <div className="choices">
        {choices.map((choice) => {
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

      {answerState !== "waiting" && (
        <div className="result-area">
          <p className={`result-text ${answerState}`}>
            {answerState === "correct" ? "正解！" : "残念..."}
          </p>
          {answerState === "wrong" && (
            <p className="correct-answer">
              答えは <strong>{currentNote.jaName}（{currentNote.name}）</strong>
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
