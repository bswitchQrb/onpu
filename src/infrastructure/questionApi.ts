import { apiFetch } from "./apiClient";

export async function fetchWeightedQuestion(mode: string, allQuestions: string[]): Promise<string> {
  const res = await apiFetch<{ question: string }>(`/api/questions/weighted?mode=${mode}`, {
    method: "POST",
    body: JSON.stringify(allQuestions),
  });
  return res.question;
}
