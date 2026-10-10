"use client";

import { useState } from "react";
import styles from "./LogementCard.module.css";

export default function FavoriteButton({ title }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      className={styles.favorite}
      aria-pressed={active}
      aria-label={
        active ? `Retirer ${title} des favoris` : `Ajouter ${title} aux favoris`
      }
      onClick={() => setActive((v) => !v)}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.6-9.1C1 8.8 2.7 5 6.4 5c2 0 3.6 1.1 4.6 2.6h2C14 6.1 15.6 5 17.6 5c3.7 0 5.4 3.8 4 6.9C19.5 16.4 12 21 12 21z"
          fill={active ? "#a63a1e" : "#6b6b6b"}
        />
      </svg>
    </button>
  );
}
