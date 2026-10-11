"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  addFavorite as addFavoriteRequest,
  getFavorites,
  removeFavorite as removeFavoriteRequest,
} from "@/services/favoriteServices";
import {
  clearFavoriteIds,
  getFavoriteIds,
  saveFavoriteIds,
} from "@/services/sessionStorageServices";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [ids, setIds] = useState([]); // ids des logements en favoris
  const [ready, setReady] = useState(false); // true une fois le chargement fini

  // Met à jour le Context ET le localStorage en même temps
  const updateIds = useCallback((updater) => {
    setIds((previous) => {
      const next = updater(previous);
      saveFavoriteIds(next);
      return next;
    });
  }, []);

  // Se relance tout seul à chaque connexion / déconnexion (userId change)
  useEffect(() => {
    if (authLoading) return;

    async function loadFavorites() {
      try {
        // Pas connecté : aucun favori
        if (!userId) {
          setIds([]);
          clearFavoriteIds();
          return;
        }

        setReady(false);
        setIds(getFavoriteIds()); // copie locale : affichage immédiat

        const list = await getFavorites(userId);
        const apiIds = list.map((logement) => logement.id);
        setIds(apiIds); // l'API a le dernier mot
        saveFavoriteIds(apiIds);
      } catch (error) {
        console.error("Erreur chargement des favoris :", error);
      } finally {
        setReady(true);
      }
    }

    loadFavorites();
  }, [authLoading, userId]);

  const addFavorite = useCallback(
    async (propertyId) => {
      if (!userId) {
        throw new Error("Vous devez être connecté");
      }

      // Cœur rouge tout de suite
      updateIds((previous) =>
        previous.includes(propertyId) ? previous : [...previous, propertyId],
      );

      try {
        await addFavoriteRequest(propertyId, userId);
      } catch (error) {
        // L'API a refusé : on annule
        updateIds((previous) => previous.filter((id) => id !== propertyId));
        throw error;
      }
    },
    [updateIds, userId],
  );

  const removeFavorite = useCallback(
    async (propertyId) => {
      updateIds((previous) => previous.filter((id) => id !== propertyId));

      try {
        await removeFavoriteRequest(propertyId);
      } catch (error) {
        // L'API a refusé : on remet le favori
        updateIds((previous) =>
          previous.includes(propertyId) ? previous : [...previous, propertyId],
        );
        throw error;
      }
    },
    [updateIds],
  );

  const value = useMemo(
    () => ({
      ids,
      ready,
      isFavorite: (propertyId) => ids.includes(propertyId),
      addFavorite,
      removeFavorite,
    }),
    [ids, ready, addFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites doit être utilisé dans un <FavoritesProvider>",
    );
  }

  return context;
}
