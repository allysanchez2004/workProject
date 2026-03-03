import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api";

type AuthCtx = {
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setTok(t);
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    token,
    loading,
    async login(email, password) {
      const res = await api.login(email, password);
      await setToken(res.access_token);
      setTok(res.access_token);
    },
    async register(email, password) {
      await api.register(email, password);
      const res = await api.login(email, password);
      await setToken(res.access_token);
      setTok(res.access_token);
    },
    async logout() {
      await setToken(null);
      setTok(null);
    }
  }), [token, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
