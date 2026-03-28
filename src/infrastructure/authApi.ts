import { apiFetch, setToken } from "./apiClient";

interface AuthResponse {
  token: string;
  nickname: string;
}

interface UserResponse {
  id: number;
  loginId: string;
  nickname: string;
}

export async function register(loginId: string, password: string, nickname: string): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ loginId, password, nickname }),
  });
  setToken(res.token);
  return res;
}

export async function login(loginId: string, password: string): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  });
  setToken(res.token);
  return res;
}

export async function fetchMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/api/auth/me");
}
