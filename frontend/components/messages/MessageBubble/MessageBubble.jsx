import Avatar from "../Avatar/Avatar";
import styles from "./MessageBubble.module.css";

/**
 * Un message : avatar, auteur, heure et bulle de texte.
 * Les messages de l'utilisateur connecté sont alignés à droite en rouge,
 * ceux de l'interlocuteur à gauche en blanc.
 *
 * @param {Object} props
 * @param {import("@/types/typedefs").Message} props.message
 * @param {string|null} [props.avatar] - Photo de l'auteur.
 * @returns {JSX.Element}
 */
export default function MessageBubble({ message, avatar = null }) {
  const mine = message.from === "me";

  return (
    <div className={`${styles.message} ${mine ? styles.mine : ""}`}>
      <Avatar src={avatar} size="sm" tone="dark" />

      <div className={styles.content}>
        <p className={styles.meta}>
          {message.author} <span aria-hidden="true">•</span> {message.time}
        </p>
        <p className={styles.bubble}>{message.text}</p>
      </div>
    </div>
  );
}
