import { useState, useEffect } from "react";
import { fetchStats, fetchWeakPoints, fetchHistory } from "../../infrastructure/answerApi";

interface StatsData {
  totalAnswers: number;
  totalCorrect: number;
  byMode: Record<string, { answers: number; correct: number }>;
}

interface WeakPoint {
  question: string;
  answers: number;
  correct: number;
  rate: number;
}

interface AnswerLog {
  mode: string;
  question: string;
  isCorrect: boolean;
  answeredAt: string;
}

const MODE_LABELS: Record<string, string> = {
  "gClef-keyboard": "ト音記号（単音）",
  "gClef-chord": "ト音記号（3音）",
  "fClef-keyboard": "ヘ音記号（単音）",
  "fClef-chord": "ヘ音記号（3音）",
  "chord-name": "コード",
};

interface StatsPageProps {
  onClose: () => void;
  onLogout: () => void;
}

type Tab = "stats" | "history";

export default function StatsPage({ onClose, onLogout }: StatsPageProps) {
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [weakPoints, setWeakPoints] = useState<Record<string, WeakPoint[]>>({});
  const [history, setHistory] = useState<AnswerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, h] = await Promise.all([fetchStats(), fetchHistory(50)]);
        setStats(s);
        setHistory(h);
        const wp: Record<string, WeakPoint[]> = {};
        for (const mode of Object.keys(s.byMode)) {
          try {
            wp[mode] = await fetchWeakPoints(mode, 3);
          } catch {
            wp[mode] = [];
          }
        }
        setWeakPoints(wp);
      } catch {
        // エラー時は空表示
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rate = (correct: number, total: number) =>
    total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stats-tabs">
          <button
            className={`stats-tab ${tab === "stats" ? "active" : ""}`}
            onClick={() => setTab("stats")}
          >
            成績
          </button>
          <button
            className={`stats-tab ${tab === "history" ? "active" : ""}`}
            onClick={() => setTab("history")}
          >
            履歴
          </button>
        </div>

        {loading && <p className="stats-loading">読み込み中...</p>}

        {!loading && tab === "stats" && stats && (
          <>
            <div className="stats-total">
              <span className="stats-total-rate">{rate(stats.totalCorrect, stats.totalAnswers)}%</span>
              <span className="stats-total-count">
                {stats.totalCorrect} / {stats.totalAnswers} 問正解
              </span>
            </div>

            {Object.entries(stats.byMode).map(([mode, data]) => (
              <div key={mode} className="stats-mode">
                <div className="stats-mode-header">
                  <span className="stats-mode-name">{MODE_LABELS[mode] ?? mode}</span>
                  <span className="stats-mode-rate">
                    {rate(data.correct, data.answers)}%
                    <span className="stats-mode-count">（{data.answers}問）</span>
                  </span>
                </div>
                <div className="stats-bar">
                  <div
                    className="stats-bar-fill"
                    style={{ width: `${rate(data.correct, data.answers)}%` }}
                  />
                </div>
                {weakPoints[mode]?.length > 0 && (
                  <div className="stats-weak">
                    <span className="stats-weak-label">苦手:</span>
                    {weakPoints[mode].map((wp) => (
                      <span key={wp.question} className="stats-weak-item">
                        {wp.question}({rate(wp.correct, wp.answers)}%)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {Object.keys(stats.byMode).length === 0 && (
              <p className="stats-empty">まだ回答記録がありません</p>
            )}
          </>
        )}

        {!loading && tab === "history" && (
          <div className="history-list">
            {history.length === 0 && (
              <p className="stats-empty">まだ回答記録がありません</p>
            )}
            {history.map((log, i) => (
              <div key={i} className={`history-item ${log.isCorrect ? "correct" : "wrong"}`}>
                <span className="history-icon">{log.isCorrect ? "○" : "×"}</span>
                <div className="history-detail">
                  <span className="history-question">{log.question}</span>
                  <span className="history-mode">{MODE_LABELS[log.mode] ?? log.mode}</span>
                </div>
                <span className="history-time">
                  {new Date(log.answeredAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className="auth-submit" onClick={onClose} style={{ marginTop: 16 }}>
          閉じる
        </button>
        <button className="auth-toggle" onClick={onLogout} style={{ marginTop: 8 }}>
          ログアウト
        </button>
      </div>
    </div>
  );
}
