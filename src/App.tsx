import { useState, useCallback } from "react";
import Staff from "./Staff";
import { pickRandomNote, generateChoices } from "./notes";
import type { NoteData } from "./notes";
import "./App.css";

type AnswerState = "waiting" | "correct" | "wrong";

export default function App() {
  const [currentNote, setCurrentNote] = useState<NoteData>(pickRandomNote);
  const [choices, setChoices] = useState<NoteData[]>(() =>
    generateChoices(currentNote)
  );
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const nextQuestion = useCallback(() => {
    const next = pickRandomNote();
    setCurrentNote(next);
    setChoices(generateChoices(next));
    setAnswerState("waiting");
    setSelectedName(null);
  }, []);

  const handleChoice = (choice: NoteData) => {
    if (answerState !== "waiting") return;
    setSelectedName(choice.name);
    setTotal((t) => t + 1);
    if (choice.name === currentNote.name) {
      setAnswerState("correct");
      setScore((s) => s + 1);
    } else {
      setAnswerState("wrong");
    }
  };

  return (
    <div className="app">
      <h1 className="title">おんぷクイズ</h1>
      <p className="score">
        {score} / {total}
      </p>

      <div className="staff-container">
        <Staff note={currentNote} />
      </div>

      <p className="question">この音符はなに？</p>

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
            {answerState === "correct" ? "せいかい！" : "ざんねん..."}
          </p>
          {answerState === "wrong" && (
            <p className="correct-answer">
              こたえは <strong>{currentNote.jaName}（{currentNote.name}）</strong>
            </p>
          )}
          <button className="next-btn" onClick={nextQuestion}>
            つぎの もんだい
          </button>
        </div>
      )}
    </div>
  );
}
