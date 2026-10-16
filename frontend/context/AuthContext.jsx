"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logoutService } from "@/services/auth.services";
import {
  saveUser,
  getUser,
  clearUser,
} from "@/services/sessionStorageServices";

/**
 * Contexte React permettant de partager l'état d'authentification
 * de l'utilisateur dans l'application.
 *
 * @type {React.Context<object | null>}
 */
const AuthContext = createContext(null);

/**
 * Fournit les données et les fonctions liées à l'authentification
 * aux composants enfants de l'application.
 *
 * Initialise l'utilisateur à partir des données sauvegardées
 * dans le sessionStorage.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants
 * à rendre dans le contexte d'authentification.
 * @returns {JSX.Element} Le fournisseur du contexte d'authentification.
 */
export function AuthProvider({ children }) {
  /**
   * Utilisateur actuellement authentifié.
   * Vaut null si aucun utilisateur n'est connecté.
   *
   * @type {[Object|null, Function]}
   */
  const [user, setUser] = useState(null);

  /**
   * Indique si la vérification initiale de la session est en cours.
   *
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Récupère l'utilisateur sauvegardé dans le sessionStorage
   * et met à jour l'état utilisateur du contexte.
   *
   * @returns {Object|null} L'utilisateur sauvegardé, ou null
   * si aucune session utilisateur n'est disponible.
   */
  function refreshUser() {
    const storedUser = getUser();
    setUser(storedUser);
    return storedUser;
  }

  /**
   * Initialise l'état d'authentification au montage du composant.
   *
   * Récupère l'utilisateur sauvegardé puis termine le chargement
   * initial de la session.
   *
   * @returns {void}
   */
  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, []);

  /**
   * Authentifie un utilisateur à partir de son adresse e-mail
   * et de son mot de passe.
   *
   * Enregistre les informations de l'utilisateur après une
   * authentification réussie et met à jour le contexte.
   *
   * @async
   * @param {string} email - Adresse e-mail de l'utilisateur.
   * @param {string} password - Mot de passe de l'utilisateur.
   * @returns {Promise<Object>} Les données renvoyées par le service
   * d'authentification.
   * @throws {Error} Si la réponse ne contient aucun utilisateur.
   * @throws {Error} Si le service d'authentification échoue.
   */
  async function login(email, password) {
    const data = await loginService(email, password);

    const loggedUser = data.user ?? data.data?.user;

    if (!loggedUser) {
      throw new Error("Réponse de connexion inattendue");
    }

    saveUser(loggedUser);
    setUser(loggedUser);
    return data;
  }

  /**
   * Déconnecte l'utilisateur et supprime les informations
   * de session sauvegardées.
   *
   * La session locale est supprimée même si l'appel au service
   * de déconnexion échoue.
   *
   * @async
   * @returns {Promise<void>} Une promesse résolue lorsque
   * le nettoyage de la session locale est terminé.
   */
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

  /**
   * Valeurs et fonctions exposées aux composants consommateurs
   * du contexte d'authentification.
   *
   * @type {Object}
   * @property {Object|null} user - Utilisateur actuellement connecté.
   * @property {boolean} loading - État du chargement initial.
   * @property {boolean} isAuthenticated - Indique si un utilisateur
   * est connecté.
   * @property {(email: string, password: string) => Promise<Object>} login
   * - Fonction de connexion.
   * @property {() => Promise<void>} logout - Fonction de déconnexion.
   * @property {() => Object|null} refreshUser - Recharge l'utilisateur
   * depuis le stockage de session.
   */
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

/**
 * Hook personnalisé permettant d'accéder au contexte
 * d'authentification depuis un composant React.
 *
 * Doit être utilisé à l'intérieur d'un composant enfant
 * de AuthProvider.
 *
 * @returns {Object} Les données et fonctions d'authentification.
 * @throws {Error} Si le hook est appelé en dehors d'un AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
}
