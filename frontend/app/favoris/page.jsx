"use client";

import { useEffect, useState } from "react";
import LogementCard from "@/components/LogementCard/LogementCard";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getFavorites } from "@/services/favoriteServices";
import styles from "./page.module.css";

export default function FavorisPage() {
  const { user, loading: authLoading } = useAuth();
  const { isFavorite, ready } = useFavorites();
  const [favorites, setFavorites] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error | guest
  const [errorMessage, setErrorMessage] = useState("");

  const userId = user?.id;

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      if (!userId) {
        setStatus("guest");
        return;
      }

      try {
        const data = await getFavorites(userId);
        setFavorites(data);
        setStatus("ready");
      } catch (error) {
        console.error("Erreur getFavorites :", error);
        setErrorMessage(error.message); // message renvoyé par l'API
        setStatus("error");
      }
    }
    load();
  }, [authLoading, userId]);

  // La liste suit le Context : un cœur retiré disparaît tout de suite
  const visibleFavorites = favorites.filter((logement) =>
    isFavorite(logement.id)
  );

  const isLoading =
    authLoading || status === "loading" || (status === "ready" && !ready);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Vos favoris</h1>
          <p className={styles.subtitle}>
            Retrouvez ici tous les logements que vous avez aimés.
            <br />
            Prêts à réserver ? Un simple clic et votre prochain séjour est en
            route.
          </p>
        </header>

        {isLoading && (
          <p className={styles.message}>Chargement de vos favoris…</p>
        )}

        {!authLoading && status === "guest" && (
          <p className={styles.message}>
            Connectez-vous pour retrouver vos favoris.
          </p>
        )}

        {!authLoading && status === "error" && (
          <p className={styles.message} role="alert">
            {errorMessage ||
              "Vos favoris ne sont pas disponibles pour le moment."}
          </p>
        )}

        {!isLoading && status === "ready" && visibleFavorites.length === 0 && (
          <p className={styles.message}>Vous n’avez pas encore de favoris.</p>
        )}

        {!isLoading && status === "ready" && visibleFavorites.length > 0 && (
          <section className={styles.grid} aria-label="Logements favoris">
            {visibleFavorites.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
