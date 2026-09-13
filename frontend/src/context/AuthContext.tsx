import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/index.js";
import { api } from "../services/api.js";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("reva_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("reva_auth_token");
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<{ success: boolean; user: User }>("/auth/me");
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem("reva_user", JSON.stringify(res.user));
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>("/auth/login", { email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("reva_auth_token", res.token);
      localStorage.setItem("reva_user", JSON.stringify(res.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("reva_auth_token");
    localStorage.removeItem("reva_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
