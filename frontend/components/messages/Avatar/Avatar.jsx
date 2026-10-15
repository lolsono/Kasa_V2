import Image from "next/image";
import styles from "./Avatar.module.css";

/**
 * Avatar carré. Affiche la photo si elle existe, sinon un carré de couleur.
 * Il est décoratif (le nom est toujours affiché à côté), donc masqué
 * aux lecteurs d'écran.
 *
 * @param {Object} props
 * @param {string|null} [props.src] - URL de la photo.
 * @param {"sm"|"md"} [props.size="md"] - `sm` pour les messages, `md` pour la liste.
 * @param {"light"|"dark"} [props.tone="light"] - Couleur du carré sans photo.
 * @returns {JSX.Element}
 */
export default function Avatar({ src = null, size = "md", tone = "light" }) {
  return (
    <span
      className={`${styles.avatar} ${styles[size]} ${styles[tone]}`}
      aria-hidden="true"
    >
      {src && (
        <Image src={src} alt="" fill sizes="44px" className={styles.image} />
      )}
    </span>
  );
}
