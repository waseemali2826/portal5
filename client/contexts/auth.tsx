import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FbUser } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

type User = { email: string; uid: string } | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);

  // Keep auth state in sync with Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb: FbUser | null) => {
      if (fb?.email) setUser({ email: fb.email, uid: fb.uid });
      else setUser(null);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/dashboard", { replace: true });
          return;
        } catch (e: any) {
          toast({ title: "Sign up failed", description: e?.message ?? "Unable to create account" });
          throw e;
        }
      }
      toast({ title: "Sign in failed", description: err?.message ?? "Check your email/password" });
      throw err;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextType>(() => ({ user, isAuthenticated: !!user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
