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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe();
      setUser({ id: me.id, loginId: me.loginId, nickname: me.nickname });
      setApiError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        // サーバー接続エラー — トークンは残してエラー表示
        setApiError("サーバーに接続できません");
      } else {
        // 認証エラー — トークン無効
        clearToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setApiError(null);
  }, []);

  const clearApiError = useCallback(() => setApiError(null), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, apiError, refresh, logout, clearApiError }}>
      {children}
    </AuthContext.Provider>
  );
}
