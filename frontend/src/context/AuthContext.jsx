import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { authApi } from "../api/resources";

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem("sms_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login(username, password);
    const loggedInUser = { username: data.username, role: data.role };
    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (username, password, role) => {
    const { data } = await authApi.register(username, password, role);
    const loggedInUser = { username: data.username, role: data.role };
    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "Admin",
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
