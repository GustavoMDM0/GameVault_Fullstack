"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  // CARREGAR
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    // VOLTAR
    const syncAuthState = () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      setUser(savedUser ? JSON.parse(savedUser) : null);
      setToken(savedToken);
    };

    window.addEventListener("popstate", syncAuthState);
    return () => window.removeEventListener("popstate", syncAuthState);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erro no login" }));
      throw new Error(err.message || "Credenciais inválidas");
    }

    const data = await res.json();
    if (!data?.token || !data?.user) {
      throw new Error("Resposta inválida do servidor");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
