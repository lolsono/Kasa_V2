import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import styles from "./ConversationList.module.css";

/**
 * Colonne de gauche : bouton retour, titre et liste des conversations.
 * La conversation active est mise en évidence, et un point rouge signale
 * les conversations non lues.
 *
 * @param {Object} props
 * @param {import("@/types/typedefs").Conversation[]} props.conversations
 * @param {string} [props.activeId] - Id de la conversation affichée.
 * @param {(id: string) => void} props.onSelect - Appelé au clic sur une conversation.
 * @param {string} [props.className] - Classe supplémentaire (utilisée par la page).
 * @returns {JSX.Element}
 */
export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  className = "",
}) {
  return (
    <aside className={`${styles.root} ${className}`} aria-label="Conversations">
      <div className={styles.header}>
        <Link href="/acceuil" className={styles.back}>
          ← Retour
        </Link>
        <h1 className={styles.title}>Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <p className={styles.empty}>Aucune conversation pour le moment.</p>
      ) : (
        <ul className={styles.list}>
          {conversations.map((conversation) => {
            const lastMessage =
              conversation.messages[conversation.messages.length - 1];
            const isActive = conversation.id === activeId;

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  className={`${styles.item} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onSelect(conversation.id)}
                >
                  <Avatar
                    src={conversation.user.picture}
                    size="md"
                    tone="light"
                  />

                  <span className={styles.text}>
                    <span className={styles.name}>
                      {conversation.user.name}
                    </span>
                    <span className={styles.preview}>{lastMessage?.text}</span>
                  </span>

                  <span className={styles.meta}>
                    <span className={styles.time}>{conversation.time}</span>
                    {conversation.unread && (
                      <span
                        className={styles.dot}
                        role="img"
                        aria-label="Message non lu"
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
