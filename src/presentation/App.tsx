import { useState, useCallback, useMemo } from "react";
import { type ClefType, getBaseClef, isChordMode, isChordNameMode } from "../domain/clef";
import type { NoteData } from "../domain/note";
import type { ChordDefinition } from "../domain/chord";
import { pickRandomNote, pickRandomChord, pickRandomChordName, findChordBySymbol, getAllQuestionLabels } from "../application/quizService";
import { getNotesForClef } from "../domain/noteCollection";
import { getKeyboardNotesForClef } from "../domain/noteCollection";
import { recordAnswer } from "../infrastructure/answerApi";
import { fetchWeightedQuestion } from "../infrastructure/questionApi";
import { getToken } from "../infrastructure/apiClient";
import { t } from "../i18n";
import { useAuth } from "./AuthContext";
import Staff from "./components/Staff";
import ChordNameDisplay from "./components/ChordNameDisplay";
import HamburgerMenu from "./components/HamburgerMenu";
import PianoKeyboard from "./components/PianoKeyboard";
import RerollButton from "./components/RerollButton";
import RevealButton from "./components/RevealButton";
import NextButton from "./components/NextButton";
import AuthPage from "./components/AuthPage";
import StatsPage from "./components/StatsPage";
import "./App.css";

type AnswerState = "waiting" | "correct" | "wrong" | "revealed";

// 出題内容を文字列で取得（API記録用）
function getQuestionLabel(clef: ClefType, notes: NoteData[], chord: ChordDefinition | null): string {
  if (isChordNameMode(clef) && chord) return chord.symbol;
  return notes.map((n) => n.name).join(",");
}

