import { useState } from "react";
import { login, register } from "../../infrastructure/authApi";
import { useAuth } from "../AuthContext";

interface AuthPageProps {
  onClose: () => void;
}

export default function AuthPage({ onClose }: AuthPageProps) {
  const { refresh } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(loginId, password);
      } else {
        await register(loginId, password, nickname);
      }
      await refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-heading">{isLogin ? "ログイン" : "新規登録"}</h2>

          {!isLogin && (
            <input
              className="auth-input"
              type="text"
              placeholder="ニックネーム"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          )}
          <input
            className="auth-input"
            type="text"
            placeholder="ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={6}
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "..." : isLogin ? "ログイン" : "登録"}
          </button>

          <button
            type="button"
            className="auth-toggle"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "アカウントを作成する" : "ログインに戻る"}
          </button>
        </form>
      </div>
    </div>
  );
}
