import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getToken, clearToken } from "../infrastructure/apiClient";
import { fetchMe } from "../infrastructure/authApi";

interface AuthUser {
  id: number;
  loginId: string;
  nickname: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  apiError: string | null;
  refresh: () => Promise<void>;
  logout: () => void;
  clearApiError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  apiError: null,
  refresh: async () => {},
  logout: () => {},
  clearApiError: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

/** /me の確認結果。state の更新は呼び出し側でまとめて行う */
type MeResult =
  | { kind: "ok"; user: AuthUser }
  | { kind: "networkError" }
  | { kind: "unauthorized" };

async function loadMe(): Promise<MeResult> {
  try {
    const me = await fetchMe();
    return { kind: "ok", user: { id: me.id, loginId: me.loginId, nickname: me.nickname } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      // サーバー接続エラー — トークンは残してエラー表示
      return { kind: "networkError" };
    }
    // 認証エラー — トークン無効
    clearToken();
    return { kind: "unauthorized" };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // トークンがなければ確認するものがないので、最初から読み込み完了にしておく
  const [loading, setLoading] = useState(() => getToken() !== null);
  const [apiError, setApiError] = useState<string | null>(null);

  const applyMe = useCallback((result: MeResult) => {
    if (result.kind === "ok") {
      setUser(result.user);
      setApiError(null);
    } else if (result.kind === "networkError") {
      setApiError("サーバーに接続できません");
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    applyMe(await loadMe());
  }, [applyMe]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setApiError(null);
  }, []);

  const clearApiError = useCallback(() => setApiError(null), []);

  // 起動時の確認。state は通信が終わってから（.then の中で）更新する
  useEffect(() => {
    if (getToken()) loadMe().then(applyMe);
  }, [applyMe]);

  return (
    <AuthContext.Provider value={{ user, loading, apiError, refresh, logout, clearApiError }}>
      {children}
    </AuthContext.Provider>
  );
}
