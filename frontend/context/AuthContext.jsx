"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    login as loginService, getCurrentUser, logoutService} from "@/services/auth.services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
     * Récupération de l'utilisateur connecté
     */
    async function refreshUser() {

        const data = await getCurrentUser();

        setUser(data.data.user);

        return data.data.user;
    }

    /*
     * Au chargement de l'application,
     * on vérifie si une session existe.
     */
    useEffect(() => {

        async function checkAuthentication() {

            try {
                await refreshUser();
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuthentication();

    }, []);

    /*
     * Connexion
     */
    async function login(email, password) {

        const data = await loginService(
            email,
            password
        );

        setUser(data.data.user);

        return data;
    }

    /*
     * Déconnexion
     */
    async function logout() {
        try {
            await logoutService();
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        } finally {
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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/*
 * Hook permettant d'utiliser
 * l'authentification facilement.
 */
export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth doit être utilisé dans un AuthProvider"
        );
    }

    return context;
}
