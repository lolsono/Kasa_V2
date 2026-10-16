"use client";

import { useId, useState } from "react";
import styles from "./Collapse.module.css";

/**
 * Panneau repliable (accordéon) accessible.
 *
 * Le titre est un bouton qui ouvre / ferme le contenu. L'état est exposé
 * via `aria-expanded` et relié au panneau par `aria-controls` (identifiant
 * généré avec `useId`, donc unique même si plusieurs Collapse sont affichés).
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {string} props.title - Titre affiché dans l'en-tête cliquable.
 * @param {boolean} [props.defaultOpen=true] - État initial : ouvert (`true`) ou fermé (`false`).
 * @param {React.ReactNode} props.children - Contenu affiché dans le panneau.
 * @returns {JSX.Element} Le panneau repliable.
 *
 * @example
 * <Collapse title="Équipements" defaultOpen={false}>
 *   <p>Wi-Fi, cuisine équipée…</p>
 * </Collapse>
 */
export default function Collapse({ title, defaultOpen = true, children }) {
  /** État d'ouverture du panneau. */
  const [open, setOpen] = useState(defaultOpen);

  /** Identifiant unique reliant le bouton au panneau (ARIA). */
  const panelId = useId();

  return (
    <section className={`${styles.collapse} ${open ? styles.open : ""}`}>
      <h2 className={styles.heading}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{title}</span>
          <svg
            className={styles.chevron}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h2>

      <div id={panelId} className={styles.panel}>
        <div className={styles.inner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </section>
  );
}
