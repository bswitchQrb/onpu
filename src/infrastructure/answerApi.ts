import { apiFetch } from "./apiClient";

interface StatsResponse {
  totalAnswers: number;
  totalCorrect: number;
  byMode: Record<string, { answers: number; correct: number }>;
}

interface WeakPointResponse {
  question: string;
  answers: number;
  correct: number;
  rate: number;
}

interface AnswerLogResponse {
  mode: string;
  question: string;
  isCorrect: boolean;
  answeredAt: string;
}

export async function fetchHistory(limit = 50): Promise<AnswerLogResponse[]> {
  return apiFetch<AnswerLogResponse[]>(`/api/answers/history?limit=${limit}`);
}

export async function recordAnswer(mode: string, question: string, isCorrect: boolean): Promise<void> {
  await apiFetch("/api/answers", {
    method: "POST",
    body: JSON.stringify({ mode, question, isCorrect }),
  });
}

export async function fetchStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>("/api/stats");
}

export async function fetchWeakPoints(mode: string, limit = 5): Promise<WeakPointResponse[]> {
  return apiFetch<WeakPointResponse[]>(`/api/stats/weak-points?mode=${mode}&limit=${limit}`);
}
