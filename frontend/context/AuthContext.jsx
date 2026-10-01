"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logoutService } from "@/services/auth.services";
import {
  saveUser,
  getUser,
  clearUser,
} from "@/services/sessionStorageServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Relit l'utilisateur sauvegardé */
  function refreshUser() {
    const storedUser = getUser();
    setUser(storedUser);
    return storedUser;
  }

  /* Au chargement de l'app */
  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, []);

    async function login(email, password) {
    const data = await loginService(email, password);

    const loggedUser = data.user ?? data.data?.user;

    console.log(loggedUser);

    if (!loggedUser) {
        throw new Error("Réponse de connexion inattendue");
    }

    saveUser(loggedUser);
    setUser(loggedUser);
    return data;
    }

  async function logout() {
    try {
      await logoutService();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      clearUser();
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
