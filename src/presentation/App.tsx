import { useState, useCallback } from "react";
import { type ClefType, getBaseClef, isChordMode } from "../domain/clef";
import type { NoteData } from "../domain/note";
import { pickRandomNote, pickRandomChord } from "../application/quizService";
import { t } from "../i18n";
import Staff from "./components/Staff";
import HamburgerMenu from "./components/HamburgerMenu";
import PianoKeyboard from "./components/PianoKeyboard";
import "./App.css";

type AnswerState = "waiting" | "correct" | "wrong";

export default function App() {
  const [clef, setClef] = useState<ClefType>("gClef-keyboard");
  const [currentNotes, setCurrentNotes] = useState<NoteData[]>(() => [pickRandomNote("gClef-keyboard")]);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");

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
      setAnsweredNames(new Set());
      setWrongName(null);
    },
    [clef]
  );

  const handleClefChange = (newClef: ClefType) => {
    setClef(newClef);
    nextQuestion(newClef);
  };

  // 鍵盤モード用（jaNameで比較、同じjaNameは1回タップでOK）
  const handleKeyboardAnswer = (note: NoteData) => {
    if (answerState !== "waiting") return;

    const correctJaNames = new Set(currentNotes.map((n) => n.jaName));

    if (correctJaNames.has(note.jaName) && !answeredNames.has(note.jaName)) {
      const next = new Set(answeredNames);
      next.add(note.jaName);
      setAnsweredNames(next);
      // ユニークなjaName全部当てた？
      if (next.size === correctJaNames.size) {
        setAnswerState("correct");
      }
    } else if (!answeredNames.has(note.jaName)) {
      setWrongName(note.name);
      setAnswerState("wrong");
    }
  };

  // 正解テキスト（正解・不正解どちらでも表示）
  const correctAnswerText = currentNotes
    .map((n) => n.jaName)
    .join("、");

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">{t("app.title")}</h1>
        <HamburgerMenu currentClef={clef} onClefChange={handleClefChange} />
      </div>

      <div className="staff-container">
        <Staff notes={currentNotes} clef={getBaseClef(clef)} />
      </div>

      <p className="question">
        {isChordMode(clef) ? t("quiz.questionChord") : t("quiz.questionNote")}
      </p>

      <PianoKeyboard
        clef={clef}
        correctNotes={currentNotes}
        onAnswer={handleKeyboardAnswer}
        answeredNames={answeredNames}
        wrongName={wrongName}
        finished={answerState !== "waiting"}
      />

      {answerState !== "waiting" && (
        <div className="result-area">
          <p className={`result-text ${answerState}`}>
            {answerState === "correct" ? t("quiz.correct") : t("quiz.wrong")}
          </p>
          <p className="correct-answer">
            {answerState === "wrong" ? t("quiz.answerPrefix") : ""}
            <strong>{correctAnswerText}</strong>
          </p>
          <button className="next-btn" onClick={() => nextQuestion()}>
            {t("quiz.next")}
          </button>
        </div>
      )}
    </div>
  );
}
