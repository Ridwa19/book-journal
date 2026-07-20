import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bj_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null);
        localStorage.removeItem("bj_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  function loginSuccess({ token: newToken, user: newUser }) {
    localStorage.setItem("bj_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("bj_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
