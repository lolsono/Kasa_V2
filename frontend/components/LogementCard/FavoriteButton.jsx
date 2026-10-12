"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./LogementCard.module.css";

/**
 * Bouton cœur permettant d'ajouter un logement aux favoris ou de l'en retirer.
 *
 * - L'état (cœur rouge ou gris) est lu dans `FavoritesContext`.
 * - Un clic ajoute le logement s'il n'est pas favori, le retire sinon.
 * - Les clics sont ignorés tant qu'une requête est en cours.
 * - En cas d'erreur, le message renvoyé par l'API est affiché dans une bulle
 *   (`role="alert"`) qui disparaît après 4 secondes.
 *
 * @param {Object} props
 * @param {string} props.id - Id du logement.
 * @param {string} props.title - Titre du logement (utilisé pour l'accessibilité).
 * @returns {JSX.Element}
 */
export default function FavoriteButton({ id, title }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const active = isFavorite(id);

  // Le message d'erreur disparaît tout seul après 4 secondes
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  async function handleClick() {
    if (pending) return;

    setPending(true);
    setErrorMessage("");

    try {
      if (active) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (error) {
      console.error("Erreur favori :", error);
      setErrorMessage(error.message); // message renvoyé par l'API
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`${styles.favorite} ${active ? styles.favoriteActive : ""}`}
        aria-pressed={active}
        aria-label={
          active
            ? `Retirer ${title} des favoris`
            : `Ajouter ${title} aux favoris`
        }
        onClick={handleClick}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s-7.5-4.6-9.6-9.1C1 8.8 2.7 5 6.4 5c2 0 3.6 1.1 4.6 2.6h2C14 6.1 15.6 5 17.6 5c3.7 0 5.4 3.8 4 6.9C19.5 16.4 12 21 12 21z"
            fill={active ? "#fff" : "#6b6b6b"}
          />
        </svg>
      </button>

      {errorMessage && (
        <p role="alert" className={styles.favoriteError}>
          {errorMessage}
        </p>
      )}
    </>
  );
}