export default function App() {
  const { user, logout, apiError, clearApiError } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [weakPointMode, setWeakPointMode] = useState(false);
  const [clef, setClef] = useState<ClefType>("gClef-keyboard");
  const [currentNotes, setCurrentNotes] = useState<NoteData[]>(() => [pickRandomNote("gClef-keyboard")]);
  const [currentChord, setCurrentChord] = useState<ChordDefinition | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");

  // 鍵盤モード用: 正解済みのjaName、間違えたname
  const [answeredNames, setAnsweredNames] = useState<Set<string>>(new Set());
  const [answeredJaNamesForChord, setAnsweredJaNamesForChord] = useState<Set<string>>(new Set());
  const [wrongName, setWrongName] = useState<string | null>(null);

  // 通常出題（ローカルランダム）
  const pickLocal = useCallback((c: ClefType) => {
    if (isChordNameMode(c)) {
      setCurrentChord(pickRandomChordName());
      setCurrentNotes([]);
    } else if (isChordMode(c)) {
      setCurrentChord(null);
      setCurrentNotes(pickRandomChord(c));
    } else {
      setCurrentChord(null);
      setCurrentNotes([pickRandomNote(c)]);
    }
  }, []);

  // 弱点克服出題（APIから重み付き）
  const pickWeighted = useCallback(async (c: ClefType) => {
    try {
      // 和音モードは単音ベースで弱点を取得し、それを含む3音を出題
      const queryMode = isChordMode(c) ? c.replace("-chord", "-keyboard") : c;
      const label = await fetchWeightedQuestion(queryMode, getAllQuestionLabels(queryMode as ClefType));

      if (isChordNameMode(c)) {
        const chord = findChordBySymbol(label);
        if (chord) {
          setCurrentChord(chord);
          setCurrentNotes([]);
          return;
        }
      } else if (isChordMode(c)) {
        // 和音モード: 苦手な音を必ず含む3音を出題
        const allNotes = getNotesForClef(c);
        const weakNote = allNotes.find((n) => n.name === label);
        if (weakNote) {
          const others = allNotes.filter((n) => n.name !== label).sort(() => Math.random() - 0.5).slice(0, 2);
          const picked = [weakNote, ...others].sort((a, b) => a.position - b.position);
          setCurrentChord(null);
          setCurrentNotes(picked);
          return;
        }
      } else {
        // 単音モード: label は "C4" などの note.name
        const allNotes = getNotesForClef(c);
        const note = allNotes.find((n) => n.name === label);
        if (note) {
          setCurrentChord(null);
          setCurrentNotes([note]);
          return;
        }
      }
    } catch {
      // API失敗時はローカルにフォールバック
    }
    pickLocal(c);
  }, [pickLocal]);

  const nextQuestion = useCallback(
    (c: ClefType = clef) => {
      setAnswerState("waiting");
      setAnsweredNames(new Set());
      setAnsweredJaNamesForChord(new Set());
      setWrongName(null);

      if (weakPointMode && getToken()) {
        pickWeighted(c);
      } else {
        pickLocal(c);
      }
    },
    [clef, weakPointMode, pickLocal, pickWeighted]
  );

  const handleClefChange = (newClef: ClefType) => {
    setClef(newClef);
    nextQuestion(newClef);
  };

  // 正解のjaName一覧
  const correctJaNames = useMemo(() => {
    if (isChordNameMode(clef) && currentChord) {
      return new Set(currentChord.noteNames);
    }
    return new Set(currentNotes.map((n) => n.jaName));
  }, [clef, currentChord, currentNotes]);

  const chordNameMode = isChordNameMode(clef);

  // 鍵盤クリック時の回答処理
  const handleKeyboardAnswer = (note: NoteData) => {
    if (answerState !== "waiting") return;

    // コードモード: name（個別鍵盤）で管理、おんぷモード: jaName（同名一括）で管理
    const answerKey = chordNameMode ? note.name : note.jaName;

    if (correctJaNames.has(note.jaName) && !answeredNames.has(answerKey)) {
      const next = new Set(answeredNames);
      next.add(answerKey);
      setAnsweredNames(next);

      if (chordNameMode) {
        // コードモード: 各構成音につき1つ押せばOK
        const nextJa = new Set(answeredJaNamesForChord);
        nextJa.add(note.jaName);
        setAnsweredJaNamesForChord(nextJa);
        if (nextJa.size === correctJaNames.size) {
          setAnswerState("correct");
          if (getToken()) recordAnswer(clef, getQuestionLabel(clef, currentNotes, currentChord), true).catch(() => {});
        }
      } else {
        // おんぷモード: ユニークなjaName全部当てた？
        if (next.size === correctJaNames.size) {
          setAnswerState("correct");
          if (getToken()) recordAnswer(clef, getQuestionLabel(clef, currentNotes, currentChord), true).catch(() => {});
        }
      }
    } else if (!answeredNames.has(answerKey)) {
      setWrongName(note.name);
      setAnswerState("wrong");
      if (getToken()) recordAnswer(clef, getQuestionLabel(clef, currentNotes, currentChord), false).catch(() => {});
    }
  };

  // コードモード: 答え表示時にルート音を最低音にして1オクターブ内でハイライト
  const revealKeys = useMemo(() => {
    if (!chordNameMode || !currentChord) return undefined;
    const keys = getKeyboardNotesForClef("chord-name");
    const result = new Set<string>();
    // ルート音（noteNames[0]）をオクターブ4で配置
    const rootJaName = currentChord.noteNames[0];
    const rootIdx = keys.findIndex((n) => n.jaName === rootJaName && n.name.endsWith("4"));
    if (rootIdx === -1) return undefined;
    result.add(keys[rootIdx].name);
    // 残りの構成音はルートより上で最も近いものを選ぶ
    for (let i = 1; i < currentChord.noteNames.length; i++) {
      const jaName = currentChord.noteNames[i];
      const found = keys.find((n, idx) => idx > rootIdx && n.jaName === jaName);
      if (found) result.add(found.name);
    }
    return result;
  }, [chordNameMode, currentChord]);

  // 正解テキスト（正解・不正解どちらでも表示）
  const correctAnswerText = isChordNameMode(clef) && currentChord
    ? currentChord.noteNames.join("、")
    : currentNotes.map((n) => n.jaName).join("、");

  // 質問テキスト
  const questionText = isChordNameMode(clef)
    ? t("quiz.questionChordName")
    : isChordMode(clef)
      ? t("quiz.questionChord")
      : t("quiz.questionNote");

  return (
    <div className="app">
      <div className="header">
        {user ? (
          <button className="user-btn" onClick={() => setShowStats(true)} title="成績を見る">
            {user.nickname}
          </button>
        ) : (
          <button className="user-btn login" onClick={() => setShowAuth(true)}>
            ログイン
          </button>
        )}
        <h1 className="title">{t("app.title")}</h1>
        <HamburgerMenu
          currentClef={clef}
          onClefChange={handleClefChange}
          weakPointMode={weakPointMode}
          onWeakPointToggle={setWeakPointMode}
          isLoggedIn={!!user}
        />
      </div>

      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
      {showStats && <StatsPage onClose={() => setShowStats(false)} onLogout={() => { setShowStats(false); logout(); }} />}

      {apiError && (
        <div className="api-error-banner" onClick={clearApiError}>
          {apiError}（タップで閉じる）
        </div>
      )}

      <div className="staff-container">
        {isChordNameMode(clef) && currentChord ? (
          <ChordNameDisplay chordSymbol={currentChord.symbol} />
        ) : (
          <Staff notes={currentNotes} clef={getBaseClef(clef)} />
        )}
        <RerollButton onClick={() => nextQuestion()} />
      </div>

      {weakPointMode && <p className="weak-point-badge">弱点克服モード</p>}

      <p className="question">{questionText}</p>

      <PianoKeyboard
        clef={clef}
        correctJaNames={correctJaNames}
        onAnswer={handleKeyboardAnswer}
        answeredNames={answeredNames}
        wrongName={wrongName}
        finished={answerState !== "waiting"}
        matchByName={chordNameMode}
        revealKeys={revealKeys}
      />

      {answerState === "waiting" && (
        <RevealButton onClick={() => setAnswerState("revealed")} />
      )}

      {answerState !== "waiting" && (
        <div className="result-area">
          <p className={`result-text ${answerState}`}>
            {answerState === "correct" ? t("quiz.correct") : answerState === "revealed" ? "" : t("quiz.wrong")}
          </p>
          <p className="correct-answer">
            {answerState !== "correct" ? t("quiz.answerPrefix") : ""}
            <strong>{correctAnswerText}</strong>
          </p>
          <NextButton onClick={() => nextQuestion()} />
        </div>
      )}
    </div>
  );
}
