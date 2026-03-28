import { AuthProvider } from "./AuthContext";
import App from "./App";

export default function AppRoot() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
